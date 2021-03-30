const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { AuthenticationError } = require('apollo-server');

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split('Bearer ')[1];

        if(token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (error) {
                throw new AuthenticationError("Inalid / Expired token");
            }
        }
        throw new AuthenticationError("Authentication header must be included");
    }
    throw new AuthenticationError("Authorization header must be included");
}



// notes
// context = { ...headers }