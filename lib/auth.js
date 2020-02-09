
const jwt = require('jsonwebtoken');

const { User } = require('../db/models/user.model');

function verifySession(req, res, next) {

    let refreshToken = req.header('x-refresh-token');
    let _id = req.header('_id');


    User.findByIdAndToken(_id).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found. And make sure that the refresh token and user id are correct.'
            })
        }

        req.user_id = user._id;
        req.userObject = user
        req.refreshToken = user.refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            return Promise.reject({
                'error': 'Access denied. Refresh token expired or invilaid.'
            })
        }

    }).catch((e) => {
        console.log(e)
        res.status(401).send(e);
    });

}

function authenticate(req, res, next) {
    let token = req.header('x-access-token');

    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send(err);
        }

        req.user_id = decoded._id;
        next();

    });
}

function login(username, password) {
    return new Promise((resolve,reject)  => {
        User.findByCredentials(username, password).then((user) => {
            return user.createSession().then((refreshtoken) => {
                return user.generateAccessAuthToken().then((accessToken) => {
                    return { accessToken, refreshtoken }
                });
            }).then((authToken) => {
                resolve({user, authToken})
            });

        }).catch((e) => {
            reject(e);
        });
    });
}

module.exports = { verifySession, authenticate, login }

