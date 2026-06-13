import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined')

// Reuse connection across hot reloads in dev
const globalWithMongoose = global as typeof global & {
  _mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const cache = globalWithMongoose._mongooseCache ?? { conn: null, promise: null }
globalWithMongoose._mongooseCache = cache

export async function connectDB() {
  if (cache.conn) return cache.conn
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then((m) => m)
  }
  cache.conn = await cache.promise
  return cache.conn
}
