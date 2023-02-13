import { DataTypes, Model, Op } from 'sequelize';
import { EditBaseType } from '../lib/edit-types/edit-base-type';
import { FilterBaseType } from '../lib/filter-types/filter-base-type';
import { ListBaseType } from '../lib/list-types/list-base-type';
import { DataListRequestBody, RequestInfo, DataListResponseBody, ModelAdminBase, ModelAdminBaseParams, ModelDataItem } from '../lib/model-admin-base';
import { ListActionResult, ModelAdminListAction } from '../lib/model-admin-list-action';
import { EditStringType } from '../lib/edit-types/edit-string-type';
import { EditStringEnumType } from '../lib/edit-types/edit-string-enum-type';
import { EditBooleanType } from '../lib/edit-types/edit-boolean-type';
import { EditNumberType } from '../lib/edit-types/edit-number-type';
import { EditDateTimeType } from '../lib/edit-types/edit-date-time-type';
import { EditJsonType } from '../lib/edit-types/edit-json-type';

declare module 'sequelize' {
  // eslint-disable-next-line no-unused-vars
  interface ModelAttributeColumnOptions {
    editType?: EditBaseType;
    filterType?: FilterBaseType;
    name?: string; // 字段名称
    placeholder?: string;
    required?: boolean;
    helpText?: string;
    min?: number;
    max?: number;
    step?: number;
  }
}

type Constructor<T> = new (...args: any[]) => T;
export type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;

const getTypeInstance = (attribute: any) => {
  const { type } = attribute;
  if (
    type instanceof DataTypes.STRING ||
    type instanceof DataTypes.CHAR ||
    type instanceof DataTypes.TEXT ||
    type instanceof DataTypes.CITEXT ||
    type instanceof DataTypes.TSVECTOR
  ) {
    return new EditStringType({
      required: attribute.required,
      minLength: attribute.minlength,
      maxLength: attribute.maxlength,
      fieldNameAlias: attribute.name,
      placeholder: attribute.placeholder || '',
    });
  }
  if (type instanceof DataTypes.ENUM) {
    return new EditStringEnumType({
      enum: attribute.values,
      required: attribute.required,
      fieldNameAlias: attribute.name,
    });
  }

  if (type instanceof DataTypes.BOOLEAN) {
    return new EditBooleanType({
      required: attribute.required,
      fieldNameAlias: attribute.name,
    });
  }
  if (
    type instanceof DataTypes.INTEGER ||
    type instanceof DataTypes.BIGINT ||
    type instanceof DataTypes.FLOAT ||
    type instanceof DataTypes.REAL ||
    type instanceof DataTypes.DOUBLE ||
    type instanceof DataTypes.DECIMAL
  ) {
    return new EditNumberType({
      required: attribute.required,
      min: attribute.min,
      max: attribute.max,
      step: attribute.step || 1,
      fieldNameAlias: attribute.name,
    });
  }
  if (
    type instanceof DataTypes.DATE ||
    type instanceof DataTypes.TIME ||
    type instanceof DataTypes.DATEONLY
  ) {
    return new EditDateTimeType({
      required: attribute.required,
      fieldNameAlias: attribute.name,
    });
  }
  if (type instanceof DataTypes.UUID) {
    return new EditBaseType({
      required: attribute.required,
      fieldNameAlias: attribute.name,
    });
    // return 'String';
  }
  if (type instanceof DataTypes.JSON || type instanceof DataTypes.JSONB) {
    return new EditJsonType({
      required: attribute.required,
      fieldNameAlias: attribute.name,
    });
    // return 'Json';
  }
};

export class SequelizeModelAdmin extends ModelAdminBase {
  public model: ModelType<any>;

  constructor(options: ModelAdminBaseParams & {
    model: any;
  }) {
    super(options);
    this.model = options.model;
    this.appendDeleteListAction();
  }

  /**
   * 增加一个默认的删除使用的列表action
   */
  private appendDeleteListAction(): void {
    this.listActions.push(new ModelAdminListAction({
      actionName: '删除',
      actionFunc: async (idList): Promise<ListActionResult> => {
        if (!Array.isArray(idList) || !idList.length) {
          throw new Error('操作对象idList不能为空');
        }
        const result = await this.model.destroy({
          where: {
            id: idList,
          },
        });
        return {
          successfulNum: result || 0,
          failedNum: idList.length - (result || 0),
        };
      },
      buttonType: 'error',
      buttonIcon: 'delete',
    }));
  }

  /**
   * 获取列表页字段列表
   */
  public getDataListFields(): ListBaseType[] {
    const fields: ListBaseType[] = [];
    console.log('fields:===, ', fields);
    return fields;
  }

