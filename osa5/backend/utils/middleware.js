import { info, error as logError } from './logger.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config.js'

export const requestLogger = (request, response, next) => {
  info('Method:', request.method)
  info('Path:  ', request.path)
  info('Body:  ', request.body)
  info('---')
  next()
}

export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

export const errorHandler = (error, request, response, next) => {
  logError(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

//4.20
export const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}
// 4.22
export const userExtractor = async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({
        error: 'token invalid'
      })
    }

    const decodedToken = jwt.verify(request.token, JWT_SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({
        error: 'token invalid'
      })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({
        error: 'token invalid'
      })
    }

    request.user = user

    return next()
  } catch (error) {
    return next(error)
  }
}