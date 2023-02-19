import { Model, DataTypes } from 'sequelize';
import { EditTypes } from '../../server';
import { FilterTypes } from '../../server/mongoose/mongoose-filter-types';
import { sequelizeObj } from './sequelize-conn';


export class Book extends Model {}

Book.init({
  name: {
    type: DataTypes.STRING,
    filterType: new FilterTypes.FilterStringSearchType({
      conditionType: 'string',
    }),
  },
  description: {
    type: DataTypes.STRING,
  },
  cover: {
    type: DataTypes.JSON,
    editType: new EditTypes.EditArrayType({
      childrenType: new EditTypes.EditStringImageType({
        helpText: '图片列表',
        writeFile: EditTypes.EditStringImageType.getFileWriter({
          folder: 'array-images',
        }),
        listStyleMaxHeight: '3em',
      }),
      listStyleInline: true,
      maxLength: 2,
    }),
  },
  json: {
    type: DataTypes.TEXT,
    editType: new EditTypes.EditStringJsonType({
      placeholder: 'ddd请输入json',
    }),
  },
}, {
  sequelize: sequelizeObj,
  timestamps: true, // 启用时间戳
  tableName: 'books',
  paranoid: true, // 软删除
});
