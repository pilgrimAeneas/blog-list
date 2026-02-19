const totalLikes = blogs => {
  return blogs.reduce((acc, blog) => blog.likes + acc, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((acc, blog) => blog.likes > acc.likes ? blog : acc)
}

module.exports = {
  totalLikes,
  favoriteBlog,
}