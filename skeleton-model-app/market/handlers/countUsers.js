const { Op } = require("sequelize")
const extractToken = require("../utils/extractToken")
const { PERMISSION_SCOPE } = require("../utils/constants")

const countUsers = async (
  req,
  res,
  { user, credify, evaluateOffer, scopeNames }
) => {
  const token = extractToken(req)
  const validToken = await credify.auth.introspectToken(
    token,
    PERMISSION_SCOPE.COUNT_USER
  )
  if (!validToken) {
    return res.status(401).send({ message: "Unauthorized" })
  }
  const ids = req.body.ids || []
  let conditions = req.body.conditions || [{}]
  conditions = conditions.map((c) => {
    if (c === null) return {}
    else return c
  })

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
    conditions.forEach((c, index) => {
      if (Object.keys(c).length === 0) {
        counts[index] = users.length
      } else {
        users.forEach((u) => {
          const res = evaluateOffer(u, [c], scopeNames, [])
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
