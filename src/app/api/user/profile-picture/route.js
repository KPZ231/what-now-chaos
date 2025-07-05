import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Maksymalny rozmiar pliku: 8MB
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB w bajtach

// Dozwolone typy plików
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// Funkcja do sanityzacji nazwy pliku
const sanitizeFilename = (filename) => {
  // Usuwamy znaki specjalne i spacje
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\s+/g, '_');
};

export async function POST(request) {
  try {
    // Sprawdzanie tokenu uwierzytelniającego
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Weryfikacja tokenu i danych użytkownika
    const userData = verifyToken(token);
    
    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Parsowanie formularza
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Brak pliku' }, { status: 400 });
    }

    // Sprawdzanie typu pliku
    const fileType = file.type;
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return NextResponse.json({ 
        error: 'Niedozwolony typ pliku. Dozwolone są tylko obrazy (JPEG, PNG, GIF, WebP, SVG)' 
      }, { status: 400 });
    }

    // Sprawdzanie rozmiaru pliku
    const fileSize = file.size;
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'Plik jest za duży. Maksymalny rozmiar to 8MB' 
      }, { status: 400 });
    }

    // Odczytywanie zawartości pliku
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Tworzenie unikalnej nazwy pliku z zachowaniem oryginalnego rozszerzenia
    const originalFilename = file.name;
    const fileExtension = path.extname(originalFilename);
    const sanitizedExtension = fileExtension.toLowerCase();
    const filename = `${uuidv4()}${sanitizedExtension}`;

    // Ścieżka do katalogu na pliki
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles');
    const relativePath = `/uploads/profiles/${filename}`;
    const fullPath = join(uploadDir, filename);

    // Tworzenie katalogu jeśli nie istnieje
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }

    // Zapisanie pliku
    await writeFile(fullPath, buffer);

    // Aktualizacja profilu użytkownika w bazie danych
    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: {
        profilePicture: relativePath
      },
      select: {
        id: true,
        email: true,
        name: true,
        description: true,
        profilePicture: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ 
      message: 'Zdjęcie profilowe zostało zaktualizowane',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Zachowujemy również PUT endpoint dla kompatybilności z poprzednim kodem
export async function PUT(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify token and get user data
    const userData = verifyToken(token);
    
    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Parse the request body
    const data = await request.json();
    
    // Validate the data
    if (!data || !data.profilePicture) {
      return NextResponse.json({ error: 'Profile picture URL is required' }, { status: 400 });
    }

    // Sanityzacja URL
    let sanitizedUrl;
    try {
      const url = new URL(data.profilePicture);
      // Sprawdzamy czy URL jest bezpieczny (nie zawiera skryptów JavaScript)
      if (url.protocol === 'javascript:') {
        throw new Error('Unsafe URL');
      }
      sanitizedUrl = url.toString();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format or unsafe URL' }, { status: 400 });
    }

    // Update the user's profile picture in the database
    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: {
        profilePicture: sanitizedUrl
      },
      select: {
        id: true,
        email: true,
        name: true,
        description: true,
        profilePicture: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ 
      message: 'Zdjęcie profilowe zostało zaktualizowane',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Profile picture PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 