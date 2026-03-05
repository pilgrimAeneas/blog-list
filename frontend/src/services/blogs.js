import axios from "axios"
const baseUrl = "/api/blogs"
let token = null

const setToken = newToken => {
  token = newToken
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async blogObject => {
  const response = await axios.post(
    baseUrl, blogObject, { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export default { getAll, create, setToken }