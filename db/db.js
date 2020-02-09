const mongoose = require('mongoose');
const dbConf = require('../config/config').db;

class Db {

    constructor() {
        this.uri = `mongodb://${dbConf.creds}@${dbConf.host}:${dbConf.port}/${dbConf.dbName}`;
        this.dbOpts = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            this.supressWarnings();
            mongoose.connect(this.uri, this.dbOpts)
                .then(() => {
                    console.log('DB connected');
                    resolve();
                })
                .catch((e) => {
                    console.log('Could not connect');
                    reject(e);
                });
            });
    }

    supressWarnings() {
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
    }
}

module.exports = Db;