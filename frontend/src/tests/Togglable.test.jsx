import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Togglable from "../components/Togglable"

describe("<Togglable />", () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show">
        <div>content</div>
      </Togglable>
    )
  })

  test("renders children", () => {
    screen.getByText("content")
  })

  test("doesn't render children at first", () => {
    const tog1 = screen.getByText("content")
    expect(tog1).not.toBeVisible()
  })

  test("children are displayed after clicking", async () => {
    const user = userEvent.setup()
    const button = screen.getByText("show")
    await user.click(button)

    const tog1 = screen.getByText("content")
    expect(tog1).toBeVisible()
  })

  test("children are hidden after second click", async () => {
    const user = userEvent.setup()
    const button = screen.getByText("show")
    await user.click(button)

    const closeButton = screen.getByText("cancel")
    await user.click(closeButton)

    const tog1 = screen.getByText("content")
    expect(tog1).not.toBeVisible()
  })

})