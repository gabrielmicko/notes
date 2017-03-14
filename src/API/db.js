import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';
import Config from '../Config/config.json';

const Conn = new Sequelize(
  Config.db,
  Config.username,
  Config.password,
  {
    dialect: Config.dialect,
    host: Config.host
  }
);

const Notes = Conn.define('notes', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      max: 255,
    },
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      max: 255,
    },
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: 1,
  },
});

const Users = Conn.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Conn.sync({
  force: true,
}).then(() => {
  _.times(10,
    () => {
      return Notes.create({
        url: Faker.internet.url(),
        title: Faker.lorem.sentence(),
        text: Faker.lorem.text(),
        private: Faker.random.boolean()
      }).then(() => {
        Users.create({
          username: Faker.internet.userName(),
          password: Faker.internet.password()
        });
      })
    })
});

export default Conn;
