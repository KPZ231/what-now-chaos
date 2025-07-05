import { PrismaClient } from '../generated/prisma'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

let prisma

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1'

if (process.env.NODE_ENV === 'production') {
  try {
    prisma = new PrismaClient()
    
    // Add a ping to test the connection
    if (isVercel) {
      prisma.$connect()
        .then(() => console.log('Successfully connected to the database'))
        .catch((e) => {
          console.error('Failed to connect to the database:', e)
          throw e
        })
    }
  } catch (error) {
    console.error('Failed to initialize Prisma client in production:', error)
    throw error
  }
} else {
  if (!global.prisma) {
    try {
      global.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      })
    } catch (error) {
      console.error('Failed to initialize Prisma client in development:', error)
      throw error
    }
  }
  prisma = global.prisma
}

export { prisma } 