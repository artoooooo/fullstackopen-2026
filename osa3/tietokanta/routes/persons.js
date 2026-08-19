import express from 'express'
import {
  getPersons,
  getPerson,
  updatePerson,
  deletePerson,
  createPerson,
} from '../controllers/personsController/index.js'

const router = express.Router()

router.get('/', getPersons)
router.get('/:id', getPerson)
router.put('/:id', updatePerson)
router.delete('/:id', deletePerson)
router.post('/', createPerson)

export default router