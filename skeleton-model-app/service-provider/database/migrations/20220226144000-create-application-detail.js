'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ApplicationDetails', {
      applicationId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Applications', onDelete: 'cascade' }
      },
      fullName: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      citizenID: {
        type: Sequelize.STRING
      },
      permanentAddress: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      residenceTime: {
        type: Sequelize.STRING
      },
      currentHousingType: {
        type: Sequelize.STRING
      },
      educationLevel: {
        type: Sequelize.STRING
      },
      maritalStatus: {
        type: Sequelize.STRING
      },
      occupation: {
        type: Sequelize.STRING
      },
      companyName: {
        type: Sequelize.STRING
      },
      typeOfCompanyRegistration: {
        type: Sequelize.STRING
      },
      workAddress: {
        type: Sequelize.STRING
      },
      companyPhoneNumber: {
        type: Sequelize.STRING
      },
      workingDepartment: {
        type: Sequelize.STRING
      },
      payrollDate: {
        type: Sequelize.STRING
      },
      monthlyWageIncome: {
        type: Sequelize.STRING
      },
      otherIncome: {
        type: Sequelize.STRING
      },
      workingTimeAtCurrentUnit: {
        type: Sequelize.STRING
      },
      typeOfMainIncome: {
        type: Sequelize.STRING
      },
      methodOfReceivingSalary: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      typeOfLaborContract: {
        type: Sequelize.STRING
      },
      fatca: {
        type: Sequelize.STRING
      },
      individualTaxNumber: {
        type: Sequelize.STRING
      },
      nameOfTheStore : {
        type: Sequelize.STRING
      },
      modelOfTheGoods: {
        type: Sequelize.STRING
      },
      priceOfTheGoods: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ApplicationDetails');
  }
};
