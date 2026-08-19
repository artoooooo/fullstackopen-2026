import express from "express";
import morgan from "morgan";
import cors from "cors"
const PORT = process.env.PORT || 3001

const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);


app.use(cors())
const persons = [
    { id: "1", name: 'Arto Hellas', number: '040-123456' },
    { id: "2", name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: "3", name: 'Dan Abramov', number: '12-43-234345' },
    { id: "4", name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]

app.use(express.json());

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    console.debug(request.params, request.params.id)
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(person) {
    response.json(person)
  } else {
     response.status(404).send({ id: id, error: 'not found' })
  }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const index = persons.findIndex(x => x.id == id);

    if (index > -1) {
        persons.splice(index, 1);
        response.status(204).end()
    } else {
        response.status(404).send({ id: id, error: 'not found' })
    }
})
const createNewId = () => {
    const ids = new Set(persons.map(x => x.id))
    while(true) {
        const id = Math.floor(Math.random() * 2_147_483_647);
        if(!ids.has(id)) {
            return id
        }
    }
}
app.post('/api/persons', (request, response) => {
    const {name, number} = request.body
    
    if (!name || !number) {
        return response.status(400).json({error: 'name or number missing'})
    }

    if (persons.some(person => person.name === name)) {
        return response.status(400).json({ error: 'name must be unique'})
    }
    const p = {
        name,
        number,
        id: createNewId()
    }

    persons.push(p)
    response.status(201).json(p)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})