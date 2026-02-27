const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const { SECRET } = require("../utils/config")
const loginRouter = require("express").Router()

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  const isCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  const isCorrect2 = (!user) && await bcrypt.compare(password, user.passwordHash)

  console.log(isCorrect, isCorrect2)

  if (!isCorrect) {
    return response.status(401).send({
      error: "Invalid username or password"
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
