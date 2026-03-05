import { useState, useEffect, useRef } from "react"

import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import CreateForm from "./components/CreateForm"
import Togglable from "./components/Togglable"
import Notification from "./components/Notification"
import blogService from "./services/blogs"
import loginServices from "./services/login"
import blogServies from "./services/blogs"

const App = () => {
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  const blogFormRef = useRef()

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

  const notify = message => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginServices.login({ username, password })
      notify("login successful, welcome John Bloglist")
      window.localStorage.setItem("loggedUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      notify("Wrong credentials")
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleCreateBlog = async (title, author, url) => {
    try {
      const createdBlog = await blogService.create({ title, author, url })
      notify(`a new blog ${title} by ${author} added.`)
      setBlogs(blogs.concat(createdBlog))
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      notify(`Error creating blog: ${error.response.data.error}`)
    }
  }

  const handleLike = async blog => {
    const newBlog = {
      user: blog.user.id ? blog.user.id : blog.user,
      // before update, front end blogs have user.id (full user)
      // after update, front end blog no longer has full user, just user (id only)

      likes: blog.likes + 1,

      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }

    try {
      setBlogs(blogs.map(blog => blog.id === newBlog.id ? newBlog : blog))
      await blogServies.update(blog.id, newBlog)
    } catch (error) {
      window.alert(error.response.data.error)
    }
  }

  return (
    <div>
      {user !== null ? <h2>blogs</h2> : <h2>log in to the application</h2>}
      <Notification message={message} />
      {user !== null
        ? <>
          <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>

          <Togglable buttonLabel="create blog" ref={blogFormRef}>
            <CreateForm handleCreateBlog={handleCreateBlog} />
          </Togglable>

          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={() => handleLike(blog)}
            />)}
        </>
        : <LoginForm handleLogin={handleLogin} />
      }
    </div>
  )
}

export default App