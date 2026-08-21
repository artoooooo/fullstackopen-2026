export const setUser = user => {
  window.localStorage.setItem('user_token', user.token)
  window.localStorage.setItem('user_name', user.name)
  window.localStorage.setItem('user_username', user.username)
  window.localStorage.setItem('user_id', user.id)
}

export const getUser = () => {
  const token = window.localStorage.getItem('user_token')
  if(!token) {
    return null
  }
  return {
    token,
    id: window.localStorage.getItem('user_id'),
    name: window.localStorage.getItem('user_name'),
    username: window.localStorage.getItem('user_username'),
  }
}

export const invalidateUser = () => {
  window.localStorage.removeItem('user_token')
  window.localStorage.removeItem('user_name')
  window.localStorage.removeItem('user_username')
  window.localStorage.removeItem('user_id')
}