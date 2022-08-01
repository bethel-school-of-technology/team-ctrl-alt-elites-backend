const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model')
const secretKey = 'longlivefomo';

module.exports = {
    // alternative to web token:
createJWT: (user) => {
    const token = jwt.sign({
      username: user.username,
      id: user.id
    },
    secretKey,
    {
      expiresIn: '24h'
    });
    return token;
  },
  verifyUser: (token) => {
    try {
      const decodedPayload = jwt.verify(token, secretKey);
      return User.findById(decodedPayload.id);
      
    } catch (err) {
      return null;
    }
  }
}