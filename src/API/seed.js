import Db from './db';
import Config from '../Config/config.json';
import bcrypt from 'bcrypt';
import _times from 'lodash/times';
import { encrypt } from './encrypt';
import Faker from 'faker';

Db.sync({
  force: Config.forceRewriteDB
}).then(() => {
  const DbInserts = [];
  DbInserts.push(
    Db.models.users.create({
      username: 'demo',
      password: bcrypt.hashSync('demo', 10)
    })
  );
  _times(10, () => {
    DbInserts.push(
      Db.models.notes.create({
        url: encrypt(Faker.lorem.word()),
        title: encrypt(Faker.lorem.sentence()),
        text: encrypt(Faker.lorem.text()),
        private: Faker.random.boolean(),
        userId: '1'
      })
    );
  });

  Promise.all(DbInserts).then(() => {
    process.exit();
  });
});
