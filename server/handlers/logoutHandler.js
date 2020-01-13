/**
 * When a logout request is made, clear the token (if available) from the client to log out.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 * @param {Function} next Middleware function to pass control
 */
module.exports = async (req, res, next) => {
  const cookie = req.cookies["token"];

  try {
    if (cookie) {
      res.status(200).clearCookie("token").send({ message: "User successfully logged out" });
    }
  }
  catch (error) {
    res.status(400).send({ message: `Error while logging out ${error}` });
  }
}

