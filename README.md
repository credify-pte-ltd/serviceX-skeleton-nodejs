# The skeleton app for serviceX implementation:

Inside the skeleton-model-app folder we have two folders:

1. Market folder: If you are a market then all the example codes inside this folder
2. Service-Provider folder: If you are a service provider then all the example codes inside this folder.

## App structure:

This skeleton app is build on top of nodejs to demo how we can use the serviceX SDK to build the required APIs
Each repo has each own database, seed datas and full implementation of each required APIs.

## How to run it ?

1. You need to create your .env file follow the .env.sample
2. You need to create your test database follow your connection url inside the .env file
3. `yarn db:setup` for migration
4. `yarn dev` or `yarn start` for establish the local server for testing

## Customize and interaction:

1. Code logic:
   You can use our current implementaion if you think it is suitable for your system. For all the flows that need the implementation from your side, we marked the comments like below:

`//*** Your implementation start from here. The code below is just for reference`

2. Database interaction:
   1. If you prefer our created model and database in this repo so you just use this project as a microservice in your system. But it requires you to to sync your user data with our example database.
   2. Or you can create another connection string to handle the part related to your user data.
   3. Or just treat this project as a reference and you can do an implementation by your way in your current system. But we recommend all the APIs using our serviceX SDK should follow our intruction either in this repo or in our developer [documentation](https://developers.credify.one/) to reduce the unexpected errors when we do an intergraiton between your system and our Credify system.
