const express = require('express');
const { User } = require('../db/models/user.model');

class AdminRoutes {
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
        this.router.post('/users/add', (req, res) => {
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
        
        // Protedted CV routes

        this.router.post('/cv', (req, res) => {
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

        this.router.patch('/cv/update', (req, res) => {
            Cv.findOneAndUpdate({ _id: req.body._id }, {
                $set: req.body.cv
            }).then(() => {
                res.sendStatus(200);
                console.log('[PATCH] SUCCESS /update');
            }).catch((e) => {
                res.send(e.message);
                console.log(`[PATCH] /update error: ${e.message}`);
            });
        });

        this.router.delete('/cv/delete', (req, res) => {
            Cv.findOneAndDelete({
                _id: req.body._id
            }).then(() => {
                res.sendStatus(200);
                console.log('[DELETE] SUCCESS /delete');
            }).catch((e) => {
                res.send(e.message);
                console.log(`[DELETE] /delete error: ${e.message}`);
            })
        });

    }
}

module.exports = AdminRoutes;