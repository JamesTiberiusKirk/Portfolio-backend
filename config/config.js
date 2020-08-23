require('dotenv').config();

function getDbConfig() {
    return {
        creds: process.env.DB_CREDS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dbName: process.env.DB_NAME
    };
}

function getAppConfig() {
    return {
        port: process.env.API_PORT
    };
}

function getJwtConfig() {
    return {
        expiresIn: process.env.JWT_EXPIRATION,
        secret: process.env.JWT_SECRET,
        refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
        constFactor: process.send.JWT_CONST_FACTOR
    };
}

const config = {
    app: getAppConfig(),
    db: getDbConfig(),
    jwt: getJwtConfig(),
}

module.exports = config;