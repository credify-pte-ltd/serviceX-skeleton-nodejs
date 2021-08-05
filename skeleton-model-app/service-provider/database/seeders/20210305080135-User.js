const faker = require("faker")
const { sha256 } = require("@credify/nodejs")
const { PAYMENT_METHOD, PRODUCT } = require("../../utils/constants")
const generateRandomVnPhoneNumber = require("../../utils/generateRandomVnPhoneNumber")

// This is just a random data for testing purpose so we have no responsibility or liability for any issue related to the generated data

const USER_COUNT = 10000
const productCount = Object.keys(PRODUCT).length
const paymentMethodCount = Object.keys(PAYMENT_METHOD).length

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = []
    for (let i = 0; i < USER_COUNT; i++) {
      const phoneNumber = generateRandomVnPhoneNumber()
      const data = {
        id: i + 1,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        address:
          faker.address.streetAddress() +
          faker.address.city() +
          faker.address.country(),
        phoneNumber,
        phoneCountryCode: "+84",
        hashedPhoneNumber: sha256(phoneNumber),
        creditScore: faker.datatype.number(200),
        transactionsCount: faker.datatype.number(1000),
        totalPaymentAmount: faker.datatype.number(1000000),
        averageSpending: faker.datatype.number(1000000),
        paymentMethods: Object.values(PAYMENT_METHOD)[i % paymentMethodCount],
        lastPurchaseProduct: Object.values(PRODUCT)[i % productCount],
        married: faker.datatype.boolean(),
        divorced: faker.datatype.boolean(),
        credifyId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(data)
    }
    await queryInterface.bulkInsert("Users", users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {})
  },
}
