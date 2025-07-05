import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Brak uwierzytelnienia' },
        { status: 401 }
      );
    }

    // Verify the token and get user data
    const userData = verifyToken(token);
    if (!userData || !userData.id) {
      return NextResponse.json(
        { error: 'Nieprawidłowy token uwierzytelniający' },
        { status: 401 }
      );
    }

    console.log('Processing premium update for user:', userData.id);

    // Get request body
    let body;
    try {
      body = await request.json();
      console.log('Received request body:', body);
    } catch (err) {
      console.error('Failed to parse request body:', err);
      return NextResponse.json(
        { error: 'Nieprawidłowe dane żądania' },
        { status: 400 }
      );
    }
    
    const { plan } = body;

    if (!plan || !['monthly', 'yearly', 'lifetime'].includes(plan)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy plan subskrypcji' },
        { status: 400 }
      );
    }

    // Check if user exists
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { id: userData.id },
      });
      
      if (!existingUser) {
        console.error('User not found:', userData.id);
        return NextResponse.json(
          { error: 'Nie znaleziono użytkownika' },
          { status: 404 }
        );
      }
    } catch (err) {
      console.error('Error checking user existence:', err);
      return NextResponse.json(
        { error: `Błąd podczas weryfikacji użytkownika: ${err.message}` },
        { status: 500 }
      );
    }

    // Calculate expiry date
    const expiryDate = calculateExpiryDate(plan);
    console.log('Calculated expiry date:', expiryDate);

    // Update user with premium status
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userData.id },
        data: {
          hasPremium: true,
          premiumPlan: plan,
          premiumExpiry: expiryDate,
          isPremium: true // For backwards compatibility
        },
        select: {
          id: true,
          email: true,
          name: true,
          hasPremium: true,
          premiumPlan: true,
          premiumExpiry: true
        }
      });
      
      console.log('User updated successfully:', updatedUser.id);

      return NextResponse.json({
        message: 'Status premium zaktualizowany',
        user: updatedUser
      });
    } catch (error) {
      console.error('Prisma error updating user:', error);
      return NextResponse.json(
        { error: `Błąd bazy danych podczas aktualizacji statusu premium: ${error.message}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Premium update error:', error);
    return NextResponse.json(
      { error: `Wystąpił błąd podczas aktualizacji statusu premium: ${error.message || 'Nieznany błąd'}` },
      { status: 500 }
    );
  }
}

/**
 * Calculate expiry date based on premium plan
 */
function calculateExpiryDate(plan) {
  const now = new Date();
  
  switch (plan) {
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    case 'yearly':
      return new Date(now.setFullYear(now.getFullYear() + 1));
    case 'lifetime':
      // Set to a far future date (e.g., 100 years)
      return new Date(now.setFullYear(now.getFullYear() + 100));
    default:
      return null;
  }
} 