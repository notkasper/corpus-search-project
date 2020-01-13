const bCrypt = require('bcryptjs');

/**
 * Verifies two passwords using bCrypt hash function.
 * 
 * @param {String} password1 The plaintext password
 * @param {String} password2 The hash of the password in the database
 * @returns {Boolean} `true` or `false` depending on if the password comparison passes or fails
 */
const verifyPassword = (password1, password2) => {
  return bCrypt.compareSync(password1, password2);
}

/**
 * Computes the bCrypt hash of the plaintext password.
 * 
 * @param {String} password The plaintext password
 * @returns {String} Hash of the password
 */
const hashPassword = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8));
}

module.exports = {
  verifyPassword,
  hashPassword
}