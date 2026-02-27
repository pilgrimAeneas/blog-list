const usersRouter = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")

usersRouter.post("/", async (req, res) => {
  const { name, username, password } = req.body

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
  console.log(users)
  res.json(users)
})

module.exports = usersRouter
