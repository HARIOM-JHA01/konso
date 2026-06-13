import mongoose, { Schema, model, models } from 'mongoose'

export interface ITodo {
  _id: string
  text: string
  completed: boolean
  order: number
  createdAt: string
  updatedAt: string
}

const TodoSchema = new Schema<ITodo>(
  {
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Todo = models.Todo ?? model<ITodo>('Todo', TodoSchema)
