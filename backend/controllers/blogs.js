const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const { userExtractor } = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 })
  response.json(blogs)
})

blogsRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user
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

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const tokenHolder = request.user
  const blogId = request.params.id
  const blog = (await Blog.findById(blogId))
  if (!blog) {
    return response.status(404).send({ error: "blog not found" })
  }

  const user = (await User.findById(blog.user.toString()))
  if (!user) {
    return response.status(401).send({ error: "Invalid user id" })
  }

  if (tokenHolder.id.toString() !== user._id.toString()) {
    return response.status(401).send({ error: "Unauthorized" })
  }


  user.blogs = user.blogs.filter(blog => blog.toString() !== blogId)

  await user.save()
  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const theBlog = await Blog.findById(request.params.id)
  if (!theBlog) { response.status(404).end() }

  theBlog.title = title
  theBlog.author = author
  theBlog.url = url
  theBlog.likes = likes
  theBlog.user = (await User.findById(user))._id

  if (theBlog.user._id.toString() !== request.user._id.toString()) {
    return response.status(401).send({ error: "Unauthorized" })
  }

  await theBlog.save()
  response.json(theBlog)
})

module.exports = blogsRouter
