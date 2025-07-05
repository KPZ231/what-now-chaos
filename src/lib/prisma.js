import { PrismaClient } from '../generated/prisma'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

let prisma

if (process.env.NODE_ENV === 'production') {
  try {
    prisma = new PrismaClient()
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