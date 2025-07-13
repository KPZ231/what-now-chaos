import { NextResponse } from 'next/server';
import { POST } from '../../app/api/user/premium/route';

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
  verifyToken: jest.fn()
}));

describe('Premium API', () => {
  let mockRequest;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock request object
    mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: 'valid-token' })
      },
      json: jest.fn()
    };
    
    // Default mock implementations
    const { verifyToken } = require('@/lib/auth');
    verifyToken.mockReturnValue({ id: 'user-123', email: 'test@example.com' });
    
    const { prisma } = require('@/lib/prisma');
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      hasPremium: false
    });
    
    prisma.user.update.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      hasPremium: true,
      premiumPlan: 'monthly',
      premiumExpiry: new Date()
    });
  });
  
  test('should return 401 if no auth token is provided', async () => {
    // Mock missing token
    mockRequest.cookies.get.mockReturnValue(undefined);
    
    const response = await POST(mockRequest);
    
    expect(response.options.status).toBe(401);
    expect(response.data.error).toBe('Brak uwierzytelnienia');
  });
  
  test('should return 401 if token is invalid', async () => {
    // Mock invalid token verification
    const { verifyToken } = require('@/lib/auth');
    verifyToken.mockReturnValue(null);
    
    const response = await POST(mockRequest);
    
    expect(response.options.status).toBe(401);
    expect(response.data.error).toBe('Nieprawidłowy token uwierzytelniający');
  });
  
  test('should return 400 if plan is missing or invalid', async () => {
    // Mock request body with invalid plan
    mockRequest.json.mockResolvedValue({ plan: 'invalid-plan' });
    
    const response = await POST(mockRequest);
    
    expect(response.options.status).toBe(400);
    expect(response.data.error).toBe('Nieprawidłowy plan subskrypcji');
  });
  
  test('should return 404 if user is not found', async () => {
    // Mock request body
    mockRequest.json.mockResolvedValue({ plan: 'monthly' });
    
    // Mock user not found
    const { prisma } = require('@/lib/prisma');
    prisma.user.findUnique.mockResolvedValue(null);
    
    const response = await POST(mockRequest);
    
    expect(response.options.status).toBe(404);
    expect(response.data.error).toBe('Nie znaleziono użytkownika');
  });
  
  test('should update user with monthly premium plan', async () => {
    // Mock request body
    mockRequest.json.mockResolvedValue({ plan: 'monthly' });
    
    const response = await POST(mockRequest);
    
    // Check response
    expect(response.data.message).toBe('Status premium zaktualizowany');
    expect(response.data.user.hasPremium).toBe(true);
    expect(response.data.user.premiumPlan).toBe('monthly');
    
    // Check that user was updated correctly
    const { prisma } = require('@/lib/prisma');
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          hasPremium: true,
          premiumPlan: 'monthly',
          premiumExpiry: expect.any(Date)
        })
      })
    );
  });
  
  test('should update user with yearly premium plan', async () => {
    // Mock request body
    mockRequest.json.mockResolvedValue({ plan: 'yearly' });
    
    const response = await POST(mockRequest);
    
    // Check response
    expect(response.data.message).toBe('Status premium zaktualizowany');
    expect(response.data.user.hasPremium).toBe(true);
    
    // Check that user was updated correctly
    const { prisma } = require('@/lib/prisma');
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          hasPremium: true,
          premiumPlan: 'yearly',
          premiumExpiry: expect.any(Date)
        })
      })
    );
  });
  
  test('should update user with lifetime premium plan', async () => {
    // Mock request body
    mockRequest.json.mockResolvedValue({ plan: 'lifetime' });
    
    const response = await POST(mockRequest);
    
    // Check response
    expect(response.data.message).toBe('Status premium zaktualizowany');
    expect(response.data.user.hasPremium).toBe(true);
    
    // Check that user was updated correctly
    const { prisma } = require('@/lib/prisma');
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          hasPremium: true,
          premiumPlan: 'lifetime',
          premiumExpiry: expect.any(Date)
        })
      })
    );
  });
  
  test('should handle database errors', async () => {
    // Mock request body
    mockRequest.json.mockResolvedValue({ plan: 'monthly' });
    
    // Mock database error
    const { prisma } = require('@/lib/prisma');
    prisma.user.update.mockRejectedValue(new Error('Database connection error'));
    
    const response = await POST(mockRequest);
    
    expect(response.options.status).toBe(500);
    expect(response.data.error).toContain('Błąd bazy danych');
  });
}); 