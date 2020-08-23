const bcrypt = require('bcryptjs');
const constFactor = require('../config/config').jwt.constFactor;

module.exports = function hash (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(constFactor, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });

    });
}