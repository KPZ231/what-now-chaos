import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key');

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

    // Get session ID from request
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Brak identyfikatora sesji' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe to confirm payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session was paid
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Płatność nie została zakończona' },
        { status: 400 }
      );
    }

    // Verify the user in metadata matches the authenticated user
    if (session.metadata.userId !== userData.id) {
      return NextResponse.json(
        { error: 'Identyfikator użytkownika nie zgadza się' },
        { status: 403 }
      );
    }

    const plan = session.metadata.plan;
    const expiryDate = calculateExpiryDate(plan);

    // Check if the premium status has already been updated
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: { hasPremium: true, premiumPlan: true }
    });

    // Only update if not already premium with the same plan
    if (!user.hasPremium || user.premiumPlan !== plan) {
      // Update user with premium status
      await prisma.user.update({
        where: { id: userData.id },
        data: {
          hasPremium: true,
          premiumPlan: plan,
          premiumExpiry: expiryDate,
          isPremium: true
        }
      });

      // For recurring plans, create a subscription record
      if (plan !== 'lifetime' && session.subscription) {
        await prisma.subscription.create({
          data: {
            userId: userData.id,
            plan: plan,
            startDate: new Date(),
            endDate: expiryDate,
            active: true,
            paymentProvider: 'stripe',
            paymentId: session.subscription,
          }
        });
      }
    }

    // Return success with plan details
    return NextResponse.json({
      success: true,
      plan,
      premiumExpiry: expiryDate
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: `Wystąpił błąd podczas weryfikacji płatności: ${error.message || 'Nieznany błąd'}` },
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