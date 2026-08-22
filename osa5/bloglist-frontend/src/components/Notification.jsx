
import { Alert, Typography } from '@mui/material'

const Notification  = ({ message, severity='success' }) => (
  <Alert severity={severity}>
    <Typography>{message}</Typography>
  </Alert>
)

export default Notification