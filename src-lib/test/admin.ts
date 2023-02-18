// 这是核心代码
import YiAdmin, {
  MongooseModelAdmin, SiteNavMenu, ModelAdminListAction, ListActionResult, SequelizeModelAdmin,
} from '../server/index';
// 这是各种models定义
import YiAdminDemoModel from './models/demo.model';
import { RefFieldClassModel } from './models/demo.refclass.model';
import FileImageModel from './models/file-image.model';
import StringTestModel from './models/string-test.model';
import StringEnumTestModel from './models/string-enum-test.model';
import NumberEnumTestModel from './models/number-enum-test.model';
import StringFileTestModel from './models/string-file.model';
import StringImageTestModel from './models/string-image.model';
import StringWangEditorModel from './models/string-wang.model';
import ArrayTestModel from './models/array-test.model';
import ArrayImageModel from './models/array-image.model';
import ArrayStringEnumModel from './models/array-string-enum.model';
import ObjModel from './models/obj-type.model';
import NumberTestModel from './models/number-test.model';
import { Book } from './sequelizeModels/book.model';

// 实例化一个管理端
const myadmin = new YiAdmin({
  siteConfig: {
    siteName: '测试站点名1',
  },
  csrfParam(req, res): {} {
    return {
      query: {
        _csrf: 'test_csrf',
      },
      body: {
        __csrf: 'test_csrf... body',
      },
    };
  },
});

// 注入各种model
myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'array-image',
  model: ArrayImageModel,
  listFields: ['imgsInfo', 'images1', 'images2', 'createdAt'],
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'array-string-enum',
  model: ArrayStringEnumModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'array',
  model: ArrayTestModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'yi-admin-demo',
  model: YiAdminDemoModel,
  formFieldsExclude: ['createdAt'],
  listFieldsExclude: ['createdAt'],
  listActions: [
    new ModelAdminListAction({
      actionName: '某某操作',
      actionFunc: async (): Promise<ListActionResult> => {
        throw new Error('执行是不可能执行成功的');
      },
      isBatchAction: false,
      isTableRowAction: true,
    }),

    new ModelAdminListAction({
      actionName: '只是_批量执行',
      actionFunc: async (): Promise<ListActionResult> => {
        throw new Error('执行是不可能执行成功的');
      },
      isBatchAction: true,
      isTableRowAction: false,
      buttonType: 'primary',
      buttonDashed: true,
    }),

    new ModelAdminListAction({
      actionName: '不需确认操作',
      actionFunc: async (): Promise<ListActionResult> => ({
        successfulNum: 0,
        failedNum: 0,
      }),
      popConfirm: false,
      buttonDashed: true,
      buttonIcon: 'ok',
    }),

    new ModelAdminListAction({
      actionName: '某某操作',
      actionFunc: async (): Promise<ListActionResult> => {
        throw new Error('执行是不可能执行成功的');
      },
      isBatchAction: false,
      isTableRowAction: true,
    }),
  ],
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'admin-demo-ref',
  title: '关联模型',
  model: RefFieldClassModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'file-image',
  title: '文件和图片测试',
  model: FileImageModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'number-enum-test',
  model: NumberEnumTestModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'number-test',
  model: NumberTestModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'string-enum-test',
  model: StringEnumTestModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'string-file',
  model: StringFileTestModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'string-image',
  model: StringImageTestModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'string',
  model: StringTestModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'string-wangeditor',
  model: StringWangEditorModel,
}));

myadmin.addModelAdmin(new MongooseModelAdmin({
  name: 'obj-type',
  model: ObjModel,
}));

myadmin.addModelAdmin(new SequelizeModelAdmin({
  name: 'sequlize-test',
  title: '图书管理',
  model: Book,
  listFields: ['name', 'description', 'cover', 'json'],
}));


myadmin.siteNavMenu.add(new SiteNavMenu({
  title: '测试菜单1',
  link: 'model-admin/yi-admin-demo/edit/',
}).add(new SiteNavMenu({
  title: '测试子菜单2',
  link: 'https://www.xiwnn.com/',
  icon: 'ok',
})));

myadmin.siteNavMenu.add(new SiteNavMenu({
  title: '测试菜单2',
  icon: 'close',
}).add(new SiteNavMenu({
  title: '测试子菜单2',
  link: 'https://www.baidu.com/',
  icon: 'ok',
})));

// (async function () {
//    const t = await YiAdminDemoModel.findOne();
//    console.log(t);

//    const yad = new YiAdminDemoModel();
//    yad.strField = '哈哈哈';
// //    await yad.save();
// }()).catch(console.error);

export default myadmin;
