const bCrypt = require('bcryptjs');
const uuid = require('uuid');
const db = require('../db');

(() => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.initialize();
      const User = db.getUserModel();
      // clear table
      await User.destroy({ where: {} });
      // fill table
      const hashPassword = password => bCrypt.hashSync(password, bCrypt.genSaltSync(8));
      const id = uuid.v4();
      await User.create({
        id,
        username: 'admin',
        password: hashPassword('1234')
      });
      console.log('User table seeded successfully');
      resolve();
    } catch (error) {
      console.error(`ERROR WHILE SEEDING USER TABLE ${error}`);
      reject(`ERROR WHILE SEEDING USER TABLE ${error}`);
    } finally {
      db.getConnection().close();
    }
  });
})();