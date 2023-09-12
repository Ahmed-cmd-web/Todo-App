const { Schema } = require('mongoose')
const Joi = require('joi')

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: [6, 'Title too short.'],
    },
    description: {
      type: String,
      required: true,
      min: [6, 'Description too short.'],
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => new Date(v).getTime() > Date.now() + 1e5,
        message: (_) => `Due date should be after now`,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'done'],
      required: true,
    },
    isLate: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'creationDate',
    },
  }
)

const joiTodoSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().min(2).required(),
  dueDate: Joi.date().required(),
  status: Joi.string().valid('pending', 'done').required(),
})

todoSchema.pre('save', function (next) {
  this.set({
    isLate:
      new Date(this.get('dueDate')).getTime() < Date.now() &&
      this.get('status') == 'pending',
  })
  next()
})

module.exports = { todoSchema, joiTodoSchema }
