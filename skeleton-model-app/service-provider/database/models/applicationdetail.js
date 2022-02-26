'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApplicationDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ApplicationDetail.init({
    applicationId: DataTypes.STRING,
    fullName: DataTypes.STRING,
    dob: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    citizenID: DataTypes.STRING,
    permanentAddress: DataTypes.STRING,
    email: DataTypes.STRING,
    residenceTime: DataTypes.STRING,
    currentHousingType: DataTypes.STRING,
    educationLevel: DataTypes.STRING,
    maritalStatus: DataTypes.STRING,
    occupation: DataTypes.STRING,
    companyName: DataTypes.STRING,
    typeOfCompanyRegistration: DataTypes.STRING,
    workAddress: DataTypes.STRING,
    companyPhoneNumber: DataTypes.STRING,
    workingDepartment: DataTypes.STRING,
    payrollDate: DataTypes.STRING,
    monthlyWageIncome: DataTypes.STRING,
    otherIncome: DataTypes.STRING,
    workingTimeAtCurrentUnit: DataTypes.STRING,
    typeOfMainIncome: DataTypes.STRING,
    methodOfReceivingSalary: DataTypes.STRING,
    position: DataTypes.STRING,
    typeOfLaborContract: DataTypes.STRING,
    fatca: DataTypes.STRING,
    individualTaxNumber: DataTypes.STRING,
    nameOfTheStore: DataTypes.STRING,
    modelOfTheGoods: DataTypes.STRING,
    priceOfTheGoods: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ApplicationDetail',
  });
  ApplicationDetail.removeAttribute('id');
  return ApplicationDetail;
};
