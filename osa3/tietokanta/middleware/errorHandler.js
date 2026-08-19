const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log(error)
  if(error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

export default errorHandler