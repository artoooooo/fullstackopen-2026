import Person from '../../models/Person.js'
import { toOut } from './helpers.js'

export const updatePerson = async (request, response, next) => {
  try {
    const id = request.params.id
    const { name, number } = request.body
    console.log(id, name, number)
    if (!name || !number) {
      return response.status(400).json({
        error: 'name or number missing',
      })
    }

    const person = await Person.findByIdAndUpdate(
      id,
      { $set: toOut(request.body) },
      {  returnDocument: 'after', runValidators: true }
    )
    return response.status(200).json(toOut(person))
  } catch (error) {
    next(error)
  }
}