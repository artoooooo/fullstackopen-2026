import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../utils/config.js'
import User from '../models/user.js'

export const create = async (request, response) => {
  const { username, name, password } = request.body


  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
}

export const getAll =  async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
}