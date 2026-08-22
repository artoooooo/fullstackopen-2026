
import {
  useNavigate
} from 'react-router-dom'
import {  useEffect } from 'react'
import { TextField, Button, Box } from '@mui/material'

const Login = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
  user
}) => {
  const naavigate = useNavigate()


  useEffect(() => {
    if (user) {
      naavigate('/')
    }
  }, [user, naavigate])

  const handleFromSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await handleLogin(event)
      if(user) {
        naavigate('/')
      }
    } catch (error) {
      console.error(error.message)
    }

  }
  return (
    <div>
      <h2>Log in to application</h2>


      <form onSubmit={handleFromSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            fullWidth
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            fullWidth
          />
        </Box>

        <Button type="submit" variant="contained">
          Login
        </Button>
      </form>
    </div>
  )
}

export default Login