import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Todo } from '@/models/Todo'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  const updates = await req.json()
  const todo = await Todo.findByIdAndUpdate(id, updates, { new: true })
  if (!todo) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(todo)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  await Todo.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
