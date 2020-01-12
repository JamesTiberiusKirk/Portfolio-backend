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
        this.db = new Db('root:example', 'localhost');
    }

    initExpressMiddleware() {
        app.use(cors());
        app.use(bodyParser.json());
    }

    initRoutes() {
        app.get('/cv', (req, res, next) => {
            Cv.find({})
                .then((cv) => {
                    console.log('[GET] /cv')
                    console.log(cv);
                    res.send(cv);
                })
                .catch((e) => {
                    console.log(e)
                })
        });
    }

    start() {
        app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }
}

new Server();