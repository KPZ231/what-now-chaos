"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-[var(--container-color)] p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-white)]">Polityka Prywatności</h1>
        
        <div className="prose prose-invert max-w-none text-[var(--text-white)]">
          <p className="mb-4">Ostatnia aktualizacja: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Wprowadzenie</h2>
          <p>
            Witamy w WhatNow?! – Chaos Generator. Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób KPZsProductions ("my", "nas", "nasze") gromadzi, wykorzystuje i udostępnia Twoje informacje podczas korzystania z naszej aplikacji.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Gromadzone informacje</h2>
          <p>Gromadzimy następujące rodzaje informacji:</p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Informacje o koncie:</strong> Podczas rejestracji zbieramy Twój adres e-mail i hasło.</li>
            <li><strong>Informacje profilowe:</strong> Opcjonalne informacje, takie jak nazwa użytkownika i zdjęcie profilowe.</li>
            <li><strong>Dane gry:</strong> Informacje o Twoich sesjach gry, w tym ukończone zadania i wybrane ustawienia.</li>
            <li><strong>Informacje o płatnościach:</strong> Jeśli dokonujesz zakupów, dane płatności są przetwarzane przez naszych dostawców płatności.</li>
            <li><strong>Informacje techniczne:</strong> Informacje o Twoim urządzeniu i sposobie interakcji z naszą aplikacją.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Jak wykorzystujemy Twoje informacje</h2>
          <p>Wykorzystujemy Twoje informacje do:</p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Dostarczania, utrzymywania i ulepszania naszej aplikacji</li>
            <li>Przetwarzania transakcji i wysyłania powiązanych informacji</li>
            <li>Wysyłania aktualizacji, alertów bezpieczeństwa i wiadomości wsparcia</li>
            <li>Odpowiadania na Twoje komentarze i pytania</li>
            <li>Tworzenia nowych produktów i usług</li>
            <li>Generowania anonimowych, zbiorczych statystyk dotyczących użytkowania aplikacji</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Udostępnianie i ujawnianie informacji</h2>
          <p>Możemy udostępniać Twoje informacje:</p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Dostawcom usług:</strong> Firmom, które świadczą dla nas usługi</li>
            <li><strong>Wymogom prawnym:</strong> Gdy jest to wymagane przez prawo lub w celu ochrony naszych praw</li>
            <li><strong>Przeniesieniom biznesowym:</strong> Jeśli jesteśmy zaangażowani w fuzję, przejęcie lub sprzedaż aktywów</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Twoje wybory</h2>
          <p>Możesz:</p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Zaktualizować informacje o koncie w ustawieniach profilu</li>
            <li>Zrezygnować z komunikacji marketingowej</li>
            <li>Poprosić o usunięcie konta, kontaktując się z nami</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Bezpieczeństwo danych</h2>
          <p>
            Wdrażamy odpowiednie środki bezpieczeństwa w celu ochrony Twoich informacji. Jednak żadna metoda transmisji przez Internet nie jest w 100% bezpieczna.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Prywatność dzieci</h2>
          <p>
            Nasza aplikacja nie jest przeznaczona dla dzieci poniżej 13 roku życia i świadomie nie zbieramy informacji od dzieci poniżej 13 roku życia.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Zmiany w niniejszej Polityce</h2>
          <p>
            Możemy od czasu do czasu aktualizować niniejszą politykę. O wszelkich zmianach powiadomimy Cię, publikując nową politykę na tej stronie.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Skontaktuj się z nami</h2>
          <p>
            Jeśli masz pytania dotyczące niniejszej Polityki Prywatności, skontaktuj się z nami pod adresem:{" "}
            <Link href="mailto:info@KPZsProductions.com" className="text-[var(--primary)] hover:underline">
              info@KPZsProductions.com
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 