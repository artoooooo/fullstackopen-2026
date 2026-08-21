import supertest from 'supertest'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { MONGO_URL } from '../utils/config.js'
import { blogs } from './test_data.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import { test, describe, after, beforeEach, before  } from 'node:test'
import assert from 'node:assert'
import { usersInDb } from './test_helper.js'
import app from '../app.js'

const login = async (api, username, password) => {
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: username,
      password: password
    })
    .expect(200)

  return loginResponse.body.token
}
describe('blogs api', () => {
  let api
  let token
  let token2
  before(async () => {
    await mongoose.connect(MONGO_URL, { family: 4 })
    api = supertest(app)
  })
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    const user = await User.create({
      username: 'root',
      name: 'Superuser',
      passwordHash
    })
    await User.create({
      username: 'ruut',
      name: 'notSuperuser',
      passwordHash
    })

    const savedBlogs = await Promise.all(blogs.map(blog => Blog.create({ ...blog, user: user._id })))

    user.blogs = savedBlogs.map(blog => blog._id)
    await user.save()

    token = await login(api, 'root', 'sekret')
    token2 = await login(api, 'ruut', 'sekret')
  })
  //4.8
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, blogs.length)
  })
  //4.10
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }
    const begin = await api.get('/api/blogs')

    const postResponse =   await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const end = await api.get('/api/blogs')
    const addedBlog = postResponse.body

    assert.strictEqual(begin.body.length + 1, end.body.length)
    assert.strictEqual(newBlog.title, addedBlog.title)
    assert.strictEqual(newBlog.author, addedBlog.author)
    assert.strictEqual(newBlog.url, addedBlog.url)
  })
  test('blog cannot be added without token', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Test Author',
      url: 'https://example.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
  //4.11
  test('default likes is 0', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })
  //4.9
  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert(blog.id)
      assert(!blog._id)
    })
  })
  test('a specific blog can be viewed', async () => {
    const blog = (await Blog.find({ title: blogs[1].title }))[0]

    assert.notEqual(undefined, blog._id)
    const resultBlog = await api
      .get(`/api/blogs/${blog._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const result = resultBlog.body

    assert.strictEqual(result.title, blog.title, 'title')
    assert.strictEqual(result.author, blog.author, 'author' )
    assert.strictEqual(result.likes, blog.likes, 'likes' )
    assert.strictEqual(result.url, blog.url, 'url' )
    assert.strictEqual(result.id, blog.id, 'id' )
  })
  //4.12.1
  test('a blog without title is not added', async () => {
    const blog = {
      author: 'Test Author',
      likes: 5,
      url: 'https://example.com/blog'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(400)
  })
  //4.12.2
  test('a blog without url is not added', async () => {
    const blog = {
      title: 'Test blog',
      author: 'Test Author',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(400)
  })
  // 4.13.1
  test('a blog can be deleted', async () => {
    const blog = (await Blog.find({ title: blogs[1].title }))[0]

    await api
      .delete(`/api/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(blogsAtEnd.body.length, blogs.length - 1)

    const deletedBlog = blogsAtEnd.body.find(b => b.id === blog.id)

    assert.strictEqual(deletedBlog, undefined)
  })
  test('a blog cannot be deleted by a non-owner', async () => {
    const blog = (await Blog.find({ title: blogs[2].title }))[0]

    await api
      .delete(`/api/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(401)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(blogsAtEnd.body.length, blogs.length)
  })
  // 4.13.2
  test('a deleted blog cannot be viewed', async () => {
    const blog = (await Blog.find({ title: blogs[1].title }))[0]

    await api
      .get(`/api/blogs/${blog._id}`)
      .expect(200)

    await api
      .delete(`/api/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    await api
      .get(`/api/blogs/${blog._id}`)
      .expect(404)
  })
  // 4.14
  test('a blog can be updated', async () => {
    const blog = (await Blog.find({ title: blogs[1].title }))[0]

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blog._id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blog.likes + 1)
    assert.strictEqual(response.body.title, blog.title)
    assert.strictEqual(response.body.author, blog.author)
    assert.strictEqual(response.body.url, blog.url)
  })

  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      await User.create({ username: 'root', passwordHash })
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
    test('creation fails with duplicate username', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'root',
        name: 'Duplicate Root',
        password: 'salainen'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error)

      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('creation fails if password is missing', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'testuser',
        name: 'Test User'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error)

      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('creation fails if username is missing', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        name: 'Test User',
        password: 'salainen'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error)

      const usersAtEnd = await usersInDb()

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('creation fails with too short username', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'ab',
        name: 'Test User',
        password: 'salainen'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error)

      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('creation fails with too short password', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'ab'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error)

      const usersAtEnd = await usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})

