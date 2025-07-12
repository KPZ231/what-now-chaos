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
  
  // Create a payload with essential user data
  const payload = { 
    id: user.id,
    email: user.email,
    isPremium: user.isPremium || false,
    hasPremium: user.hasPremium || false
  };
  
  console.log('Generating token with payload:', JSON.stringify(payload));
  
  const token = jwt.sign(
    payload,
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
  
  if (!token || token.trim() === '') {
    console.log('Empty token provided for verification');
    return null;
  }
  
  try {
    console.log('Verifying token:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, secretKey)
    console.log('Token verified successfully for user:', decoded.id);
    return decoded
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.error('Invalid token:', error.message);
    } else {
      console.error('Token verification error:', error.message);
    }
    return null
  }
} 