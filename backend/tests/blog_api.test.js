const { test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const app = require("../app")
const supertest = require("supertest")
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const { initialBlogs, blogsInDB } = require("./test_helpers")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Promise.all(initialBlogs
    .map(blog => new Blog(blog))
    .map(blog => blog.save()))
})

test("Return correct number of blogs in json format", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  assert(response.body.length === initialBlogs.length)
})

test("Blog's unique identifier is name id not _id", async () => {
  const response = await api.get("/api/blogs")
  const one_blog = response.body[0]
  assert(Object.keys(one_blog).includes("id"))
  assert(!Object.keys(one_blog).includes("_id"))
})

test("POST successfully adds a blog to DB", async () => {
  const testingBlog = {
    title: "Testing blog",
    author: "Testing author",
    url: "test.com",
    likes: 5,
  }

  const blogsBefore = await blogsInDB()
  await api
    .post("/api/blogs")
    .send(testingBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)
  const blogsAfter = await blogsInDB()

  assert(blogsAfter.length === blogsBefore.length + 1)
  assert(blogsAfter.map(blog => blog.title).includes(testingBlog.title))
  assert(blogsAfter.map(blog => blog.author).includes(testingBlog.author))
  assert(blogsAfter.map(blog => blog.url).includes(testingBlog.url))
  assert(blogsAfter.map(blog => blog.likes).includes(testingBlog.likes))
})

test("POST blog with no likes defaults to 0", async () => {
  const noLikesBlog = {
    title: "No likes blog",
    author: "No likes author",
    url: "Nolikes.com",
  }

  const response = await api
    .post("/api/blogs")
    .send(noLikesBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const newBlogAsResponse = response.body
  const newBlogInDB = (await blogsInDB())
    .find(blog => blog.title === noLikesBlog.title)

  assert(newBlogAsResponse.likes === 0)
  assert(newBlogInDB.likes === 0)
})

test("Missing url or title sends a status 400", async () => {
  const pizzaWithNothing = {
    author: "No one",
    likes: 5
  }

  await api
    .post("/api/blogs")
    .send(pizzaWithNothing)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
