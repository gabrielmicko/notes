### Notes
## Description
This is a very simple and easy to use note taking application.
Functionalities:
* Making private and public notes accessible on a unique url.
* Logged in user can Add, Modify (title, text, private flag, url), Delete notes.


Other:
* Any change made on the site is only saved when you press the save button.
* Notes are encrypted in the database.

## Libraries
* React, React-Router, React-Hot-Loader
* Redux, React-Redux, Redux-Devtools
* Webpack
* Express
* Babel
* Crypto

## Database
* MySQL(, PostgreSQL)
* Sequelize
* GraphQL

## Sourcemap
* Config: src/Config/
* GraphQL API: src/API
* Public static files: public/


## Config
Copy src/Config/Config.example.json to src/Config/Config.json and set up your configuration.
```js
{
  "username": "notes", // Database user username
  "password": "notes", // Database user password
  "db": "notes", // Database name
  "dialect": "mysql", // Type of the database
  "host": "localhost", // Host of the database
  "tokenSecret": "rzVLBes9r3suZ2CupNnY", // Token secret for authentication
  "passwordSecret": "rzVLsescr3suZPCupNnY", // Password salt
  "cryptSecret": "d6F3Efeq", //Crypting secret
  "graphQLServer": "http://localhost:3100/api", // The GraphQL endpoint what the front-end can access
  "graphQLPort": 3100, // Port of the GraphQL server
  "forceRewriteDB": false, // If you want to truncate and rewrite the entire db on start set this to true
}
```

## Commands
Installing the packages.
```sh
npm install
```
Seed the DB with dumb data. (Default user will be demo/demo)
```sh
npm run seed
```

Starting up the GraphQL endpoint.
```sh
npm start api
```
API can be accessed at the url http://localhost:3100/api by default.

For running the development environment (Webpack and Express) for serving the files.
```sh
npm run dev
```
Dev server can be accessed at the url http://localhost:3000 by default.

Building a production package.
```sh
npm run build
```

Testing the production build (Webpack and Express) for serving the files.
```sh
npm run prod
```

Linting
```sh
npm run lint
```

## Known issues:
* Linting
* Autosave
* Private / Public functionality does not make sense now, because the multi-user functionality is coming only with this version and that part has not been defined how it should work. Probably adding it with 1.2 version.
* Notification for users when anything changes. It uses the LOG box now.

## Version
1.1
