const Db = require('./db/db');
const Server = require('./server');
const dbConf = require('./config/config').db

let server;
let db = new Db(dbConf);
db.init().then(()=>{
    server = new Server(db);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
