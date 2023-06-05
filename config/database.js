import {Sequelize} from 'sequelize';

const db = new Sequelize('trashure', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
