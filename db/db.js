const mongoose = require('mongoose');

class Db {

    constructor(creds, address) {
        this.dbName = 'portfolio';
        this.uri = `mongodb://${creds}@${address}:27017/${this.dbName}`;
        this.dbOpts = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }

        this.init();
    }

    init() {

        //mongoose.Promise = global.Promise;
        mongoose.connect(this.uri, this.dbOpts)
            .then(() => {
                console.log('DB connected');
            })
            .catch((e) => {
                console.log('Could not connect');
                console.log(e);
            });

        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);

    }

}

module.exports = Db;