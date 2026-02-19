const totalLikes = blogs => {
  return blogs.reduce((acc, blog) => blog.likes + acc, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((acc, blog) => blog.likes > acc.likes ? blog : acc)
}

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



module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
