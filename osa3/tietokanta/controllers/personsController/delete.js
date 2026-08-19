import Person from '../../models/Person.js'
import { toOut } from './helpers.js'

export const deletePerson = async (request, response, next) => {
  try {
    const person = await Person.findByIdAndDelete(request.params.id)

    if (!person) {
      return response.status(404).json({
        message: 'Person not found',
      })
    }

    response.status(204).json(toOut(person)).end()
  } catch (error) {
    next(error)
  }
}