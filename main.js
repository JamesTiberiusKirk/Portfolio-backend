const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 

const appConfig = require('./config/config').app;
const Db = require('./db/db');

const app = express();

const { Cv, User } = require('./db/models/index.models');

class Server {
    constructor() {
        this.initDb();
        this.initExpressMiddleware();
        this.initRoutes();
        this.start();
    }

    initDb() {
        this.db = new Db();
    }

    initExpressMiddleware() {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id');
            res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');

            next();
        });
        app.use(bodyParser.json());
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
            if (err){
                console.log(err);
                return res.status(401).send(err);
            }

            req.user_id = decoded._id;
            next();

        });
    }

    start() {
        app.listen(appConfig.port, () => console.log(`Portfolio-backend listening on port ${appConfig.port}!`));
    }

    initRoutes() {
        app.get('/cv', (req, res, next) => {
            Cv.find({})
                .then((cv) => {
                    console.log('[GET] /cv');
                    res.send(cv);
                })
                .catch((e) => {
                    console.log(`[GET] /cv error: ${e.message}`);
                    res.send(e);
                })
        });

        app.get('/cv/:cvId', (req, res, next) => {
            Cv.find({
                _id: req.params.cvId
            }).then((cv) => {
                console.log(`[GET] /cv/${req.params.cvId}`);
                res.send(cv);
            })
                .catch((e) => {
                    console.log(`[GET] /cv error: ${e.message}`);
                    res.send(e);
                })
        });

        app.post('/cv', (req, res) => {
            let reqCv = req.body.cv;
            let newCv = new Cv(reqCv);

            newCv.save().then((cvDoc) => {
                console.log(`[POST] SUCCESS /cv`);
                res.sendStatus(200);
            }).catch((e) => {
                console.log(`[POST] /cv error: ${e.message}`);
                res.send(e);
            });
        });

        app.patch('/cv/update', (req, res) => {
            Cv.findOneAndUpdate({ _id: req.body._id }, {
                $set: req.body.cv
            }).then(() => {
                res.sendStatus(200);
                console.log('[PATCH] SUCCESS /cv/update');
            }).catch((e) => {
                res.send(e.message);
                console.log(`[PATCH] /cv/update error: ${e.message}`);
            });
        });

        app.delete('/cv/delete', (req, res) => {
            Cv.findOneAndDelete({
                _id: req.body._id
            }).then(() => {
                res.sendStatus(200);
                console.log('[DELETE] SUCCESS /cv/delete');
            }).catch((e) => {
                res.send(e.message);
                console.log(`[DELETE] /cv/delete error: ${e.message}`);
            })
        });

        app.post('/users/add', this.authenticate, (req, res) => {
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

        app.post('/users/login', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            User.findByCredentials(username, password).then((user) => {
                return user.createSession().then((refreshtoken) => {
                    return user.generateAccessAuthToken().then((accessToken) => {
                        return { accessToken, refreshtoken }
                    });
                }).then((authToken) => {
                    console.log(authToken)
                    res
                        .header('x-refresh-token', authToken.refreshtoken)
                        .header('x-access-token', authToken.accessToken)
                        .send(user);
                    console.log(`[POST] SUCCESS /users/login user:${user.username} logged in`);

                });

            }).catch((e) => {
                res.status(400).send(e);
            });
        });

        app.get('/users/me/access-token', this.verifySession, (req, res) => {
            req.userObject.generateAccessAuthToken().then((accessToken) => {
                res.header('x-access-token', accessToken).send({ accessToken });
            }).catch((e) => {
                res.status(400).send(e);
            });
        });
    }
}

new Server();