const { Router } = require('express')
const todo = require('../models/todoModel')
const { joiTodoSchema } = require('../schemas/todoSchema')
const Todo = require('../models/todoModel')
const server = Router()

server.get('/', async (_, res) => {
  const data = await todo.find({})
  res.send(data).status(200)
})

server.post('/', async (req, res) => {
  try {
    await joiTodoSchema.validateAsync(req.body, { abortEarly: false })
    const todoInstance = new Todo(req.body)
    await todoInstance.save()
    return res.status(201).send()
  } catch (error) {
    return res.status(400).send(error.message)
  }
})

server.put('/:id', async (req, res) => {
  try {
    for (const field in req.body)
      await joiTodoSchema.extract(field).validateAsync(req.body[field])
    let todoInstance = await Todo.findById(req.params.id)
    if (!todoInstance) return res.status(404).send('No task with the given Id.')
    Object.assign(todoInstance, req.body)
    todoInstance = await todoInstance.save()
    return res.status(201).send(todoInstance)
  } catch (error) {
    return res.status(400).send(error?.message)
  }
})

server.delete('/:id', async (req, res) => {
  try {
    const todoInstance = await Todo.findByIdAndDelete(req.params.id)
    if (!todoInstance) return res.status(404).send('No task with the given Id.')
    res.send(todoInstance)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = server
