const { Op } = require('sequelize');
const extractToken = require("../utils/extractToken");

const countUsers = async (req, res, { user, credify, evaluateOffer, scopeNames }) => {
  console.log(JSON.stringify(req.body));
  const token = extractToken(req);
  const validToken = await credify.auth.introspectToken(token, "oidc_client:read_user_counts");
  if (!validToken) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const ids = req.body.ids || [];
  let conditions = req.body.conditions || [{}];
  conditions = conditions.map((c) => {
    if (c === null) return {};
    else return c;
  });

  try {
    const users = await user.findAll({
      where: {
        'credifyId': {
          [Op.notIn]: ids, // remove users who have used an offer to this data receiver.
        },
      }
    });

    let counts = Array(conditions.length).fill(0);

    conditions.forEach((c, index) => {
      if (Object.keys(c).length === 0) {
        counts[index] = users.length;
      } else {
        users.forEach((u) => {
          const res = evaluateOffer(u, [c], scopeNames, []);
          if (res.rank === 1) {
            counts[index] += 1;
          }
        });
      }
    });

    const response = {
      data: {
        counts
      }
    };
    res.json(response);
  } catch (e) {
    console.log(JSON.stringify(e));
    res.status(500).send({ message: e.message });
  }
};

module.exports = countUsers;
