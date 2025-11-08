import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&w=majority"

if (!MONGODB_URI) {
  throw new Error('Invalid/missing environment variable: "MONGODB_URI"')
}

let cachedClient: MongoClient | null = null

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    cachedClient = client
    console.log("Connected to MongoDB")
    return client
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export async function getDatabase() {
  const client = await connectToDatabase()
  return client.db("vibe_commerce")
}
