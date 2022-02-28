const uuid = require('uuid')

const externalDOPService = () => {
  const createApplication = async (application) => {
    console.log("Call external api from HDSS system to save Application: ", application);
    return { id: uuid.v4() }
  }

  const approveApplication = async (application) => {
    console.log("Call external api from HDSS system to update Application: ", application);
    return { id: uuid.v4() }
  }
  return {
    createApplication,
    approveApplication,
  }
}

module.exports = externalDOPService
