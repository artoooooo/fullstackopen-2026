import express from 'express'
import { create, getAll } from '../controllers/users.js'

const router = express.Router()

router
  .post('/', create)
  .get('/', getAll)


export default router