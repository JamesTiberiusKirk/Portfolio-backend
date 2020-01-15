const secret = require('./dbSecret');

const config = {
    app: {
        port: 3000
    },
    db: {
        creds: secret,
        host: 'localhost',
        port: 27017,
        dbName: 'portfolio'
    }
}

module.exports = config;