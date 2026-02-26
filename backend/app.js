const { MONGODB_URL } = require("./utils/config")
const express = require("express")
const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const { requestLogger, unknownEndpoint, errorHandler } = require("./utils/middleware")
const { info, error } = require("./utils/logger")

const app = express()
mongoose.connect(MONGODB_URL, { family: 4 })
  .then(() => info("connected to DB successfully"))
  .catch(result => error(result.message))

// app.use(express.static("dist")) // waiting for front end build
app.use(express.json())
app.use(requestLogger)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
