import { NextResponse } from 'next/server';
import { POST } from '../../app/api/user/premium/decrement-trial/route';

// Mock dependencies
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options }))
  }
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn()
}));

describe('Decrement Trial API', () => {
  let mockRequest;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock request object
    mockRequest = {};
    
    // Default mock implementations
    const { getSession } = require('@/lib/auth');
    getSession.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' }
    });
    
    const { prisma } = require('@/lib/prisma');
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      hasPremium: false,
      freeTrialGamesLeft: 3
    });
    
    prisma.user.update.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      hasPremium: false,
      freeTrialGamesLeft: 2
    });
  });
  
  test('should return 401 if user is not authenticated', async () => {
    // Mock unauthenticated user
    const { getSession } = require('@/lib/auth');
    getSession.mockResolvedValue(null);
    
    const response = await POST(mockRequest);
    
    expect(response.options.status).toBe(401);
    expect(response.data.error).toBe('Unauthorized');
  });
  
  test('should return 404 if user is not found', async () => {
    // Mock user not found
    const { prisma } = require('@/lib/prisma');
    prisma.user.findUnique.mockResolvedValue(null);
    
    const response = await POST(mockRequest);
    
    expect(response.options.status).toBe(404);
    expect(response.data.error).toBe('User not found');
  });
  
  test('should not decrement if user already has premium', async () => {
    // Mock user with premium
    const { prisma } = require('@/lib/prisma');
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      hasPremium: true,
      freeTrialGamesLeft: 3
    });
    
    const response = await POST(mockRequest);
    
    // Should not update user
    expect(prisma.user.update).not.toHaveBeenCalled();
    
    // Should return success message
    expect(response.options.status).toBe(200);
    expect(response.data.message).toBe('User has premium, no trial to decrement');
  });
  
  test('should not decrement if user has no free trials left', async () => {
    // Mock user with no free trials
    const { prisma } = require('@/lib/prisma');
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      hasPremium: false,
      freeTrialGamesLeft: 0
    });
    
    const response = await POST(mockRequest);
    
    // Should not update user
    expect(prisma.user.update).not.toHaveBeenCalled();
    
    // Should return success message
    expect(response.options.status).toBe(200);
    expect(response.data.message).toBe('No free trials left to decrement');
  });
  
  test('should successfully decrement free trial count', async () => {
    const response = await POST(mockRequest);
    
    const { prisma } = require('@/lib/prisma');
    
    // Should update user correctly
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { freeTrialGamesLeft: 2 }
    });
    
    // Should return updated count
    expect(response.options.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.freeTrialGamesLeft).toBe(2);
  });
  
  test('should handle errors gracefully', async () => {
    // Mock database error
    const { prisma } = require('@/lib/prisma');
    prisma.user.findUnique.mockRejectedValue(new Error('Database error'));
    
    const response = await POST(mockRequest);
    
    expect(response.options.status).toBe(500);
    expect(response.data.error).toBe('Wystąpił błąd podczas aktualizacji darmowych gier');
  });
}); 