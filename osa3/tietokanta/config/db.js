import mongoose from 'mongoose'

const username = process.env.MONGODB_USERNAME
//const cluster = process.env.MONGODB_CLUSTER
//const database = process.env.MONGODB_DATABASE

console.log('username', username)

export const connectDB = async () => {
  const password = process.env.MONGODB_PASSWORD
  return await connectDbWithPassword(password)
}

export const connectDbWithPassword = async (password) => {
  const strictQuery = `mongodb+srv://${username}:${password}@cluster0.fyhrtq4.mongodb.net/?appName=Cluster0`
  const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } }
  try {
    await mongoose.connect(strictQuery, clientOptions)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
