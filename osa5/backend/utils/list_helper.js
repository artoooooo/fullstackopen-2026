import _ from 'lodash'

export const dummy = (_blogs) => {
  return 1
}

export const totalLikes = (blogs) => {
  return (blogs ?? []).reduce((count, blog) => count + blog.likes, 0)
}

export const favoriteBlog = (blogs) => {
  return blogs.reduce((max, olio) => olio.likes > max.likes ? olio : max)
}

export const mostBlogs = (blogs) => {
  return _.maxBy(
    _.map(
      _.groupBy(blogs, blog => blog.author),
      (blogs, author) => ({
        author,
        blogs: blogs.length
      })
    ),
    group => group.blogs
  )
}

export const mostLikes = (blogs) => {
  return _.maxBy(
    _.map(_.groupBy(blogs, blog => blog.author), (blogs, author) => ({
      author,
      likes: _.sumBy(blogs, blog => blog.likes)
    })),
    group => group.likes
  )
}