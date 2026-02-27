const { test, after, beforeEach, describe } = require("node:test")
const assert = require("node:assert")
const bcrypt = require("bcrypt")
const app = require("../app")
const supertest = require("supertest")
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const User = require("../models/user")
const { initialBlogs, blogsInDB, usersInDB } = require("./test_helpers")

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash("fullstackpassword", saltRounds)
  const root = new User({ name: "root", username: "root", passwordHash, })

  const modelInitialBlogs = initialBlogs
    .map(blog => new Blog({ ...blog, user: root._id.toString() }))

  modelInitialBlogs.forEach(blog => root.blogs = root.blogs.concat(blog._id))

  await Promise.all(modelInitialBlogs.map(blog => blog.save()))
  await root.save()
})

describe("GET/Read Functionality", () => {
  test("Return correct number of blogs in json format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    assert(response.body.length === initialBlogs.length)
  })

  test("Returned blog's unique identifier is id not _id", async () => {
    const response = await api.get("/api/blogs")
    const one_blog = response.body[0]
    assert(Object.keys(one_blog).includes("id"))
    assert(!Object.keys(one_blog).includes("_id"))
  })
})

describe("POST/Create Functionality", () => {
  test("POST successfully creates a new user", async () => {
    const usersBefore = await usersInDB()

    const newUser = {
      name: "Hello, world!",
      username: "new_user",
      password: "hash!me!now",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAfter = await usersInDB()
    assert(usersAfter.map(user => user.username).includes("new_user"))
    assert(usersAfter.length - 1 === usersBefore.length)
  })

  test("POST doesn't create a new user without a unique username", async () => {
    const usersBefore = await usersInDB()

    const newUser = {
      name: "Hello, world!",
      username: "root",
      password: "hash!me!now",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAfter = await usersInDB()
    assert(usersAfter.length === usersBefore.length)
    assert(result.body.error === "username not unique")
  })

  test("POST successfully adds a blog to DB", async () => {
    const usersBefore = await usersInDB()

    const testingBlog = {
      title: "Testing blog",
      author: "Testing author",
      url: "test.com",
      likes: 5,
      user: usersBefore[0].id,
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
    const usersBefore = await usersInDB()

    const noLikesBlog = {
      title: "No likes blog",
      author: "No likes author",
      url: "Nolikes.com",
      user: usersBefore[0].id,
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

  test("POST blog with missing url or title sends a status 400", async () => {
    const pizzaWithNothing = {
      author: "No one",
      likes: 5
    }

    await api
      .post("/api/blogs")
      .send(pizzaWithNothing)
      .expect(400)
  })
})

describe("PUT/Update Functionality", () => {
  test("Update a blog's likes field", async () => {
    const blogsBefore = await blogsInDB()

    const firstBlog = blogsBefore[0]
    const firstBlogID = firstBlog.id


    const newBlog = {
      id: firstBlog.id,
      title: firstBlog.title,
      author: firstBlog.author,
      url: firstBlog.url,
      likes: 100,
      user: firstBlog.user,
    }

    await api
      .put(`/api/blogs/${firstBlogID}`)
      .send(newBlog)
      .expect(200)

    const blogsAfter = await blogsInDB()

    assert(blogsAfter.length === blogsBefore.length)
    assert(blogsAfter.map(blog => blog.id).includes(firstBlogID))
    assert(blogsAfter.find(blog => blog.id === firstBlogID).likes === 100)
  })
})

describe("DELETE/Delete Functionality", () => {
  test("DELETE blog works correctly", async () => {
    const blogsBefore = await blogsInDB()
    const firstBlog = blogsBefore[0]
    const existingBlogID = firstBlog.id

    await api
      .delete(`/api/blogs/${existingBlogID}`)
      .expect(204)

    const blogsAfter = await blogsInDB()

    assert(blogsAfter.length + 1 === blogsBefore.length)
    assert(!blogsAfter.map(blog => blog.id).includes(existingBlogID))
  })

  // TODO: Add tests for number of blogs a user has after delete.
})

describe("Unknown Endpoints", () => {
  const unknownEndpointError = { error: "unknown endpoint" }
  test("Unknown endpoints with DELETE", async () => {
    const response = await api
      .get("/api/notblogs")
      .expect(404)

    assert.deepStrictEqual(unknownEndpointError, response.body)
  })

  test("Unknown endpoints with POST", async () => {
    const response = await api
      .post("/api/notblogs")
      .expect(404)

    assert.deepStrictEqual(unknownEndpointError, response.body)
  })
})

after(async () => {
  await mongoose.connection.close()
})
