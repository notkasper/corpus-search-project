const uuid = require('uuid');
const { getUserModel } = require('../db');
const { hashPassword } = require('./passwordHandler');

/**
 * Creates a user by using the username and password provided in the request object. 
 * Note that the hash of the password is stored for the user instead of the plaintext.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 */
module.exports = async (req, res) => {
  console.log("API CREATE USER");
  const { body: { username, password } } = req;

  try {
    const id = uuid.v4();
    const User = getUserModel();
    await User.create({
      id,
      username,
      password: hashPassword(password)
    });
    res.status(200).send({ message: "CREATED" });
  } catch (error) {
    console.log(`ERROR WHILE CREATING USER ${error}`);
    res.status(400).send({ error: `ERROR WHILE CREATING USER ${error}` });
  }
}

