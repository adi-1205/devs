const jwt = require('jsonwebtoken');
const { JWT_EXPIRES_IN, JWT_SECRET} = require('../config/config');

const ReS = (res, message, data) => {
    return res.status(200).json({
        message: message,
        data: data || {},
    });
}

const ReE = (res, code, message) => {
    return res.status(code).json({
        message: message,
    });
}

const jwtSign = payload => {
    console.log(JWT_EXPIRES_IN, JWT_SECRET);
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

const jwtVerify = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject({
                    success: false,
                    message: 'Invalid token',
                });
            }
            resolve({
                success: true,
                decoded: decoded,
            });
        });
    });
}

module.exports = {
    ReS,
    ReE,
    jwtSign,
    jwtVerify,
};