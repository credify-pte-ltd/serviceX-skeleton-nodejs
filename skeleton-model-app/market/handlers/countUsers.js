const { Op } = require("sequelize")
const extractToken = require("../utils/extractToken")
const { PERMISSION_SCOPE } = require("../utils/constants")

const countUsers = async (req, res, { user, credify, composeClaimObject }) => {
  const token = extractToken(req)
  try {
    const validToken = await credify.auth.introspectToken(
      token,
      PERMISSION_SCOPE.COUNT_USER
    )
    if (!validToken) {
      return res.status(401).send({ message: "Unauthorized" })
    }
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }

  const ids = req.body.ids || []
  let conditions = req.body.conditions || [{}]
  conditions = conditions.map((c) => {
    if (c === null) return {}
    else return c
  })
  const requiredCustomScopes = req.body.required_custom_scopes || []
  //*** Your implementation start from here. The code below is just for reference
  try {
    const users = await user.findAll({
      where: {
        credifyId: {
          [Op.notIn]: ids, // remove users who have used an offer to this data receiver.
        },
      },
    })

    let counts = Array(conditions.length).fill(0)
    await conditions.forEach(async (c, index) => {
      if (Object.keys(c).length === 0) {
        counts[index] = users.length
      } else {
        await users.forEach(async (u) => {
          const userClaims = composeClaimObject(u)
          //*** Our SDK already supports offer evaluation for you
          const res = await credify.offer.evaluateOffer(
            [c],
            requiredCustomScopes,
            userClaims
          )
          if (res.rank === 1) {
            counts[index] += 1
          }
        })
      }
    })

    const response = {
      data: {
        counts,
      },
    }
    res.json(response)
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}

module.exports = countUsers
