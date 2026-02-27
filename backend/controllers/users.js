const usersRouter = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")

usersRouter.post("/", async (req, res) => {
  const { name, username, password } = req.body

  if (!password) {
    return res.status(400).send({ error: "a password must be chosen" })
  }

  if (password.length < 3) {
    return res.status(400).send({ error: "password must be longer than 3 characters" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name, username, passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

usersRouter.get("/", async (req, res) => {
  const users = await User
    .find({})
    .populate("blogs", { url: 1, title: 1, author: 1, likes: 1 })
  res.json(users)
})

module.exports = usersRouter
