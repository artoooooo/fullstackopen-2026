import axios from 'axios'
import { getUser } from './user'

const baseUrl = '/api/blogs'

const authorizationHeader = () => ({
  headers: { Authorization: `Bearer ${getUser().token}` }
})

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = authorizationHeader()

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteBlog = (id) => {
  const config = authorizationHeader()

  const request = axios.delete(`${ baseUrl }/${id}`, config)
  return request.then(response => response.data)
}

export default { getAll, create, update, deleteBlog }