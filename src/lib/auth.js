import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export async function hashPassword(password) {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword)
  return isValid
}

export function generateToken(user) {
  const secretKey = process.env.JWT_TOKEN
  
  if (!secretKey) {
    console.error('JWT_TOKEN is not defined in environment variables')
    throw new Error('JWT_TOKEN is not defined in environment variables')
  }
  
  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
      hasPremium: user.hasPremium
    },
    secretKey,
    { expiresIn: '7d' }
  )
  
  return token
}

export function verifyToken(token) {
  const secretKey = process.env.JWT_TOKEN
  
  if (!secretKey) {
    console.error('JWT_TOKEN is not defined in environment variables')
    throw new Error('JWT_TOKEN is not defined in environment variables')
  }
  
  try {
    const decoded = jwt.verify(token, secretKey)
    return decoded
  } catch (error) {
    console.error('Token verification error:', error.message)
    return null
  }
} 