import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;
    
    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send email with simple label for Zapier automation
    await transporter.sendMail({
      from: `"WhatNow - Formularz Kontaktowy" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[Kontakt] Nowa wiadomość od ${name}`,
      text: `
        Imię: ${name}
        E-mail: ${email}
        Wiadomość:
        ${message}
        
      `,
      html: `
        <h3>Nowa wiadomość z formularza kontaktowego</h3>
        <p><strong>Imię:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Wiadomość:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
      headers: {
        'X-Label': 'Kontakt'
      }
    });

    return NextResponse.json(
      { success: true, message: 'Wiadomość wysłana pomyślnie' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Błąd serwera podczas wysyłania wiadomości' },
      { status: 500 }
    );
  }
} 