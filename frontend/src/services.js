import axios from 'axios'

const baseURL = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
})

const getTodos = async () => await baseURL.get('/')
const createTodo = async (data) => await baseURL.post('/', data)
const updateTodo = async (id, data) => await baseURL.put(`/${id}`, data)
const deleteTodo = async (id) => await baseURL.delete(`/${id}`)

export { getTodos, createTodo, updateTodo, deleteTodo }
