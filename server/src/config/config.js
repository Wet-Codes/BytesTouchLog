module.exports = {
    port: process.env.DB_PORT || 2002,
    db:{ //db attributes
        database: process.env.DB_NAME || 'BytesTouchLogs',
        user: process.env.DB_USER || 'BytesAdmin', 
        password: process.env.DB_PASS || '1234',

        options:{ 
        dialect: process.env.DB_DIALECT || 'sqlite',
        host: process.env.DB_HOST || 'localhost',
        storage: './bytestouchlog.sqlite'
        }
    } ,
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    }


} 