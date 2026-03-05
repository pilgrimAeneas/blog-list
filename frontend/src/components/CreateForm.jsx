import { useState } from "react"

const CreateForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const addBlog = event => {
    event.preventDefault()

    handleCreateBlog(title, author, url)

    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input type="text"
              value={title} onChange={({ target }) => setTitle(target.value)} />
          </label>
        </div>
        <div>
          <label>
            author
            <input type="text"
              value={author} onChange={({ target }) => setAuthor(target.value)} />
          </label>
        </div>
        <div>
          <label>
            url
            <input type="text"
              value={url} onChange={({ target }) => setUrl(target.value)} />
          </label>
        </div>
        <button type="submit">create blog</button>
      </form>
    </>
  )
}

export default CreateForm