  /**
    * data-list中拉取数据的函数，被其他地方依赖
    */
  public async getDataList(req: DataListRequestBody, ctx: RequestInfo): Promise<DataListResponseBody> {
    if (req.conditions['_id']) {
      // if (!isValidObjectId(req.conditions['_id'])) throw new Error('id参数异常');
    }
    const whereObj = {};
    for (const [key, item] of Object.entries(req.conditions)) {
      whereObj[key] = {
        [Op.regexp]: item,
      };
    }
    console.log('排序：===', req.sort);
    const orderObj = [];
    const sortArr = req.sort.split(' ');
    console.log('sortArr;==', sortArr);
    for (const item of sortArr) {
      if (item.startsWith('-')) {
        // 倒叙，要求数据字段不能有开头不能有-字符
        let temp = item.slice(1);
        console.log('temp:==', temp);
        if (temp === '_id') {
          // 特殊所及，把_id换成id, mysql的主键默认为id,这样写在mysql中就不能有_id了。先这样处理，后面看看能不能把id也当做一个配置项
          temp = temp.slice(1);
        }
        console.log('temp:===1', temp);
        orderObj.push([temp, 'DESC']);
      }
    }
    console.log('orderObj:===', orderObj);
    const data = await this.model.findAll({
      where: whereObj,
      order: orderObj,
      limit: req.pageSize,
      offset: (req.pageIndex - 1) * req.pageSize,
    });
    const count = await this.model.count({
      where: req.conditions,
    });
    const modelItems: ModelDataItem[] = data.map((item) => {
      return {
        id: item.id,
        item: item,
        values: item.toJSON(),
      };
    });
    return {
      total: count,
      dataList: modelItems,
    };
  }

  public getEditFormFields(): EditBaseType[] {
    const fields: EditBaseType[] = [];
    const attributes = this.model.getAttributes();
    for (const [key, attribute] of Object.entries(attributes)) {
      // 把自动生成的字段删除
      if (key === 'id' || key === 'deletedAt' || key === 'updatedAt' || key === 'createdAt') {
        continue;
      }
      let typeInstance: EditBaseType | null = null;
      if (attribute?.editType instanceof EditBaseType) {
        typeInstance = attribute.editType;
      } else {
        typeInstance = getTypeInstance(attribute);
      }
      if (typeInstance) {
        typeInstance.fieldName = key;
        if (!typeInstance.fieldNameAlias) {
          typeInstance.fieldNameAlias = '';
        }
        if (typeInstance.componentConfig.helpText === null && attribute.helpText) {
          typeInstance.componentConfig.helpText = `${attribute.helpText}`;
        }
        fields.push(typeInstance);
      }
    }
    return fields;
  }

  /**
    * edit-form中拉取数据的函数
    */
  public async getEditData(id: string, ctx: RequestInfo): Promise<ModelDataItem> {
    let item: Document | null = null;
    if (id) {
      const data = await this.model.findOne({
        where: {
          id,
        },
      });
      item = data.toJSON();
    } else {
      item = this.model.build();
    }

    return {
      id,
      values: {
        ...item,
        _id: undefined,
        __v: undefined,
      },
    };
  }

  public async formSubmit(id: string, formData: {[key: string]: any}, ctx: RequestInfo): Promise<ModelDataItem> {
    let item: any;
    if (id) {
      // 如果id有，更新
      const fItem = await this.model.findOne({
        where: {
          id,
        },
      });
      if (fItem) {
        item = fItem;
      } else {
        throw new Error('未找到该编辑项');
      }
      const formFields = this.getEditFormFields();
      formFields.forEach((field) => {
        const path = field.fieldName;
        item.set(path, formData[path]);
      });
    } else {
      item = this.model.build(formData);
    }
    const itemValue = item.toJSON();
    await item.save();
    return {
      id: id,
      values: {
        ...itemValue,
        _id: undefined,
        __v: undefined,
      },
    };
  }

  /**
    * 获取列表页过滤的参数
    * 通过给表定义添加FilterBaseType等特殊字段实现，但是该字段typescript支持并不友好，先通过忽略的方式实现
    */
  public getFilterFields(): FilterBaseType[] {
    const fields: FilterBaseType[] = [];
    const attributes = this.model.getAttributes();
    for (const [key, attribute] of Object.entries(attributes)) {
      let typeInstance: FilterBaseType | null = null;
      if (attribute.filterType instanceof FilterBaseType) {
        typeInstance = attribute.filterType;
      }
      if (typeInstance) {
        typeInstance.fieldName = key;
        if (!typeInstance.fieldNameAlias) {
          typeInstance.fieldNameAlias = attribute.name || '';
        }
        fields.push(typeInstance);
      }
    }

    return fields;
  }
}
