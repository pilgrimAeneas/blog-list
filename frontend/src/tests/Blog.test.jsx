import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import Blog from "../components/Blog"

test("renders title and author without details", () => {
  const blog = {
    title: "title 1",
    author: "author 1",
    url: "url1.com",
    likes: 0,
  }


  render(<Blog blog={blog} />)

  const title = screen.queryByText("title 1")
  const author = screen.queryByText("author 1")
  expect(title).toBeDefined()
  expect(author).toBeDefined()

  const url = screen.queryByText("url: url1.com")
  const likes = screen.queryByText("likes: 0")
  expect(url).toBeNull()
  expect(likes).toBeNull()
})


test("renders all details after clicking view", async () => {
  const blog = {
    title: "title 1",
    author: "author 1",
    url: "url1.com",
    likes: 0,
    user: {
      username: "hello",
      name: "helloaswell",
      id: "nonesofar",
    }
  }


  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const viewButton = screen.queryByText("view")
  await user.click(viewButton)

  const title = screen.queryByText("title 1")
  const author = screen.queryByText("author 1")
  const url = screen.queryByText("url1.com")
  const likes = screen.queryByText("0")

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test("like button is clicked multiple times", async () => {
  const blog = {
    title: "title 1",
    author: "author 1",
    url: "url1.com",
    likes: 0,
    user: {
      username: "hello",
      name: "helloaswell",
      id: "nonesofar",
    }
  }

  const mockHandler = vi.fn()
  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText("view")
  await user.click(viewButton)

  const likeButton = screen.getByText("like")
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})