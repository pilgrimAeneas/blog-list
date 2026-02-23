const { describe, test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const app = require("../app")
const supertest = require("supertest")
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const { initialBlogs, blogsInDB, generateID } = require("./test_helpers")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Promise.all(initialBlogs
    .map(blog => new Blog(blog))
    .map(blog => blog.save()))
})

// Tests here
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

after(async () => {
  await mongoose.connection.close()
})
