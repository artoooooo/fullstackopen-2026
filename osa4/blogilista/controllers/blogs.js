import Blog from '../models/blog.js'
import User from '../models/user.js'

export const get = async (request, response) => {
  const { id } = request.params
  const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 })

  return blog ? response.json(blog) : response.status(404).json({ id, error:'not found' })
}

export const getAll = async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  return response.json(blogs)
}

// 4.19
export const create = async (request, response) => {
  const { user } = request

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    author: request.body.author,
    title: request.body.title,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id
  })
  const savedBlog = await blog.save()
  await User.findByIdAndUpdate(user.id, {
    $push: { blogs: savedBlog._id }
  })

  return response.status(201).json(savedBlog)
}

//4.13 4.21
export const deleteBlog = async (request, response) => {
  const { user } = request
  if (!user) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const { id } = request.params
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== user.id) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  // poistetaan blogi Blog-kokoelmasta
  await Blog.findByIdAndDelete(request.params.id)

  // poistetaan blogin id myös käyttäjän blogs-taulukosta
  await User.findByIdAndUpdate(user.id, {
    $pull: { blogs: blog._id }
  })

  return response.status(204).end()
}
//4.14
export const updateBlog = async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  return response.json(updatedBlog)
}