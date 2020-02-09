const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models/user.model');

class UserRoute {
    constructor(db) {
        this.setDb = db;
        this.initRouter();
        this.initRoutes();
    }

    setDb(db) {
        this.db = db;
    }

    initRouter(){
        this.router = express.Router();
    }

    initRoutes() {
        this.router.post('/add', this.authenticate, (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            let newUser = new User({
                username,
                password
            });

            newUser.save().then(() => {
                return newUser.createSession();
            }).then((refreshtoken) => {
                return newUser.generateAccessAuthToken().then((accessToken) => {
                    return { accessToken, refreshtoken }
                });
            }).then((authToken) => {
                res
                    .header('x-refresh-token', authToken.refreshToken)
                    .header('x-access-token', authToken.accessToken)
                    .send(newUser);
                console.log('[POST] SUCCESS /users');
            }).catch((e) => {
                res.status(400).send(e.message);
                console.log(`[POST] /users error: ${e}`);
            });
        });

        this.router.post('/login', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            User.findByCredentials(username, password).then((user) => {
                return user.createSession().then((refreshtoken) => {
                    return user.generateAccessAuthToken().then((accessToken) => {
                        return { accessToken, refreshtoken }
                    });
                }).then((authToken) => {
                    // console.log(authToken)
                    res
                        .header('x-refresh-token', authToken.refreshtoken)
                        .header('x-access-token', authToken.accessToken)
                        .send(user);
                    console.log(`[POST] SUCCESS /users/login user:${use r.username} logged in`);

                });

            }).catch((e) => {
                res.status(400).send(e);
            });
        });

        this.router.get('/me/access-token', this.verifySession, (req, res) => {
            req.userObject.generateAccessAuthToken().then((accessToken) => {
                res.header('x-access-token', accessToken).send({ accessToken });
            }).catch((e) => {
                res.status(400).send(e);
            });
        });
    }

    verifySession(req, res, next) {

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

    authenticate(req, res, next) {
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


}

module.exports = UserRoute;