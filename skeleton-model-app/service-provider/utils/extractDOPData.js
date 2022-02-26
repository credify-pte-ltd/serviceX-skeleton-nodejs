const { APPLICATION_STATUS } = require('./constants')

const extractApplicationData = (data) => {
  return {
    consumerId: data.sid,
    userId: data.sub,
    approvalId: data.approval_id || '',
    referenceId: data.reference_id || '',
    dopCode: data.dop_code || '',
    referenceId: data.reference_id || '',
    status: APPLICATION_STATUS.inReview,
  }
};

const extractApplicationDetailData = (data) => {
  return {
    fullName: data.full_name || '',
    dob: data.dob || '',
    phoneNumber: data.phone_number || '',
    citizenID: data.citizen_id || '',
    permanentAddress: data.permanent_address || '',
    email: data.email || '',
    residenceTime: data.residence_time || '',
    currentHousingType: data.current_housing_type || '',
    educationLevel: data.education_level || '',
    maritalStatus: data.marital_status || '',
    occupation: data.occupation || '',
    companyName: data.company_name || '',
    typeOfCompanyRegistration: data.type_of_company_registration || '',
    workAddress: data.workAddress || '',
    companyPhoneNumber: data.company_phone_number || '',
    workingDepartment: data.working_department || '',
    payrollDate: data.payroll_date || '',
    monthlyWageIncome: data.monthly_wage_income || '',
    otherIncome: data.other_income || '',
    workingTimeAtCurrentUnit: data.working_time_at_current_unit || '',
    typeOfMainIncome: data.type_of_main_income || '',
    method_of_receiving_salary: data.method_of_receiving_salary || '',
    position: data.position || '',
    typeOfLaborContract: data.type_of_labor_contract || '',
    fatca: data.fatca || '',
    individualTaxNumber: data.individual_tax_number || '',
    nameOfTheStore: data.name_of_the_store || '',
    modelOfTheGoods: data.model_of_the_goods || '',
    priceOfTheGoods: data.price_of_the_goods || '',
  }
};

module.exports = {
  extractApplicationData,
  extractApplicationDetailData,
}
