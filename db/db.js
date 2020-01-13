const mongoose = require('mongoose');

class Db {

    constructor(creds, address,dbName) {
        //this.dbName = 'portfolio';
        this.uri = `mongodb://${creds}@${address}:27017/${dbName}`;
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