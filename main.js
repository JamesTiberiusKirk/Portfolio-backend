const Db = require('./db');
const express = require('express');
const cors = require('cors')

const app = express();
const port = 3000;

class Server {
    constructor() {
        this.initDb();
        this.initExpressMiddleware();
        this.initRoutes();
        this.start();
    }

    initDb(){
        this.db = new Db('root:example', 'localhost');
    }

    initExpressMiddleware(){
        app.use(cors());
    }

    initRoutes(){
        app.get('/cv', (req, res, next) => {
            this.db.getDb().collection('cv').find({}).toArray((err, documents) => {
        
                if (err) {
                    console.log(err);
                    return;
                }
        
                res.json(documents);
            });
        });

        app.get('/hello', (req, res, next) => {
            response = { id: 1, msg: 'Hello World!' }
            res.json(response);
        });
        
    }

    start(){
        app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }
}

new Server();