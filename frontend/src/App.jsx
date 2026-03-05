import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import CreateForm from "./components/CreateForm"
import Togglable from "./components/Togglable"
import blogService from "./services/blogs"
import loginServices from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const JsonLoggedUser = window.localStorage.getItem("loggedUser")
    if (JsonLoggedUser) {
      const user = JSON.parse(JsonLoggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginServices.login({ username, password })
      notify("login successful, welcome John Bloglist")
      window.localStorage.setItem("loggedUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch {
      notify("Wrong credentials")
    }
  }

  const handleCreateBlog = async event => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create({ title, author, url })
      notify(`a new blog ${title} by ${author} added.`)
      setBlogs(blogs.concat(createdBlog))
      setTitle("")
      setAuthor("")
      setUrl("")
    } catch (error) {
      notify(`Error creating blog: ${error.response.data.error}`)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const notify = message => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const loginForm = () => {
    return (
      <>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input type="text"
                value={username} onChange={({ target }) => setUsername(target.value)} />
            </label>
          </div>
          <div>
            <label>
              password
              <input type="text"
                value={password} onChange={({ target }) => setPassword(target.value)} />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </>
    )
  }

  return (
    <div>
      {user !== null ? <h2>blogs</h2> : <h2>log in to the application</h2>}
      <Notification message={message} />
      {user !== null
        ? <>
          <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>

          <Togglable buttonLabel="create blog">
            <CreateForm
              handleCreateBlog={handleCreateBlog}
              setTitle={setTitle}
              setAuthor={setAuthor}
              setUrl={setUrl}
              title={title}
              author={author}
              url={url}
            />
          </Togglable>

          {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </>
        : <>
          {loginForm()}
        </>
      }
    </div>
  )
}

const Notification = ({ message }) => {
  if (message) {
    return (
      <p>
        Notification! (sorry no css):
        {message}
      </p>
    )
  }

  return (<></>)
}

export default App