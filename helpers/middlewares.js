const { verifyToken } = require('./jwt.js')
const { Content, User } = require('../models')

async function authentication (req, res, next) {
  try {
    const { access_token } = req.headers
    if (!access_token) {
      throw { name: `Unauthorized Access` }
    } else {
      const payload = verifyToken(access_token)
      const foundUser = await User.findOne({
        where: {
          username: payload.username,
        }
      })
      if (!foundUser) {
        throw { name: `Unauthorized Access` }
      }
      else {
        req.user = {}
        req.user.username = foundUser.username
        req.user.id = foundUser.id
        next()
      }
    }
  } catch (error) {
    next(error)
  }
}

async function authorization (req, res, next) {
  try {
    if (req.user.username == 'mukti' || req.user.username == 'far') {
      next()
    } else {
      const result = await Content.findByPk(req.params.id)
      if (result.UserId == req.user.id) {
        next()
      } else {
        throw ({ name: `Forbidden Access` })
      }
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  authentication,
  authorization
}