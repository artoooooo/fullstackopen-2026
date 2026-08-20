import express from 'express'
import blogRoutes from './routes/blogs.js'
import userRoutes from './routes/users.js'
import loginRouter from './routes/login.js'
import { requestLogger, errorHandler, tokenExtractor, unknownEndpoint } from './utils/middleware.js'
const app = express()
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', userRoutes)
app.use('/api/blogs', blogRoutes)

app.use(unknownEndpoint)
app.use(errorHandler)
export default app