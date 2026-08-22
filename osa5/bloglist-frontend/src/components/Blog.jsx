import { useParams, useNavigate } from 'react-router-dom'
import { Button, Typography, IconButton, Link } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  marginBottom: 5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}

const Blog = ({ blogs, user, onLike, deleteBlog }) => {
  const id = useParams().id
  const blog = blogs.find(x => x.id === id)
  const navigate = useNavigate()
  if (!blog) {
    return null
  }


  const handleLiking = async () => {
    return await onLike(blog)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
      navigate('/')
    }
  }
  const deleteButton = blog?.user && (user?.id === blog.user?.id) ? <><IconButton aria-label="delete" onClick={handleDelete}><DeleteIcon /></IconButton></> : <></>

  return (
    <div style={blogStyle}>
      <Typography variant='h2' component="h2">{blog.author}: {blog.title}</Typography>
      <Typography component='a' href={blog.url.startsWith('http') ? blog.url : `https://${blog.url}`}>{blog.url}</Typography >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Typography>likes {blog.likes}</Typography>
        {user && <IconButton aria-label="like" onClick={handleLiking}><ThumbUpIcon /></IconButton>}
      </div>
      <Typography>Added by {blog?.user?.name ?? 'Nobody'}.</Typography>
      {deleteButton}
    </div>
  )
}
export default Blog