const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../../config/config').jwt;
const hash = require('../../lib/hash');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

UserSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        hash(password).then(hash=>{
            user.password = hash;
            next();
        });
    } else {
        next();
    }
});

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        jwt.sign({ _id: user._id.toHexString() },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn },
            (err, token) => {
                if (!err) {
                    resolve(token);
                } else {
                    reject();
                }
            });
    });
}

UserSchema.methods.generateRefreshAuthToken = function () {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buff) => {
            if (err) return reject(err);
            let token = buff.toString('hex');
            return resolve(token);

        });
    });
}


UserSchema.methods.createSession = function () {
    let user = this;
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e) => {
        return Promise.reject(`[AUTH] failed to save session to db\n ${e}`)
    });

}

UserSchema.statics.findByIdAndToken = function (_id, token) {
    let user = this;
    return user.findOne({ _id, 'session.token': token });
}

UserSchema.statics.findByCredentials = function (username, password) {
    let User = this;
    return User.findOne({ username }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        })
    });
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoc = Date.now() / 1000;
    if (expiresAt > secondsSinceEpoc) {
        return false;
    } else {
        return true;
    }
}

UserSchema.statics.getJWTSecret = () => {
    return jwtConfig.secret;
}

let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();
        user.sessions.push({ 'token': refreshToken, expiresAt });
        user.save().then(() => {
            resolve(refreshToken);
        }).catch((err) => {
            reject(err)
        });
    });
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = jwtConfig.refreshTokenExpiry;
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('Users', UserSchema);
module.exports = { User };