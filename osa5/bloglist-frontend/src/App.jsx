import { useState, useEffect, useRef  } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import NewFrom from './components/NewForm'
import { getUser as getCachedUser, invalidateUser } from './services/user'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const initUser = getCachedUser()

const App = () => {
  const [notifications, setNotifications] = useState([])
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(initUser)
  const formRef = useRef()

  const createBlog = async (form) => {
    try {
      const blog = await blogService.create(form)

      formRef.current.toggleVisibility()

      setBlogs(prev => [...prev, blog].toSorted((a, b) => b.likes - a.likes))

      addNotification(`a new blog ${blog.title} by ${blog.author} added`)

      return blog
    } catch (error) {
      addNotification(error.message, 'red')
      throw error
    }
  }
  const deleteBlog = (blog) => {
    return blogService.deleteBlog(blog.id)
      .then(() => setBlogs(prev => prev.filter(x => x.id !== blog.id)))
      .then(() => addNotification(`blog ${blog.title} by ${blog.author} was deleted`))
      .catch(error => {
        addNotification(error.response?.data?.error?? error.message, 'red')
      })
  }
  const updateBlog = (blog) => {
      const blogToUpdate = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: blog.user.id
      }

    return blogService.update(blog.id, blogToUpdate)
      .then(updatedBlog => {
        const blogWithUser = {
          ...updatedBlog,
          user: blog.user
        }
        setBlogs(prev => [...prev.filter(x => x.id !== blogWithUser.id), blogWithUser].toSorted((a,b) => b.likes - a.likes))
        return blogWithUser
      } )
      .then(blog => {
        addNotification(`you liked the blog "${blog.title}" by ${blog.author}`)
      })
      .catch(error => {
        addNotification(error.message, 'red')
      })
  }
  const addNotification = (message, color = 'green') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`

    setNotifications(prev => [
      ...prev,
      { id, message, color }
    ])

    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      )
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(bs =>
      setBlogs( bs.toSorted((a,b) => b.likes - a.likes) )
    )
  }, [])

  const handleLogin =  async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUsername('')
      setPassword('')
      setUser(user)
    } catch(error){
      console.log('catch')
      addNotification(error.message, 'red')
    }
  }

  if (user === null) {
    return (
      <>
        <>
          {notifications.map(({ message, color, id }) => <Notification key={id} message={message} color={color}/>)}
        </>
        <>
          <Login
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </>
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <>
        {notifications.map(({ message, color,id }) => <Notification key={id} message={message} color={color}/>)}
      </>
      <>
        <p>{user.name} logged in <button onClick={() => {invalidateUser(); setUser(null); addNotification('User logged out') } }>logout</button></p>
      </>
      <>
        <Togglable buttonLabel='create new blog' ref={formRef}>
          <NewFrom createBlog={createBlog} />
        </Togglable>
      </>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
      )}
    </div>
  )
}

export default App