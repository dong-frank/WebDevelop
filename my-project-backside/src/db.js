// db.js
const { DataSource } = require('typeorm');
const { User } = require('./entity/user'); 
const { Article } = require('./entity/article');
// 创建数据源
const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'rds364408',
  database: 'webdatabase',
  synchronize: true,
  logging: false,
  entities: [User , Article],
  migrations: ["src/migration/**/*.js"],
  subscribers: ["src/subscriber/**/*.js"],
});

AppDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');

  // 创建新用户实例
  const user = new User();
  user.username = 'Frank';
  user.password = 'rds364408';
  user.avatar = 'default';

  // 保存新用户到数据库
  AppDataSource.manager.save(user);
  console.log('New User has been saved');
  
}).catch((error) => {
  console.error('Error during Data Source initialization:', error);
});

module.exports = {AppDataSource};