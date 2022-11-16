import express from 'express';
import { apiAction, ResponseData } from '../tools/api-action';
import { getQueryString } from '../tools/get-query-data';
import { EditBaseType } from './edit-types/edit-base-type';
import { FilterBaseType } from './filter-types/filter-base-type';
import { ListBaseType } from './list-types/list-base-type';
import { ModelAdminListAction } from './model-admin-list-action';
import type { YiAdmin } from './yi-admin';

export function createApiRouter({
  yiAdmin,
  basePath,
}: {
    yiAdmin: YiAdmin;
    basePath: string;
  }) {
  // eslint-disable-next-line new-cap
  const router = express.Router();
  router.get('/site-menu/', apiAction(async () => {
    return {
      success: true,
      data: yiAdmin.siteNavMenu,
    };
  }));
  router.get('/site-config/', apiAction(async () => {
    return {
      success: true,
      data: yiAdmin.siteConfig,
    };
  }));


  /**
    * 拉取列表页的字段信息
    */
  router.get('/list-fields/', apiAction(async (req) => {
    const modelName = getQueryString(req.query, 'modelName');

    const modelAdmin = yiAdmin.modelAdminsMap[modelName];
    const fields = modelAdmin.getDataListFieldsAfterFilter();
    const filterFields = modelAdmin.getFilterFields();
    return {
      success: true,
      data: {
        fields,
        filterFields,
        modelInfo: {
          title: modelAdmin.title,
          name: modelAdmin.name,
        },
      },
    };
  }));

  /**
   * 拉取列表页的字段信息
   */
  router.get('/list-actions/', apiAction(async (req) => {
    const modelName = getQueryString(req.query, 'modelName');
    const actions = yiAdmin.modelAdminsMap[modelName].listActions;
    return {
      success: true,
      data: actions,
    };
  }));

  // 表单组件的请求
  router.post('/list-component-action/', apiAction(async (req) => {
    const modelName = getQueryString(req.query, 'modelName');
    const fields = yiAdmin.modelAdminsMap[modelName].getDataListFields();

    const { fieldName, actionName, actionData } = {
      ...req.query,
      ...req.body,
    } as Record<string, any>;
    let listField: ListBaseType | null = null;

    for (let i = 0; i < fields.length; i += 1) {
      const f = fields[i];
      if (f.fieldName === fieldName) {
        listField = f;
        break;
      }
    }

    if (listField) {
      const result = await listField.action(actionName, actionData, {
        method: req.method.toUpperCase(),
        query: req.query,
        body: req.body,
        // @ts-ignore
        files: req.files,
      });
      if (result !== undefined) {
        return (result as ResponseData<unknown>);
      }
    }

    return {
      success: false,
      message: '未找到该字段对应的组件',
      data: null,
    };
  }));

  // filter组件的请求
  router.post('/list-filter-component-action/', apiAction(async (req) => {
    const modelName = getQueryString(req.query, 'modelName');
    const fields = yiAdmin.modelAdminsMap[modelName].getFilterFields();

    const { fieldName, actionName, actionData } = {
      ...req.query,
      ...req.body,
    } as Record<string, any>;
    let listFilterField: FilterBaseType | null = null;

    for (let i = 0; i < fields.length; i += 1) {
      const f = fields[i];
      if (f.fieldName === fieldName) {
        listFilterField = f;
        break;
      }
    }

    if (listFilterField) {
      const result = await listFilterField.action(actionName, actionData, {
        method: req.method.toUpperCase(),
        query: req.query,
        body: req.body,
        // @ts-ignore
        files: req.files,
      }, yiAdmin.modelAdminsMap[modelName]);
      if (result !== undefined) {
        return result as ResponseData<unknown>;
      }
    }

    return {
      success: false,
      message: '未找到该字段对应的组件',
      data: null,
    };
  }));

  /**
   * 拉取列表页的数据
   */
  router.get('/list-data/', apiAction(async (req, res) => {
    const modelName = getQueryString(req.query, 'modelName');
    const {
      pageIndex = '1', pageSize = '10', sort = '', filter = '{}',
    } = req.query;
    const pageIndexNumber = Number.parseInt(String(pageIndex), 10);
    const pageSizeNumber = Number.parseInt(String(pageSize), 10);
    if (typeof pageIndexNumber !== 'number' || pageIndexNumber < 1) throw new Error('pageIndex必须是>=1的整数');
    if (typeof pageSizeNumber !== 'number' || pageSizeNumber < 1) throw new Error('pageSize必须是>=1的整数');

    const filterData = JSON.parse(String(filter));
    const parsedFilter: {
            [key: string]: any;
         } = {
           ...filterData,
         };
    const filterFields = yiAdmin.modelAdminsMap[modelName].getFilterFields();
    filterFields.forEach((filterItem: { fieldName: string | number; getConditions: (arg0: any) => any }) => {
      if (Object.prototype.hasOwnProperty.call(filterData, filterItem.fieldName)) {
        const condition = filterItem.getConditions(filterData[filterItem.fieldName]);
        delete parsedFilter[filterItem.fieldName];
        Object.assign(parsedFilter, condition);
      }
    });

    const afterFilterData = await yiAdmin.modelAdminsMap[modelName].getDataListAfterFilter({
      pageIndex: pageIndexNumber,
      pageSize: pageSizeNumber,
      sort: String(sort),
      conditions: parsedFilter,
    }, { req, res });
    return {
      success: true,
      data: afterFilterData,
    };
  }));

  /**
    * 执行列表操作
    */
  router.post('/list-action/', apiAction(async (req) => {
    const modelName = getQueryString(req.query, 'modelName');
    const actions = yiAdmin.modelAdminsMap[modelName].listActions;
    const {
      actionName = '',
      idList = [],
    } = req.body;

    let action: ModelAdminListAction | null = null;
    for (let i = 0; i < actions.length; i += 1) {
      if (actions[i].actionName === actionName) {
        action = actions[i];
        break;
      }
    }

    if (!action) throw new Error('未找到对应的操作动作');

    const result = await action.actionFunc(idList);

    return {
      success: true,
      data: result || {
        successfulNum: 0,
        failedNum: 0,
      },
    };
  }));


  // 编辑相关


  // 获取表单编辑页的字段
  router.get('/edit-fields/', apiAction(async (req) => {
    const modelName = getQueryString(req.query, 'modelName');
    const modelAdmin = yiAdmin.modelAdminsMap[modelName];
    const fields = modelAdmin.getEditFormFieldsAfterFilter();
    return ({
      success: true,
      data: {
        fields,
        modelInfo: {
          title: modelAdmin.title,
          name: modelAdmin.name,
        },
      },
    });
  }));

  router.get('/edit-values/', apiAction(async (req, res) => {
    const modelName = getQueryString(req.query, 'modelName');
    const { id } = req.query;
    const values = await yiAdmin.modelAdminsMap[modelName].getEditData(String(id), {
      req, res,
    });
    return ({
      success: true,
      data: values,
    });
  }));

  // 表单组件的请求
  router.all('/edit-component-action/', apiAction(async (req) => {
    const modelName = getQueryString(req.query, 'modelName');
    const fields = yiAdmin.modelAdminsMap[modelName].getEditFormFields();
    const { fieldName, actionName, actionData } = {
      ...req.query,
      ...req.body,
    } as Record<string, any>;

    let editField: EditBaseType | null = null;

    for (let i = 0; i < fields.length; i += 1) {
      const f = fields[i];
      if (f.fieldName === fieldName) {
        editField = f;
        break;
      }
    }

    if (editField) {
      const result = await editField.action(actionName, actionData, {
        method: req.method.toUpperCase(),
        query: req.query,
        body: req.body,
        // @ts-ignore
        files: req.files,
      });
      if (result !== undefined) {
        return (result as ResponseData<unknown>);
      }
    }

    return ({
      success: false,
      message: '未找到该字段对应的组件',
      data: null,
    });
  }));

  router.post('/edit-submit/', apiAction(async (req, res) => {
    const modelName = getQueryString(req.query, 'modelName');
    const { editId = '', formData = {} } = req.body;
    const value = await yiAdmin.modelAdminsMap[modelName].formSubmit(editId, formData, { req, res });
    return ({
      success: true,
      data: value,
    });
  }));


  return router;
}


