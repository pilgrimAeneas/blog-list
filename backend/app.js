const { MONGODB_URL } = require("./utils/config")
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const blogsRouter = require("./controllers/blogs")

mongoose.connect(MONGODB_URL, { family: 4 })

app.use(express.json())

app.use("/api/blogs", blogsRouter)


module.exports = app