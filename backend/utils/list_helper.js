const lodash = require("lodash")

const totalLikes = blogs => {
  return blogs.reduce((acc, blog) => blog.likes + acc, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((acc, blog) => blog.likes > acc.likes ? blog : acc)
}

// maybe make these two better?
// can improve readability with intermediate variables to
// hold the mapping/reduce returns.

const mostBlogs = blogs => {
  return Object.entries(lodash.groupBy(blogs, "author"))
    .map(author_blogs => { return { name: author_blogs[0], blogs: author_blogs[1] } })
    .map(author_blogs => {
      return {
        name: author_blogs.name,
        score: author_blogs.blogs.length
      }
    })
    .reduce((acc, author) => author.score > acc.score ? author : acc)
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
