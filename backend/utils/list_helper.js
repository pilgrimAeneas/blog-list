const totalLikes = blogs => {
  return blogs.reduce((acc, blog) => blog.likes + acc, 0)
}



module.exports = {
  totalLikes,
}