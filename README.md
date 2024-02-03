# swapi-api-integration
Integration to swapi.dev to fetch star wars movies and movie characters with functionality to add and retrieve comments for movies

This repo is functionality complete — PRs and issues welcome!

# Demo Url
https://swapi-api-integration.herokuapp.com


# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install MySQL Server ([instructions](https://www.mysql.com/downloads/))
- Include your sql connection string, db host, db username and db password in the .secreta/secreta.json file
- `npm run start:prod` to start the local server on production mode

# API Documentation
Click the link for API documentation with available routes and request response examples: https://documenter.getpostman.com/view/6889344/UVC5F8Bh#4cf84068-a6ae-4d5b-b1f0-8f972727c32d

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [base-64](github.com/mathiasbynens/base64) - For encoding and decoding url strings
- [body-parser](github.com/expressjs/body-parser) - Node js body parsing middleware
- [cors](github.com/expressjs/cors) - Used to enable cors with various options
- [joi](github.com/sideway/joi) - Object schema validation
- [sequelize](github.com/sequelize/sequelize) - Nodejs ORM for sql databases
- [mysql2](github.com/sidorares/node-mysql2) - MySQL client for Node.js with focus on performance. Supports prepared statements, non-utf8 encodings, binary log protocol, compression, ssl 
- [node-fetch](github.com/node-fetch/node-fetch) - For making third party api calls
- [secreta](https://www.npmjs.com/package/secreta) - For managing secret keys and config
- [winston](github.com/winstonjs/winston) - For logging anything

## Application Structure

- `.secreta/` Folder containing secreta.json and config.js files for managing secrets and config files. This folder is used in place of .env files to manage secrets
- `.vscode/` For managing vs code workspace
- `logs/` This is where all log files are stored
- `scripts/` Contains predeploy scripts
- `src/@core/common/` where all universal files with generic functions that can be called from other files when extended
- `src/@core/database/` This folder contains the connections to databases
- `src/@core/interfaces/` This folder contains all interface files used as types
- `src/api/`This folder contains all api modules which contains the route file, controller file, service file, model and validator file for each module. This API contains only one api module which is the `movie` module.
- `src/util/` contains logger and middleware files along with any other utility files
- `src/app.ts` The entry point to our application. This file defines our express server and connects it to the SQL database using sequelize. It also requires the routes we'll be using in the application.
- `src/server.ts` Contains the server setup
- `Procfile` Heroku file for deployment to heroku
- `.gitignore`
- `Dockerfile`
- `package.json`
- `package-lock.json`
- `tsconfig.json`

## Error Handling

In `src/@core/common/universal.service.ts`, we define failureResponse and serviceErrorHandler functions for returning the errors with their respective status codes and error messages. Service files for the different modules under `src/api/` folder extends the universal.service.ts file to return the necccessary errors in this file.
In `src/@core/common/universal.controller.ts`, we define controllerErrorHandler function to handle errors from the controller classes which extends this universal.controller.ts file

## Authentication
No authorization is required for this API


<br />
