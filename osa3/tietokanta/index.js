import 'dotenv/config'
import express from 'express'
import errorHandler from './middleware/errorHandler.js'
import connectDB from './config/db.js'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/Person.js'
import personsRouter from './routes/persons.js'

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.static('dist'))
connectDB()

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)


app.use(cors())

app.use(express.json())

app.use('/api/persons', personsRouter)

app.get('/info', async (request, response) => {
  const count = await Person.countDocuments({})
  response.send(`<p>Phonebook has info for ${count} people.</p><p>${new Date()}</p>`)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use(errorHandler)