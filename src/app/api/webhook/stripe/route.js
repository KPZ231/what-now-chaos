import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key');

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  // Verify webhook signature
  let event;
  try {
    // If you have a webhook secret configured
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // For development, just parse the event
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleSuccessfulPayment(session);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handleSuccessfulSubscriptionPayment(invoice);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleSuccessfulPayment(session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;
  
  if (!userId || !plan) {
    console.error('Missing user ID or plan in session metadata');
    return;
  }
  
  // Calculate expiry date based on plan
  const expiryDate = calculateExpiryDate(plan);
  
  // Update user with premium status
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        hasPremium: true,
        premiumPlan: plan,
        premiumExpiry: expiryDate,
        isPremium: true
      }
    });
    
    // Create subscription record (for recurring plans)
    if (plan !== 'lifetime') {
      await prisma.subscription.create({
        data: {
          userId: userId,
          plan: plan,
          startDate: new Date(),
          endDate: expiryDate,
          active: true,
          paymentProvider: 'stripe',
          paymentId: session.subscription || session.id,
        }
      });
    }
    
    console.log(`Premium status updated for user ${userId} with plan ${plan}`);
  } catch (error) {
    console.error('Error updating premium status:', error);
    throw error;
  }
}

/**
 * Handle recurring subscription payments
 */
async function handleSuccessfulSubscriptionPayment(invoice) {
  // If this is a renewal, update the subscription record and extend expiry
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan;
    
    if (!userId || !plan) {
      console.log('No user ID or plan in subscription metadata');
      return;
    }
    
    const expiryDate = calculateExpiryDate(plan);
    
    // Update user expiry
    await prisma.user.update({
      where: { id: userId },
      data: {
        premiumExpiry: expiryDate,
      }
    });
    
    // Update subscription record
    await prisma.subscription.updateMany({
      where: { 
        userId: userId,
        paymentId: invoice.subscription,
      },
      data: {
        endDate: expiryDate,
        active: true,
      }
    });
    
    console.log(`Subscription renewed for user ${userId} until ${expiryDate}`);
  }
}

/**
 * Handle subscription cancellations
 */
async function handleSubscriptionCanceled(subscription) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) {
    console.log('No user ID in subscription metadata');
    return;
  }
  
  // Mark subscription as inactive
  await prisma.subscription.updateMany({
    where: {
      userId: userId,
      paymentId: subscription.id,
    },
    data: {
      active: false,
    }
  });
  
  console.log(`Subscription canceled for user ${userId}`);
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