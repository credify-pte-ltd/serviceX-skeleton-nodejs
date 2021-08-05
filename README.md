# The skeleton app for ServiceX implementation:

Inside the skeleton-model-app repo we have two folders:

- market
  - Implementation for Markets
- service-provider
  - Implementation for Service Providers

## App structure:

This skeleton app is built with Nodejs to demonstrate the use of the serviceX SDK to build required APIs for the integration.

You can find our SDK in some supported languages [here](https://github.com/credify-pte-ltd). Each repository has its own database, seed data for testing, and full implementation of all required APIs.

You can reference how to use the SDK [here](https://developers.credify.one/) in case you want to implement it by yourself or just need a reference.

## How to run it?

1. Create your `.env` with `.env.sample` ( `cp .env.sample .env` )
2. Create your database add its connection URL in your `.env`
3. Migrate the database ( `yarn db:setup` )
4. Start the server ( `yarn dev or yarn start` )

We have Dockerfile in each folder in case you want to build a docker image.

## Customizing and interaction:

### Code logic:
This repository is ready for you to integrate serviceX. All you have to do is to complete the implementation that is marked like:

`//*** Your implementation starts from here. The code below is just for reference`

### Database interaction:
- If you deploy this repository to contain your end-user data
  - You will need to sync this service with your main service regarding the end-user data
- If you deploy this repository without end-user data
  - You will need to add a database connection about the end-user data

## Configuration guideline:

```
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/demo_organizations
MODE=development
PORT=
APP_ID=
APP_SIGNING_KEY=
APP_API_KEY=
APP_REDIRECT_URL=
APP_SCOPES=openid,phone,profile,email
```
- MODE: it can be development, sandbox, uat, sit, or production
- PORT: our server's port
- APP_ID: you can get this id when you register your app in serviceX dashboard
- APP_SIGNING_KEY: you can get this signing key when you register your app in serviceX dashboard
- APP_REDIRECT_URL: Once an OIDC session is successfully completed, the redirection URL will be called.
- APP_SCOPES: standard scopes you registered in serviceX dashboard
