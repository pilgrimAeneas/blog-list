const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const { SECRET } = require("../utils/config")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 })
  response.json(blogs)
})

const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.replace("Bearer ", "")
  }

  return null
}

blogsRouter.post("/", async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), SECRET)
  if (!decodedToken.id) {
    return response.status(401).send({ error: "invalid token" })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: "user ID missing or not valid" })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })

  if (!blog.likes) { blog.likes = 0 }

  const result = await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete("/:id", async (request, response) => {
  // only signed in will delete only in own notes list
  const blogId = request.params.id
  const user = (await User.findById((await Blog.findById(blogId)).user.toString()))

  user.blogs = user.blogs.filter(blog => blog.toString() !== blogId)

  await user.save()
  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
  // only signed in will update only in own notes list
  const { title, author, url, likes, user } = request.body

  const theBlog = await Blog.findById(request.params.id)
  if (!theBlog) { response.status(404).end() }

  theBlog.title = title
  theBlog.author = author
  theBlog.url = url
  theBlog.likes = likes
  theBlog.user = (await User.findById(user))._id

  await theBlog.save()
  response.json(theBlog)
})

module.exports = blogsRouter
