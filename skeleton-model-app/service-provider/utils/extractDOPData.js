const { APPLICATION_STATUS } = require('./constants')

const extractDOPData = (data) => {
    return {
        id: '',
        consumerId: data.sid,
        userId: data.sub,
        email: data.email || '',
        phone_number: data.phone_number || '',
        approvalId: data.approvalId || '',
        referenceId: data.referenceId || '',
        dopCode: data.dopCode || '',
        referenceId: data.referenceId || '',
        status: APPLICATION_STATUS.inReview,
    }
};

module.exports = extractDOPData
