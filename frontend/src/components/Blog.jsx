import { useState } from "react"

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [expanded, setExpanded] = useState(false)

  const showButton = () => {
    return (
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "hide" : "view"}
      </button>
    )
  }

  const likeButton = () => {
    return (
      <button onClick={handleLike}>
        like
      </button>
    )
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      {
        expanded
          ? <>
            <div>
              title: {blog.title}
              {showButton()}
            </div>
            <div>author: {blog.author}</div>
            <div>url: {blog.url}</div>
            <div>likes: {blog.likes} {likeButton()}</div>
            <div>user: {blog.user.name}</div>
            {currentUser === blog.user.name
              ? <button onClick={handleDelete}>remove</button>
              : <></>
            }

          </>
          : <>
            {blog.title} by {blog.author}
            {showButton()}
          </>
      }
    </div>
  )
}

export default Blog