module.exports = {
    port: process.env.DB_PORT || 2002,
    db: {
      database: process.env.DB_NAME || 'user_db',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      options: {
        dialect: process.env.DB_DIALECT || 'mysql', // changed to mysql
        host: process.env.DB_HOST || 'localhost',
        // For MySQL, you don't need storage option
      }
    },
    authentication: {
      jwtSecret: process.env.JWT_SECRET || 'secret',
      expiresIn: '8h'
    }
  };