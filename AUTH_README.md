# WhatNow?! - Dokumentacja systemu uwierzytelniania

## Opis

System uwierzytelniania i autoryzacji zaimplementowany w aplikacji WhatNow?! - Generator Chaosu, umożliwiający rejestrację, logowanie i zarządzanie kontami użytkowników. System wykorzystuje JWT (JSON Web Tokens) do uwierzytelniania oraz bazę danych PostgreSQL do przechowywania danych użytkowników.

## Struktura bazy danych

Baza danych zawiera następujące modele (tabele):

### User
- `id` - unikalne ID użytkownika (UUID)
- `email` - adres e-mail (unikalny)
- `name` - imię użytkownika (opcjonalne)
- `password` - zahaszowane hasło
- `isPremium` - czy użytkownik posiada konto premium
- `createdAt` - data utworzenia konta
- `updatedAt` - data ostatniej aktualizacji konta

### GameSession
- `id` - unikalne ID sesji gry (UUID)
- `createdAt` - data rozpoczęcia sesji
- `endedAt` - data zakończenia sesji (opcjonalne)
- `mode` - tryb gry (soft, chaos, hardcore, quick)
- `playerCount` - liczba graczy
- `userId` - ID użytkownika, który utworzył sesję (relacja do User)

### CompletedTask
- `id` - unikalne ID wykonanego zadania (UUID)
- `taskId` - ID oryginalnego zadania
- `taskContent` - treść zadania
- `completedAt` - data wykonania zadania
- `skipped` - czy zadanie zostało pominięte
- `gameSessionId` - ID sesji gry (relacja do GameSession)

### TaskSet
- `id` - unikalne ID zestawu zadań (UUID)
- `name` - nazwa zestawu
- `description` - opis zestawu (opcjonalny)
- `mode` - tryb gry (soft, chaos, hardcore, quick)
- `isPremium` - czy zestaw jest dostępny tylko dla użytkowników premium
- `isPublic` - czy zestaw jest publiczny
- `createdAt` - data utworzenia zestawu
- `updatedAt` - data ostatniej aktualizacji zestawu
- `creatorId` - ID użytkownika, który utworzył zestaw (relacja do User)

### Task
- `id` - unikalne ID zadania (UUID)
- `content` - treść zadania
- `taskSetId` - ID zestawu zadań (relacja do TaskSet)
- `createdAt` - data utworzenia zadania

### Subscription
- `id` - unikalne ID subskrypcji (UUID)
- `userId` - ID użytkownika (relacja do User, unikalne)
- `plan` - typ planu (np. monthly, yearly)
- `startDate` - data rozpoczęcia subskrypcji
- `endDate` - data zakończenia subskrypcji
- `active` - czy subskrypcja jest aktywna
- `paymentProvider` - dostawca płatności (np. stripe, paypal)
- `paymentId` - ID płatności u dostawcy (opcjonalny)
- `createdAt` - data utworzenia subskrypcji
- `updatedAt` - data ostatniej aktualizacji subskrypcji

## Endpointy API

### Rejestracja
- **URL:** `/api/auth/register`
- **Metoda:** POST
- **Dane:** `{ email, password, name? }`
- **Odpowiedź:** `{ message, user }`

### Logowanie
- **URL:** `/api/auth/login`
- **Metoda:** POST
- **Dane:** `{ email, password }`
- **Odpowiedź:** `{ message, user }`
- **Cookie:** `auth-token` (JWT token)

### Wylogowanie
- **URL:** `/api/auth/logout`
- **Metoda:** POST
- **Odpowiedź:** `{ message }`
- **Cookie:** `auth-token` (usunięte)

### Dane użytkownika
- **URL:** `/api/auth/me`
- **Metoda:** GET
- **Wymagany token:** Tak
- **Odpowiedź:** `{ user }`

## Middleware

System wykorzystuje middleware do ochrony tras wymagających uwierzytelnienia. Middleware sprawdza obecność i ważność tokenu JWT w ciasteczku `auth-token`. Dla tras premium sprawdza również, czy użytkownik ma uprawnienia premium.

## Kontekst React

`AuthContext` zapewnia globalny dostęp do stanu uwierzytelnienia w aplikacji:

- `user` - dane zalogowanego użytkownika
- `isLoading` - czy trwa ładowanie danych uwierzytelniania
- `isAuthenticated` - czy użytkownik jest zalogowany
- `login(email, password)` - funkcja do logowania
- `logout()` - funkcja do wylogowywania
- `register(email, password, name)` - funkcja do rejestracji

## Bezpieczeństwo

- Hasła są hashowane przy użyciu biblioteki bcrypt przed zapisaniem do bazy danych
- Tokeny JWT są przechowywane w ciasteczkach HTTP-only, co chroni przed atakami XSS
- Tokeny mają ograniczony czas ważności (7 dni)
- Middleware zapewnia ochronę przed nieautoryzowanym dostępem

## Instalacja i konfiguracja

1. Upewnij się, że baza danych PostgreSQL jest skonfigurowana i dostępna
2. Ustaw zmienne środowiskowe w pliku `.env`:
   - `DATABASE_URL` - URL połączenia z bazą PostgreSQL
   - `JWT_TOKEN` - tajny klucz do podpisywania tokenów JWT
3. Uruchom migrację bazy danych: `npx prisma migrate dev`
4. Uruchom aplikację: `npm run dev` 