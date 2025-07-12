import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyToken } from '@/lib/auth';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key');

// Define product prices (stored in Stripe, but keep here for reference)
const PRICES = {
  monthly: 'price_1Rk5iEKUywwPYYzQHQCtWgME', // Replace with actual Stripe Price ID
  yearly: 'price_1Rk5ihKUywwPYYzQcEn8UjUF',   // Replace with actual Stripe Price ID
  lifetime: 'price_1Rk5k2KUywwPYYzQhv3dVE4n' // Replace with actual Stripe Price ID
};

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

    // Get request body
    const body = await request.json();
    const { plan } = body;

    if (!plan || !['monthly', 'yearly', 'lifetime'].includes(plan)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy plan subskrypcji' },
        { status: 400 }
      );
    }

    const priceId = PRICES[plan];
    
    // Get domain for success and cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: plan === 'lifetime' ? 'payment' : 'subscription',
      success_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium`,
      metadata: {
        userId: userData.id,
        plan: plan,
      },
      customer_email: userData.email,
    });

    // Return the session id
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: `Wystąpił błąd podczas tworzenia sesji płatności: ${error.message || 'Nieznany błąd'}` },
      { status: 500 }
    );
  }
} 