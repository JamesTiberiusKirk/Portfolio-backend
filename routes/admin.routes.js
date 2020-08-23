const express = require('express');
const hash = require('../lib/hash');
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
        this.router.patch('/users/change_pass', (req, res) => {
            let id = req.user_id;
            let newPassword = req.body.new_password;

            if (!newPassword) {
                return res.status(400).send('Please supply a new password');
            }

            if (!id) {
                return res.status(400).send('Please supply the user id');
            }

            hash(newPassword).then((hash) => {
                User.findByIdAndUpdate({ _id: id }, { password: hash }).then(() => {
                    res.send('Updated');
                });
            });
        });

        this.router.post('/users/add', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            if (!username) {
                return res.status(400).send('Please supply a username');
            }
            if (!password) {
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
            }).catch((e) => {
                res.status(400).send(e.message);
            });
        });

        // Protected CV routes
        this.router.get('/cv/all', (req, res) => {
            Cv.find({}).then((cvs) => {
                res.status(200).send(cvs);
            }).catch((e) => {
                res.send(e);
            });
        });

        this.router.post('/cv', (req, res) => {
            let reqCv = req.body.cv;
            let newCv = new Cv(reqCv);

            newCv.save().then((cvDoc) => {
                res.sendStatus(200);
            }).catch((e) => {
                res.send(e);
            });
        });

        this.router.patch('/cv/update', (req, res) => {
            Cv.findOneAndUpdate({ _id: req.body.cv._id }, {
                $set: { markdown: req.body.cv.markdown }
            }, { new: true }, (err, doc) => {
                if (err) {
                    res.send(e.message);
                    return;
                }
                res.send(doc);
            })
        });

        this.router.delete('/cv/delete', (req, res) => {
            Cv.findOneAndDelete({
                _id: req.body._id
            }).then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.send(e.message);
            })
        });

    }
}

module.exports = AdminRoutes;
