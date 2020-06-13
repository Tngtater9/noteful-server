require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_env === 'test') ?
                        process.env.DATABASE_URL_TEST : 
                        process.env.DATABASE_URL,
}