import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';
import Config from '../Config/config.json';
import bcrypt from 'bcrypt';
import { encrypt } from './encrypt';

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

Conn.sync({
  force: true
}).then(() => {
  Users.create({
    username: 'gabriel',
    password: bcrypt.hashSync('gabriel', 10)
  });
  _.times(10, () => {
    return Notes.create({
      url: encrypt(Faker.lorem.word()),
      title: encrypt(Faker.lorem.sentence()),
      text: encrypt(Faker.lorem.text()),
      private: Faker.random.boolean()
    });
  });
});

export default Conn;
