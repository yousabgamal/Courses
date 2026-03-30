const jwt = require('jsonwebtoken');

const GJWT = (payload) => {
    return jwt.sign(
        payload, process.env.JWT_SECRET_KEY , {expiresIn: '5m'}
    );
}

module.exports = GJWT;