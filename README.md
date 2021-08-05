# The skeleton app for ServiceX implementation:

Inside the skeleton-model-app repo we have two folders:

1. Market folder: If you are a market then all the example codes are inside this folder.
2. Service-Provider folder: If you are a service provider then all the example codes are inside this folder.

## App structure:

This skeleton app is built on top of NodeJs to give a demonstration of using the ServiceX SDK to build the required APIs for the integration.
You can find our SDK in some major supported languages [here](https://github.com/credify-pte-ltd). Each repo has its database, seed data for testing, and full implementation of all required APIs.

You can reference how to use the SDK [here](https://developers.credify.one/) in case you want to implement it by yourself or just need a reference.

## How to run it?

1. You need to create your `.env` file follow the `.env.sample`
2. You need to create your test database follow your connection URL inside your `.env` file
3. `yarn db:setup` for a migration.
4. `yarn dev` or `yarn start` for establishing the local server for testing

## Customizing and interaction:

1. Code logic:
   You can use our current implementation if you think it is suitable for your system. For all the codes that need the implementation from your side, we marked the comments like below:

`//*** Your implementation starts from here. The code below is just for reference`

2. Database interaction:
   1. If you prefer our created model and database in this repo so you just use this project as a microservice in your system. But it requires you to sync your user data with our user data in the example database.
   2. Or you can create another connection string to handle the part related to your user data.
   3. Or just treat this project as a reference and you can implement it by yourself. But we recommend all the APIs using our ServiceX SDK should follow our instruction in this repo or in our developer [documentation](https://developers.credify.one/) to reduce any unexpected errors in an integration phase between your system and our Credify system.
