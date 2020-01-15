const Db = require('./db/db');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const { Cv } = require('./db/models/index.models');

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
        app.use(cors());
        app.use(bodyParser.json());
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
    }

    start() {
        app.listen(port, () => console.log(`Portfolio-backend listening on port ${port}!`));
    }
}

new Server();