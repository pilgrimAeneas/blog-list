import { useState } from "react"

const Blog = ({ blog, handleLike }) => {
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
    <div style={blogStyle}>
      {
        expanded
          ? <>
            <div>
              title: {blog.title}
              {showButton()}
            </div>
            <div>url: {blog.url}</div>
            <div>likes: {blog.likes} {likeButton()}</div>
            <div>author: {blog.author}</div>
          </>
          : <>
            {blog.title}
            {showButton()}
          </>
      }
    </div>
  )
}

export default Blog