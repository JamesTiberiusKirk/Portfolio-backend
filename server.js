const express  = require('express');

const IndexRoutes = require('./routes/index.routes');
const appConfig = require('./config/config').app;
const morgan =  require('morgan');

const app = express();

class Server {
    constructor(db) {
        this.setDb(db);
        this.initRoutes();
        this.start();
    }

    setDb(db) {
        this.db = db;
    }

    start() {
        app.listen(appConfig.port, () => console.log(`Portfolio-backend listening on port ${appConfig.port}!`));
    }

    initRoutes() {
        let indexRoutes = new IndexRoutes(this.db);
        app.use(morgan('combined'));
        app.use('/',indexRoutes.router);
    }
}

module.exports = Server;