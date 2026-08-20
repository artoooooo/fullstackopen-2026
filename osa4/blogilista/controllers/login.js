import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/user.js'
import { JWT_SECRET } from '../utils/config.js'

export const login = async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user && password
      ? await bcrypt.compare(password, user.passwordHash)
      : false

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: 60*60 })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
}