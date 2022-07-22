# Skeleton service for serviceX (Node.js)

Inside the `skeleton-model-app` repository, we have two folders:

- `market`
  - Implementation for Markets
- `service-provider`
  - Implementation for Service Providers

## Background

We create boilerplate implementation to minimize the partner's development workload. This repository is written in Node.js.

Here is [the integration guide reference](https://developers.credify.one/guide/integration-guide.html#frontend-integration). We need several API endpoints to complete the serviceX integration. That being said, by using this skeleton service, you can get it done right away!

## How to use

1. Set up your organization account on [our dashboard webapp](https://servicex.credify.one/register) and follow this [onboarding guideline](https://developers.credify.one/guide/getting-started.html#getting-started).
2. Clone this repository to your machine.

```shell
$ git clone https://github.com/credify-pte-ltd/serviceX-skeleton-nodejs.git
$ cd serviceX-skeleton-nodejs

# If you are Market
$ cd skeleton-model-app/market

# If you are Service Provider
$ cd skeleton-model-app/service-provider
```

3. Set up your `.env` providing the properties you get on the dashboard (in step 1).

```shell
$ cp .env.sample .env
# and edit the .env
```

```shell
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/skeleton_nodejs
MODE=sandbox
PORT=8000
APP_ID=2a7d6dc3-ff0d-44e3-8344-b99c5f4de4b5
APP_SIGNING_KEY=MC4CAQAwBQYDK2VwBCIEICIBsa1RQ/M7D2YWODZBFXsKFAWmGtgyHidAPCJEQnL2
APP_API_KEY=4nN5UifKTRxR1At4syeBHM6e4p0cFOdoqsuUKOIgSYBEJRa8UpGprqorfyWFgdVk
APP_REDIRECT_URL=https://your-website/callback
APP_SCOPES=openid,phone,profile,email
```

- `DATABASE_URL` (Optional)
  - This is described below.
- `MODE` (Mandatory)
  - Either `sandbox` or `production`, depending on deployment environment.
- `PORT` (Optional)
  - Port to expose the server.
  - Default is `8000`
- `APP_ID` (Mandatory)
  - Organization ID. Please find it at Dashboard - `Settings > General Information > Organization ID`.
- `APP_SIGNING_KEY` (Mandatory)
  - Signing key used to generate signatures. Please find it at Dashboard - `Settings > Developer Page > Common > Show Signing Private Key`.
  - This is a main body of private key that excludes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`.
- `APP_API_KEY` (Mandatory)
  - API key that specify scopes of Credify's API calls. Please generate it at Dashboard - `Settings > API Keys > Generate New API Key`. This service needs all the scopes you can enable.
- `APP_REDIRECT_URL`
  - Redirect URL registered with Credify when applying for Service Provider role.
  - Required only for Service Provider
- `APP_SCOPES`
  - Comma-delimitered list of requested scopes when applying for Service Provider role.
  - Required only for Service Provider
- `APP_PROVIDING_BASIC_PROFILE`
  - Basic profile that Market can provide.
  - Required only for Market

4. Create your database and configure database connection. This service uses PostgreSQL as default database, so if you use PostgreSQL, just add your connection `DATABASE_URL=....` in your `.env`. If you want to test how it works, please run PostgreSQL in your machine with a new database (`$ createdb skeleton_nodejs`) and proceed with the next steps.

```shell
# Run PostgreSQL
$ postgres -D /usr/local/var/postgres

# You see database list
$ psql -l

# Create a new database
$ createdb skeleton_nodejs

# Now you should see `skeleton_nodejs`
$ psql -l
```

5. Migrate the database and add seed data if you follow the default implementation with PostgreSQL.

```shell
$ yarn db:setup
$ yarn db:seed:all
```

6. Start the server

```shell
# For development with hot-reload
$ yarn dev

# For just running the server
$ yarn start
```

We have Dockerfile in each folder in case you want to build a docker image.


## How to customize

This repository is ready for you to integrate serviceX out-of-the-box. All you have to do is to complete the implementation of `market/dataInteraction/index.js`, provided you work on the market integration. 

- If you deploy this repository to contain your end-user data
  - You will need to sync this service with your main service regarding the end-user data.
- If you deploy this repository without end-user data
  - You will need to add a user data fetching mechanism.

`db` in the code is a Database object that is instantiated in `app.js`. This can be MongoDB instance, PosgreSQL connection, etc. If you do not use a DB in this server, you would need to call API instead of using `db` in the file. In this case, you will not have to instantiate `db` object (`db` will be `undefined`).

## How to test

This repository has integration test with [Jest](https://jestjs.io/) and [SuperTest](https://github.com/visionmedia/supertest).

You will need to edit `testConfig.js`. If you need a test user (`TEST_CREDIFY_ID`), please let us know.

```shell
$ cd serviceX-skeleton-nodejs

# If you are Market
$ cd skeleton-model-app/market

$ yarn test
```

## How to deploy on Heroku

This project structure is a little tricky as it has 2 projects in it. If you use Heroku, you will need to set up build pack correctly.

[Here](https://elements.heroku.com/buildpacks/timanovsky/subdir-heroku-buildpack) is a reference.

```shell
$ heroku buildpacks:clear
$ heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
$ heroku buildpacks:add heroku/nodejs
$ heroku config:set PROJECT_PATH=skeleton-model-app/market
$ git push heroku main
```

The default setting uses PostgreSQL. You can enable it on Heroku dashboard. If the database does not connect to Heroku remote DB well, please check `database/config/config.js`.

To sync with your `.env`, please do the following

```shell
$ heroku plugins:install heroku-config
$ heroku config:push
```
