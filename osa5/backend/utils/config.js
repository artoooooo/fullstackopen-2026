import 'dotenv/config'
export const IS_TEST_ENV = process.env.NODE_ENV === 'test'
export const SALT_ROUNDS = 10
export const PORT = process.env.PORT || 3003
export const JWT_SECRET = process.env.JWT_SECRET
export const MONGO_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI