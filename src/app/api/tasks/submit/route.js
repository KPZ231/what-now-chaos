import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    const { content, difficulty, players, category } = data;
    
    // Validation
    if (!content || !difficulty || !players || !category) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      );
    }

    // Get difficulty text
    const difficultyText = {
      '1': 'Łatwe',
      '2': 'Średnie',
      '3': 'Trudne'
    }[difficulty] || 'Nieznana';

    // Get player type text
    const playerTypeText = {
      'one': 'Pojedynczy gracz',
      'two': 'Dwóch graczy',
      'all': 'Wszyscy gracze',
      'half': 'Połowa graczy',
      'random': 'Losowi gracze'
    }[players] || players;

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
      from: `"WhatNow - Nowe Zadanie" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[ZADANIE] Nowe zadanie ${category.toUpperCase()} - ${difficultyText}`,
      text: `
        Nowe zadanie zgłoszone do aplikacji WhatNow?!
        
        Kategoria: ${category}
        Trudność: ${difficultyText}
        Dla: ${playerTypeText}
        Treść zadania: ${content}
      `,
      html: `
        <h3>Nowe zadanie zgłoszone do aplikacji WhatNow?!</h3>
        <p><strong>Kategoria:</strong> ${category}</p>
        <p><strong>Trudność:</strong> ${difficultyText}</p>
        <p><strong>Dla:</strong> ${playerTypeText}</p>
        <p><strong>Treść zadania:</strong></p>
        <p>${content}</p>
      `,
      headers: {
        'X-Label': 'ZADANIE'
      }
    });

    return NextResponse.json(
      { success: true, message: 'Zadanie zostało pomyślnie zgłoszone' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Błąd serwera podczas wysyłania zadania' },
      { status: 500 }
    );
  }
} 