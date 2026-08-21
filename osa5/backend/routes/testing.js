import express from 'express'
import { reset } from '../controllers/testing.js'

const router = express.Router()

router
  .post('/reset', reset)

export default router