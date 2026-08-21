import express from 'express'
import blogRoutes from './routes/blogs.js'
import userRoutes from './routes/users.js'
import loginRouter from './routes/login.js'
import testingRouter from './routes/testing.js'
import { requestLogger, errorHandler, tokenExtractor, unknownEndpoint } from './utils/middleware.js'
import { IS_TEST_ENV } from './utils/config.js'

const app = express()

app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', userRoutes)
app.use('/api/blogs', blogRoutes)
console.log(IS_TEST_ENV)
if(IS_TEST_ENV) {
    console.warn("The /api/testing API is now active in the test environment.");
    app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)
export default app