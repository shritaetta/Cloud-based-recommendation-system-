export const saveToken  = (token) => localStorage.setItem('token', token)
export const getToken   = ()      => localStorage.getItem('token')
export const removeToken= ()      => localStorage.removeItem('token')
export const getPayload = ()      => {
  const token = getToken()
  if (!token) return null
  try {
    const base64 = token.split('.')[1]
    return JSON.parse(atob(base64))
  } catch { return null }
}
export const isLoggedIn = () => !!getToken()
