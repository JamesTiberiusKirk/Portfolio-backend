const express = require('express');
const { User } = require('../db/models/user.model');
const { authenticate, verifySession, login } = require('../lib/auth');

class UserRoute {
    constructor(db) {
        this.setDb = db;
        this.initRouter();
        this.initRoutes();
    }

    setDb(db) {
        this.db = db;
    }

    initRouter() {
        this.router = express.Router();
    }

    initRoutes() {

        this.router.get('/me/access-token', verifySession, (req, res) => {
            req.userObject.generateAccessAuthToken().then((accessToken) => {
                res.header('x-access-token', accessToken).send({ accessToken });
            }).catch((e) => {
                res.status(400).send(e);
            });
        });

        this.router.post('/login', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            login(username, password)
                .then((response) => {
                    console.log(`[POST] SUCCESS /login user:${response.user.username} logged in`);
                    res.header('x-refresh-token', response.authToken.refreshtoken)
                        .header('x-access-token', response.authToken.accessToken)
                        .status(200).send(response.user);
                }).catch((err) => {
                    console.log(err)
                    res.status(401).send(err);
                });

        });
    }

}

module.exports = UserRoute;