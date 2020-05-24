const Db = require('./db/db');
const Server = require('./server');

let server;
let db = new Db();
db.init().then(()=>{
    server = new Server(db);
}).catch(e => {
    console.error(e);
    process.exit(1);
});


