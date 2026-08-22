import { useState, useEffect  } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import NewFrom from './components/NewForm'
import { getUser as getCachedUser, invalidateUser } from './services/user'
import Notification from './components/Notification'
import Blogs from './components/Blogs'
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import {
  Routes, Route, Link,
  useNavigate
} from 'react-router-dom'

const padding = {
  padding: 5
}
const initUser = getCachedUser()
const App = () => {
  const navi = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(initUser)

  const createBlog = async (form) => {
    try {
      const blog = await blogService.create(form)
      setBlogs(prev => [...prev, blog])
      addNotification(`a new blog ${blog.title} by ${blog.author} added`)
      return blog
    }catch(error){
      addNotification(error.message, 'error')
      throw error
    }
  }
  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteBlog(blog.id)
      setBlogs(prev => prev.filter(x => x.id !== blog.id))
      addNotification(`blog ${blog.title} by ${blog.author} was deleted`)
    } catch(error) {
      addNotification(error.response?.data?.error?? error.message, 'error')
      throw error
    }
  }

  const likeBlog = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }

    try {
      const updatedBlog = await blogService.update(blog.id, likedBlog)
      setBlogs(prev => [...prev.filter(x => x.id !== updatedBlog.id), updatedBlog].toSorted((a,b) => b.likes - a.likes))
      addNotification(`The user liked the blog ${blog.title} by ${blog.author}`)
    } catch (error) {
      addNotification(error.message, 'error')
      throw error
    }
  }
  const addNotification = (message, severity = 'success') => {
    const id = Date.now()

    setNotifications(prev => [
      ...prev,
      { id, message, severity }
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

  const handleLogin =  async () => {
    try {
      const user = await loginService.login({ username, password })
      if(user.error) {
        throw new Error(user.error)
      }
      setUsername('')
      setPassword('')
      setUser(user)
      addNotification('🎉 Login successful! Welcome back!')
      return user
    } catch(error){
      addNotification(error.message, 'error')
      throw error
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: 'inherit',
              }}
            >
              <Link style={padding} to="/">blogs</Link>
            </Typography>
            <Typography><Link style={padding} to="/create">new note</Link></Typography>
            {user ? <Button onClick={() => {
              setUser(null)
              invalidateUser()
              addNotification('User logged out')
              navi('/', { replace: true })
            }}>logout</Button> :<Typography><Link style={padding} to="/login">login</Link></Typography>}

          </Toolbar>
        </AppBar>
      </Box>
      <>
        {notifications.map(({ message, severity, id }) => <Notification key={id} message={message} severity={severity}/>)}
      </>
      <Routes>
        <Route path="/blogs/:id" element={
          <Blog blogs={blogs} user={user} onLike={likeBlog} deleteBlog={deleteBlog}/>
        } />
        <Route path="/login" element={
          <Login
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
            user={user}
          />
        } />
        <Route path="/create" element={
          <NewFrom createBlog={createBlog} user={user} />
        }/>
        <Route path="/" element={
          <Blogs blogs={blogs}/>
        } />
      </Routes>
    </>
  )
}

export default App