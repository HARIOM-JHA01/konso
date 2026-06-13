import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Todo } from '@/models/Todo'

export async function GET() {
  await connectDB()
  const todos = await Todo.find().sort({ order: 1, createdAt: 1 }).lean()
  return NextResponse.json(todos)
}

export async function POST(req: Request) {
  await connectDB()
  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'text required' }, { status: 400 })
  const count = await Todo.countDocuments()
  const todo = await Todo.create({ text: text.trim(), order: count })
  return NextResponse.json(todo, { status: 201 })
}
