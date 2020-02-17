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
                    // console.log('[GET] /cv');
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
                // console.log(`[GET] /${req.params.cvId}`);
                res.send(cv);
            })
                .catch((e) => {
                    console.log(`[GET] /cv error: ${e.message}`);
                    res.send(e);
                })
        });

        

    }
}

module.exports = CvRoute;