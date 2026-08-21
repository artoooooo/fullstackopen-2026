import { useState  } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const BlogInformation = ({ blog, visible, updateBlog, deleteBlog, user }) => {
  if(!visible) {
    return <></>
  }

  const handleSubmit = async () => {
    const { likes } = blog
    await updateBlog({ ...blog, likes: likes + 1 })
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  const deleteButton = blog.user && (user.id === blog.user.id) ? <><button onClick={handleDelete}>delete</button></> : <></>

  return (
    <div>
      <a href={blog.url}>{blog.url}</a><><span>likes {blog.likes}</span> <button onClick={handleSubmit}>like</button></><span>{blog?.user?.name ?? 'Added by name is missing.'}</span>
      {deleteButton}
    </div>
  )
}
const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setVisible(prev => !prev)}>{visible ? 'hide': 'show'}</button>
      <BlogInformation blog={blog} visible={visible} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />
    </div>
  )
}
export default Blog