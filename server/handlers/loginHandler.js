const { getUserModel } = require('../db');
const { verifyPassword } = require('./passwordHandler');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');

/**
 * Generates a token based on the username and a secret.
 * 
 * @param {String} username The username entered by the client
 * @returns {String} Token for this user session
 */
const generateToken = (username) => {
  const secret = config.SECRET;
  const token = jwt.sign({ username: username }, secret, { expiresIn: "24h" });
  return token;
};

/**
 * When the username and password combination is correct, a token is generated and sent back to the client.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 * @param {Function} next Middleware function to pass control
 */
module.exports = async (req, res, next) => {
  console.log("API USER LOGIN");
  const { username, password } = req.body;

  let correctPassword;
  try {
    correctPassword = await checkPassword(username, password);
  } catch (error) {
    res.status(401).send({ message: `Error while logging in ${error}` });
    return;
  }

  if (correctPassword) {
    const token = generateToken(username);
    res.set("x-access-token", token).cookie("token", token, { httpOnly: false, maxAge: 60 * 60 * 3600 }).sendStatus(200);
    return;
  }
  res.status(401).send({ message: "Login unsuccesfull " });
};

/**
 * Checks if the combination of username and password entered by the client is correct.
 * 
 * @param {String} username The username entered by the client
 * @param {String} password The plaintext password entered by the client
 * @returns {Promise} A promise which, when resolved, returns a boolean value that indicates if the password is valid for that username
 */
const checkPassword = (username, password) => {
  return new Promise(async (resolve, reject) => {
    const userModel = getUserModel();
    try {
      const user = await userModel.findOne({ where: { username } });
      const correctPassword = verifyPassword(password, user.password);
      resolve(correctPassword);
    }
    catch (error) {
      reject(error);
    }
  });
};