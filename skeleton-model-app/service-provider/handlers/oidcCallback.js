const { extractApplicationData, extractApplicationDetailData } = require('../utils/extractDOPData')
const oidcCallback = async (req, res, { db, credify, organizationId, redirectUrl, externalDOPService }) => {
    if (!req.query.code || !req.query.state) {
        return res.status(400).send({ message: "Invalid request" })
    }

    const code = req.query.code
    const state = req.query.state

    try {
        const response = await credify.oidc.generateAccessToken(organizationId, code, redirectUrl)
        if (!response || !response.access_token) {
            throw Error("Can't get access token")
        }
        const accessToken = response.access_token;
        console.log(accessToken)

        const request = await db.Request.findAll({ where: { state } })
        if (request.length < 1) {
            throw new Error("Request not found.")
        }

        const encryptionPrivateKey = request[0].privateKey
        const data = await credify.oidc.userinfo(accessToken, encryptionPrivateKey)

        // Create Application on service provider system
        const application = extractApplicationData(data)
        const { createApplication } = externalDOPService;
        const resp = await createApplication(application);

        // Save application to db
        application.referenceId = resp.id;
        const { dataValues } = await db.Application.create(application);

        const applicationDetail = extractApplicationDetailData(data)
        applicationDetail.applicationId = dataValues.id
        await db.ApplicationDetail.create(applicationDetail)

        res.send({ ...data })
    } catch (e) {
        console.log(e.message)
        res.status(500).send({ error: e.message })
    }
}

module.exports = oidcCallback
