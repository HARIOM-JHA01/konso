import { Schema, model, models } from 'mongoose'

export interface ICalendarEvent {
  _id: string
  title: string
  date: string   // YYYY-MM-DD
  note?: string
  createdAt: string
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
  {
    title: { type: String, required: true, trim: true },
    date:  { type: String, required: true, index: true },
    note:  { type: String, default: '' },
  },
  { timestamps: true }
)

export const CalendarEvent =
  models.CalendarEvent ?? model<ICalendarEvent>('CalendarEvent', CalendarEventSchema)
