import Person from '../../models/Person.js'
import { toOut } from './helpers.js'

export const createPerson = async (request, response, next) => {
  try {
    const { name, number } = request.body

    if (!name || !number) {
      return response.status(400).json({
        error: 'name or number missing',
      })
    }

    const person = await Person.findOne({ name })

    if (person) {
      return response.status(400).json({
        error: 'name must be unique',
      })
    }

    const newPerson = await Person.create({
      name,
      number,
    })

    response.status(201).json(toOut(newPerson))
  } catch (error) {
    next(error)
  }
}