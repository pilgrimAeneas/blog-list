const { test, expect, beforeEach, describe } = require("@playwright/test")

const createBlog = async (title, author, url, page) => {
  await page.getByText("create blog").first().click()
  await page.getByText("title").fill(title)
  await page.getByText("author").fill(author)
  await page.getByText("url").fill(url)
  await page.getByText("create blog").last().click()
  await page.getByText(title).last().waitFor()
}

const loginWith = async (username, paswword, page) => {
  await page.getByText("username").fill(username)
  await page.getByText("password").fill(paswword)
  await page.getByText("Login", { exact: true }).click()
}


describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset")

    await request.post("/api/users", {
      data: {
        name: "tester1",
        username: "person1",
        password: "hash!me!now"
      }
    })

    await request.post("/api/users", {
      data: {
        name: "tester2",
        username: "person2",
        password: "hash!me!now"
      }
    })

    await page.goto("/")
  })

  test("Login form is shown", async ({ page }) => {
    const header = page.getByText("log in to the application")
    const username = page.getByText("username")
    const password = page.getByText("password")
    const login = page.getByText("Login")

    await expect(header).toBeVisible()
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
    await expect(login).toBeVisible()

    const falseHeader = page.getByText("blogs")
    const falseButton = page.getByText("create blog")

    await expect(falseHeader).not.toBeVisible()
    await expect(falseButton).not.toBeVisible()
  })

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith("person1", "hash!me!now", page)
      await expect(page.getByText("tester1 logged in")).toBeVisible()
    })

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith("person0", "dont!hash!me", page)
      await expect(page.getByText("Notification! (sorry no css):Wrong credentials"))
        .toBeVisible()
    })
  })

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith("person1", "hash!me!now", page)
      await createBlog("tester2_blog", "tester2", "tester2.com", page)
    })

    test("a new blog can be created", async ({ page }) => {
      await createBlog("tester1_blog", "tester1", "tester1.com", page)
      await expect(page.getByText("tester1_blog by tester1").last())
        .toBeVisible()
    })

    test("a blog can be liked", async ({ page }) => {
      await page.getByText("view").click()
      await page.getByText("like").click()
      await expect(page.getByText("likes: 1")).toBeVisible()
    })

    test("a blog can be deleted by owner", async ({ page }) => {
      page.on("dialog", async dialog => {
        expect(dialog.type()).toBe("confirm")
        await dialog.accept()
      })

      await page.getByText("view").click()
      await page.getByText("remove").click()
      await expect(page.getByText("tester2_blog", { exact: false }))
        .not.toBeVisible()
    })

    test("a blog can only be deleted by owner", async ({ page }) => {
      await page.getByText("logout").click()
      await loginWith("person2", "hash!me!now", page)

      await page.getByText("view").click()
      await expect(page.getByText("remove", { exact: false }))
        .not.toBeVisible()
    })

  })

  test("blogs sorted by likes", async ({ page }) => {
    await loginWith("person1", "hash!me!now", page)
    await createBlog("tester1_blog", "tester1", "tester1.com", page)
    await createBlog("tester2_blog", "tester2", "tester2.com", page)
    await createBlog("tester3_blog", "tester3", "tester3.com", page)
    await createBlog("tester4_blog", "tester4", "tester4.com", page)

    await page.getByText("view").last().click()
    await page.getByText("like").click()
    await page.getByText("hide").click()

    await page.getByText("view").first().click()

    await expect(page.getByText("title: tester4_blog", { exact: false }))
      .toBeVisible()
  })
})
