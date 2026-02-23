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
test("", () => { })

after(async () => {
  await mongoose.connection.close()
})
