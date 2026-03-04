import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginServices from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginServices.login({ username, password })
      setUser(user)
      setUsername("")
      setPassword("")
    } catch {
      window.alert("Wrong credentials")
    }
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
      {
        user !== null
          ? <>
            <h2>blogs</h2>
            <p>{user.name} logged in.</p>
            {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
          </>
          :
          <>
            <h2>log in to the application</h2>
            {loginForm()}
          </>
      }
    </div>
  )
}

export default App