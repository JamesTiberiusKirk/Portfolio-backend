const mongoose = require('mongoose');
const dbConf = require('../config/config').db;

class Db {

    constructor() {
        this.uri = `mongodb://${dbConf.creds}@${dbConf.host}:${dbConf.port}/${dbConf.dbName}`;
        this.dbOpts = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }

        this.init();
        this.supressWarnings()
    }

    init() {
        mongoose.connect(this.uri, this.dbOpts)
            .then(() => {
                console.log('DB connected');
            })
            .catch((e) => {
                console.log('Could not connect');
                console.log(e);
            });
    }

    supressWarnings(){
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
    }
}

module.exports = Db;