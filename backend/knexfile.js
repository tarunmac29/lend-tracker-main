// // Update with your config settings.

// /**
//  * @type { Object.<string, import("knex").Knex.Config> }
//  */
// module.exports = {

//   development: {
//     client: 'sqlite3',
//     connection: {
//       filename: './dev.sqlite3'
//     }
//   },

//   staging: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   },

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }

// };



require("dotenv").config();

/**
 * Knex configuration for LendTrack
 */
const config = {
  development: {
    client: "mysql2",

    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3307),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },

    pool: {
      min: 0,
      max: 10,
    },

    migrations: {
      directory: "./src/database/migrations",
      tableName: "knex_migrations",
      extension: "js",
    },

    seeds: {
      directory: "./src/database/seeds",
      extension: "js",
    },
  },

  production: {
    client: "mysql2",

    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },

    pool: {
      min: 2,
      max: 10,
    },

    migrations: {
      directory: "./src/database/migrations",
      tableName: "knex_migrations",
      extension: "js",
    },

    seeds: {
      directory: "./src/database/seeds",
      extension: "js",
    },
  },
};

module.exports = config;
