// import { DataTypes, Model } from 'sequelize';
// import { sequelize } from '..';

// export class Message extends Model {}

// Message.init({
//   // 在这里定义模型属性
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   timestamp: {
//     type: DataTypes.DATE,
//     // allowNull 默认为 true
//   },
//   type: {
//     type: DataTypes.NUMBER,
//   },
//   fromId: {
//     type: DataTypes.STRING,
//   },
//   roomId: {
//     type: DataTypes.STRING,
//   },
//   text: {
//     type: DataTypes.STRING,
//   },
//   topic: {
//     type: DataTypes.STRING,
//   },
//   fromName: {
//     type: DataTypes.STRING,
//   },
//   toId: {
//     type: DataTypes.STRING,
//   },

// }, {
//   sequelize,
//   tableName: 'message', // 我们需要选择模型名称
// });

// // 定义的模型是类本身
// console.log(Message === sequelize.models.Message); // true
