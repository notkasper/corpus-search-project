const jwt = require('jsonwebtoken');
const config = require('../../../config.json');

/**
 * Provides an intermediary between client and server to check if the client is authorized to make a request to the server.
 * Checks if the token in the request header is present for authentication. 
 * If it is present, then it checks if the token is valid for authentication.
 * When the token is valid, access is granted and otherwise access is denied. 
 * On authentication, the `next()` is called and the actual API request is handled.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 * @param {Function} next Middleware function to pass control
 */
module.exports = (req, res, next) => {
  const secret = config.SECRET;
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).send({ message: "Unauthorized access" });
    return;
  }
  else {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        res.status(401).send({ message: "Token invalid" });
        return;
      } 
      next();
    });
  }
}