import Person from '../../models/Person.js'
import { toOut } from './helpers.js'


export const getPerson = async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)

    if (person) {
      response.json(toOut(person))
    } else {
      response.status(404).json({
        error: 'person not found',
      })
    }
  } catch (error) {
    next(error)
  }
}