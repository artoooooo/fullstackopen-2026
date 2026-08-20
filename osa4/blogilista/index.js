import { PORT, MONGO_URL } from './utils/config.js'
import app from './app.js'
import mongoose from 'mongoose'

import { info, error as logError } from './utils/logger.js'

mongoose.connect(MONGO_URL, { family: 4 })
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    logError('error connection to MongoDB:', error.message)
  })

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})