const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body)
  if (!blog.likes) { blog.likes = 0 }

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body

  const theBlog = await Blog.findById(request.params.id)
  if (!theBlog) { response.status(404).end() }

  theBlog.title = title
  theBlog.author = author
  theBlog.url = url
  theBlog.likes = likes

  await theBlog.save()
  response.json(theBlog)
})

module.exports = blogsRouter
