import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { CalendarEvent } from '@/models/CalendarEvent'

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  await CalendarEvent.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
