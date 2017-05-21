import Sequelize from 'sequelize';
import Config from '../Config/config.json';

const Conn = new Sequelize(Config.db, Config.username, Config.password, {
  dialect: Config.dialect,
  host: Config.host
});

const Notes = Conn.define('notes', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  userId: {
    type: Sequelize.INTEGER
  },
  url: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  title: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  text: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: 1
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  }
});

const Users = Conn.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Users.hasMany(Notes);

export default Conn;
