import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { CalendarEvent } from '@/models/CalendarEvent'

// GET /api/events?month=YYYY-MM
export async function GET(req: Request) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') // e.g. "2026-06"
  const filter = month ? { date: { $regex: `^${month}` } } : {}
  const events = await CalendarEvent.find(filter).sort({ date: 1 }).lean()
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  await connectDB()
  const { title, date, note } = await req.json()
  if (!title?.trim() || !date) {
    return NextResponse.json({ error: 'title and date required' }, { status: 400 })
  }
  const event = await CalendarEvent.create({ title: title.trim(), date, note })
  return NextResponse.json(event, { status: 201 })
}
