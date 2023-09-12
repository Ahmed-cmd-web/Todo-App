const { model } = require('mongoose')
const { todoSchema } = require('../schemas/todoSchema')
const todoModel = model('Todo', todoSchema)

module.exports = todoModel
