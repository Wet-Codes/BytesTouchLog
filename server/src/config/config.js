module.exports = {
    port: process.env.DB_PORT || 2002,
    db: {
      database: process.env.DB_NAME || 'BytesTouchLogs',
      user: process.env.DB_USER || 'BytesAdmin',
      password: process.env.DB_PASS || '1234',
      options: {
        dialect: process.env.DB_DIALECT || 'mysql', // changed to mysql
        host: process.env.DB_HOST || 'localhost',
        // For MySQL, you don't need storage option
      }
    },
    authentication: {
      jwtSecret: process.env.JWT_SECRET || 'secret'
    }
  };