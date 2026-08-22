import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography  } from '@mui/material'

const emptyNewForm = () => ({ title: '', author: '', url: '' })

const NewForm = ({ user,createBlog }) => {
  const [form, setForm] = useState(emptyNewForm())
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await createBlog(form)
      setForm(emptyNewForm())
      navigate('/')
    } catch {
      //empty
    }
  }
  return (
    <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5em', flexDirection:'column' }}>
      <Typography variant='h2' component="h2">create new</Typography>
      <form onSubmit={handleSubmit}   style={{ display: 'flex', alignItems: 'center', gap: '0.5em', flexDirection:'column' }}>
        <div>
          <TextField
            label="title"
            type='text'
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <TextField
            label="author"
            type="text"
            id="author"
            name="author"
            value={form.author}
            onChange={handleChange}
          />
        </div>

        <div>
          <TextField
            label="url"
            type="text"
            id="url"
            name="url"
            value={form.url}
            onChange={handleChange}
          />
        </div>

        <Button type="submit">create</Button>
      </form>
    </Box>
  )
}

export default NewForm