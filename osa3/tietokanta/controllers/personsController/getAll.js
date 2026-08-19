import Person from '../../models/Person.js'
import { toOut } from './helpers.js'

export const getPersons = async (request, response, next) => {
  try {
    const persons = await Person.find({})
    response.json(persons.map(toOut))
  } catch (error) {
    next(error)
  }
}