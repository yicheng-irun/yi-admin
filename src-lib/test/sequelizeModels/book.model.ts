import { Model, DataTypes, Sequelize } from 'sequelize';
import { EditTypes } from '../../server';
import { FilterTypes } from '../../server/mongoose/mongoose-filter-types';
export const sequelizeObj = new Sequelize('', '', '', {
  host: '',
  port: 0,
  dialect: 'mysql', /* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
  timezone: '+08:00',
  logging: console.log,
});

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
    editType: new EditTypes.EditStringWangEditorType({
      minLength: 2,
      maxLength: 2,
      placeholder: 'ddd',
      uploadImgMaxSize: 1,
      writeFile: async (file) => {
        return {
          url: '',
        };
      },
    }),
  },
}, {
  sequelize: sequelizeObj,
  timestamps: true, // 启用时间戳
  tableName: 'books',
  paranoid: true, // 软删除
});
