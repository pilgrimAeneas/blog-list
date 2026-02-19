const lodash = require("lodash")

const totalLikes = blogs => {
  return blogs.reduce((acc, blog) => blog.likes + acc, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((acc, blog) => blog.likes > acc.likes ? blog : acc)
}

// maybe make these two better?
// First one can improve by using an optimized library or a dictionary
// instead of the authorsRepeated forEach to avoid double loops O(n^2)
// Second one can use a variable name after each higher-order function call

const mostBlogs = blogs => {
  const authorsRepeated = blogs.reduce((acc, blog) => acc.concat(blog.author), [])
  const authorsUnique = [...(new Set(authorsRepeated))]
  const authorScores = authorsUnique.map(author => {
    return { name: author, score: 0 }
  })

  authorsRepeated.forEach(author => {
    authorScores.find((entry) => entry.name === author).score++
  })

  return authorScores.reduce((acc, author) => {
    return author.score > acc.score ? author : acc
  })
}

const mostLikes = blogs => {
  return Object.entries(lodash.groupBy(blogs, "author"))
    .map(author_blogs => { return { name: author_blogs[0], blogs: author_blogs[1] } })
    .map(author_blogs => {
      return {
        name: author_blogs.name,
        likes: author_blogs.blogs.reduce((acc, blog) => acc + blog.likes, 0)
      }
    })
    .reduce((acc, author) => author.likes > acc.likes ? author : acc)
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
