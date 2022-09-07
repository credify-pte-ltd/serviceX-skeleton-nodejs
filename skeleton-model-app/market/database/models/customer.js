"use strict"
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customers.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.TEXT,
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      info: DataTypes.JSONB,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
      gender: DataTypes.STRING,
      id_number: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Customers",
    }
  )

  return Customers
}
