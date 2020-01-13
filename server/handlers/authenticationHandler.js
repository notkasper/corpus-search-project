const jwt = require('jsonwebtoken');
const config = require('../../config.json');

/**
 * Checks if the token in the request header is present for authentication. 
 * If it is present, then it checks if the token is valid for authentication.
 * When the token is valid, access is granted and otherwise access is denied. 
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 * @param {Function} next Middleware function to pass control
 */
module.exports = (req, res, next) => {
  console.log('API USER AUTH');
  const secret = config.SECRET;
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).send({ message: "Unauthorized access" });
    return;
  }
  else {
    try {
      jwt.verify(token, secret);
      res.status(200).send({ message: "Authentication successfull" });
    }
    catch (error) {
      res.status(401).send({ message: "Token invalid" });
      return;
    }
  }
}