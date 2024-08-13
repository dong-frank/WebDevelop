// db.js
const { DataSource } = require('typeorm');
const { User } = require('./entity/user'); 
const { Article } = require('./entity/article');
const { Comment } = require('./entity/comment');
const { InterestCircle } = require('./entity/interest-circle');
const { UserCircleExperience} = require('./entity/user-circle-experience');
const { default: test } = require('node:test');
// 创建数据源
const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'rds364408',
  database: 'webdatabase_release2',
  synchronize: true,
  logging: false,
  entities: [User , Article , Comment , InterestCircle , UserCircleExperience],
  migrations: ["src/migration/**/*.js"],
  subscribers: ["src/subscriber/**/*.js"],
});

AppDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');
}).catch((error) => {
  console.error('Error during Data Source initialization:', error);
});


module.exports = {AppDataSource};