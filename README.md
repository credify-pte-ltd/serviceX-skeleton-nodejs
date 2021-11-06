# The skeleton app for ServiceX implementation:

Inside the skeleton-model-app repo we have two folders:

- _market_
  - Implementation for Markets
- _service-provider_
  - Implementation for Service Providers

## App structure:

This skeleton app is built with Nodejs to demonstrate the use of the serviceX SDK to build required APIs for the integration.

You can find our SDK in some supported languages [here](https://github.com/credify-pte-ltd). Each repository has its own database, seed data for testing, and full implementation of all required APIs.

You can reference how to use the SDK [here](https://developers.credify.one/) in case you want to implement it by yourself or just need a reference.

## How to run it?

1. Create your `.env` with `.env.sample` ( `cp .env.sample .env` )
2. Create your database add its connection URL in your `.env`
3. Migrate the database ( `yarn db:setup` )
4. Start the server ( `yarn dev` or `yarn start` )

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

Example config:

```
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/demo_organizations
MODE=sandbox
PORT=8000
APP_ID=2a7d6dc3-ff0d-44e3-8344-b99c5f4de4b5
APP_SIGNING_KEY=MC4CAQAwBQYDK2VwBCIEICIBsa1RQ/M7D2YWODZBFXsKFAWmGtgyHidAPCJEQnL2
APP_API_KEY=4nN5UifKTRxR1At4syeBHM6e4p0cFOdoqsuUKOIgSYBEJRa8UpGprqorfyWFgdVk
APP_REDIRECT_URL=http://your-website/callback
APP_SCOPES=openid,phone,profile,email
```

- MODE: can be `sandbox` or `production` depends on deployment environment.
- PORT: this server's port, default is `8000`.
- APP_ID: your organization ID in serviceX Dashboard: **Settings > General Information > Organization ID**.
- APP_SIGNING_KEY: signing key used to generate digital signature, obtain in serviceX Dashboard: **Settings > Developer Page > Common > Show Signing Private Key**.
- APP_API_KEY: an API key value which includes API scopes for Credify's API calls, could be created in serviceX Dashboard: **Settings > API Keys > Generate New API Key**. For backend implementation you could allow full API access so with service provider role the API scopes could be `organization`, `oidc_client` and for market role the API scopes could be `organiation`, `idpass_provider` and `claim_provider`.
- APP_REDIRECT_URL: redirect URL registered with Credify when applying for service provider role, required for service provider implementation only.
- APP_SCOPES: comma-separated list of requested scopes when applying for service provider role, required for service provider only.
