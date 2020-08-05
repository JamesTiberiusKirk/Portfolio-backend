const mongoose = require('mongoose');

class Db {

    dbConf;
    uri;
    dbOpts;

    constructor(dbConf) {
        this.dbConf = dbConf;
        this.uri = `mongodb://${this.dbConf.creds}@${this.dbConf.host}:${this.dbConf.port}/${this.dbConf.dbName}`;
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