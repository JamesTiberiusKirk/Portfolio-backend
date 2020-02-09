const express = require('express');
const { Cv } = require('../db/models/cv.model');

class CvRoute {

    constructor(db) {
        this.setDb(db);
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
        this.router.get('/', (req, res, next) => {
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

        this.router.get('/:cvId', (req, res, next) => {
            Cv.find({
                _id: req.params.cvId
            }).then((cv) => {
                console.log(`[GET] /${req.params.cvId}`);
                res.send(cv);
            })
                .catch((e) => {
                    console.log(`[GET] /cv error: ${e.message}`);
                    res.send(e);
                })
        });

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

        this.router.patch('/update', (req, res) => {
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

        this.router.delete('/delete', (req, res) => {
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

module.exports = CvRoute;