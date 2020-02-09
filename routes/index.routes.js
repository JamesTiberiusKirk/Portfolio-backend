const express = require('express');
const bodyParser = require('body-parser');

const UserRoute = require('./users.routes');
const CvRoute = require('./cv.routes');
const AdminRoutes = require('./admin.routes');

const { login, authenticate } = require('../lib/auth');

class IndexRoutes {
    constructor(db) {
        this.setDb(db);
        this.initRouter();
        this.initExpressMiddleware();
        this.initRoutes();
    }

    setDb(db) {
        this.db = db;
    }

    initRouter() {
        this.router = express.Router();
    }

    initExpressMiddleware() {
        this.router.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id');
            res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');

            next();
        });
        this.router.use(bodyParser.json());
    }

    initRoutes() {
        let userRoute = new UserRoute(this.db);
        let cvRoute = new CvRoute(this.db);
        let adminRoute = new AdminRoutes(this.db);

        this.router.use('/cv', cvRoute.router);
        this.router.use('/users', userRoute.router);
        
        // The protected routes
        this.router.use('/admin', authenticate, adminRoute.router);
    }
}

module.exports = IndexRoutes;