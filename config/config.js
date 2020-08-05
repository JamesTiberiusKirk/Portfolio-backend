function getCreds(){
    return process.env.CREDS;
}

const config = {
    app: {
        port: 3000
    },
    db: {
        creds: getCreds(),
        host: 'localhost',
        // host: 'portfolio-db',
        port: 27017,
        dbName: 'portfolio'
    },
    jwt: {
        expiresIn: '15m',
        secret: 'L5Zp3INaAkPTtdLH7RTNwQtoXyfMfoZxNVX6IOgu', //temporary
        refreshTokenExpiery: '10' //days
    }
}

module.exports = config;