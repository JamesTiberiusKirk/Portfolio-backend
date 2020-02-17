const express = require('express');
const { Cv, User } = require('../db/models/index.models');

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

            console.log(req.body);
            if(!username){
                return res.status(400).send('Please supply a username');
            }
            if(!password){
                return res.status(400).send('Please supply a password');
            }


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
                // console.log('[POST] SUCCESS /admin/users/add');
            }).catch((e) => {
                res.status(400).send(e.message);
                // console.log(`[POST] /admin/users/add error: ${e}`);
            });
        });
        
        // Protedted CV routes
        this.router.get('/cv/all', (req, res) => {
            Cv.find({}).then((cvs) => {
                console.log(`[GET] SUCCESS /cv/all`);
                res.status(200).send(cvs);
            }).catch((e) => {
                console.log(`[GET] /cv/all error: ${e.message}`);
                res.send(e);
            });
        });

        this.router.post('/cv', (req, res) => {
            let reqCv = req.body.cv;
            let newCv = new Cv(reqCv);

            newCv.save().then((cvDoc) => {
                // console.log(`[POST] SUCCESS /cv`);
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
                // console.log('[PATCH] SUCCESS /update');
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
                // console.log('[DELETE] SUCCESS /delete');
            }).catch((e) => {
                res.send(e.message);
                console.log(`[DELETE] /delete error: ${e.message}`);
            })
        });

    }
}

module.exports = AdminRoutes;