const uuid = require('uuid');
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Application.init({
    consumerId: DataTypes.STRING,
    userId: DataTypes.STRING,
    approvalId: DataTypes.STRING,
    dopCode: DataTypes.STRING,
    referenceId: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Application',
  });

  Application.addHook('beforeSave', async (Application) => {
    return Application.id = uuid.v4();
  });

  return Application;
};
