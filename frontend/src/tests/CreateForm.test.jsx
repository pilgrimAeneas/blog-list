import { render, screen } from "@testing-library/react"
import CreateForm from "../components/CreateForm"
import userEvent from "@testing-library/user-event"

test("Blog creattion \"onSubmit\" works as expected", async () => {
  const handleCreateBlog = vi.fn()
  const user = userEvent.setup()

  render(<CreateForm handleCreateBlog={handleCreateBlog} />)

  const inputs = screen.getAllByRole("textbox")
  const saveButton = screen.getByText("create blog")

  await user.type(inputs[0], "test title!")
  await user.type(inputs[1], "test author!")
  await user.type(inputs[2], "test url!")
  await user.click(saveButton)

  expect(handleCreateBlog.mock.calls).toHaveLength(1)

  expect(handleCreateBlog.mock.calls[0][0]).toBe("test title!")
  expect(handleCreateBlog.mock.calls[0][1]).toBe("test author!")
  expect(handleCreateBlog.mock.calls[0][2]).toBe("test url!")
})