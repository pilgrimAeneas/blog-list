const express = require("express")
const mongoose = require("mongoose")

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set("toJSON", {
  transform: (document, object) => {
    object.id = object._id.toString()
    delete object._id
    delete object.__v
  }
})

const Blog = mongoose.model("Blog", blogSchema)

mongoose.connect(process.env.MONGODB_URL, { family: 4 })

app.use(express.json())

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = app