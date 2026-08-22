import Notification from './Notification'
import Blog from './Blog'
import { Link } from 'react-router-dom'
import { List, ListItem, Typography } from '@mui/material'

const Blogs = ({ blogs }) => (
  <div>
    <Typography variant="h2" component="h2">blogs</Typography>
    <List>
      {blogs.map((blog) => <ListItem key={`li-${blog.id}`}><Typography><Link key={`link-${blog.id}`} to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link></Typography></ListItem>)}
    </List>
  </div>
)

export default Blogs