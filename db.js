//import MongoClient from 'mongodb';
const MongoClient = require('mongodb').MongoClient;

class Db {

    constructor(creds, address) {
        this.uri = `mongodb://${creds}@${address}:27017`;
        this.dbName = 'portfolio';
        this.db;
        this.dbOpts = { 
            useUnifiedTopology: true,
            useNewUrlParser: true 
        }
        
        this.init();
    }

    init() {
        MongoClient.connect(this.uri, this.dbOpts, (err, client) => {
            if (err) {
                console.log(err);
            } else {
                console.log('connected');
                this.db = client.db(this.dbName);
            }
        });

    }

    getPrimaryKey(id){
        return ObjectID(id)
    }

    getDb(){
        return this.db;
    }
}

module.exports = Db;