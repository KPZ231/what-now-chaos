"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-[var(--container-color)] p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-white)]">Warunki Usługi</h1>
        
        <div className="prose prose-invert max-w-none text-[var(--text-white)]">
          <p className="mb-4">Ostatnia aktualizacja: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Akceptacja Warunków</h2>
          <p>
            Uzyskując dostęp do WhatNow?! – Chaos Generator lub korzystając z niego, zgadzasz się na niniejsze Warunki Usługi. Jeśli nie zgadzasz się, prosimy nie korzystać z naszej aplikacji.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Opis Usługi</h2>
          <p>
            WhatNow?! – Chaos Generator to aplikacja, która dostarcza losowe, zabawne zadania na imprezy i spotkania towarzyskie. Aplikacja zawiera zarówno darmowe, jak i płatne funkcje.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Konta Użytkowników</h2>
          <p>
            Może być konieczne utworzenie konta, aby uzyskać dostęp do niektórych funkcji. Jesteś odpowiedzialny za:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Zachowanie poufności danych uwierzytelniających konta</li>
            <li>Wszystkie działania, które mają miejsce na Twoim koncie</li>
            <li>Natychmiastowe powiadomienie nas o wszelkim nieautoryzowanym użyciu</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Treści Użytkownika</h2>
          <p>
            Możesz przesyłać treści do naszej aplikacji, takie jak niestandardowe zadania lub opinie. Zachowujesz własność swoich treści, ale udzielasz nam licencji na ich używanie, modyfikowanie i wyświetlanie w związku z aplikacją.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Zabronione Zachowanie</h2>
          <p>
            Zgadzasz się nie:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Używać aplikacji w jakimkolwiek celu niezgodnym z prawem</li>
            <li>Przesyłać treści, które są obraźliwe, szkodliwe lub naruszają prawa innych</li>
            <li>Próbować zakłócać działanie lub bezpieczeństwo aplikacji</li>
            <li>Podszywać się pod inną osobę lub podmiot</li>
            <li>Używać aplikacji do wysyłania niechcianych wiadomości</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Funkcje Premium i Płatności</h2>
          <p>
            Oferujemy funkcje premium do zakupu. Dokonując zakupu, zgadzasz się na:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Uiszczanie wszystkich opłat w określonej walucie</li>
            <li>Podanie dokładnych informacji o płatności</li>
            <li>Warunki każdej wybranej usługi subskrypcyjnej</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Własność Intelektualna</h2>
          <p>
            Cała zawartość, funkcje i funkcjonalność aplikacji, w tym tekst, grafika, logo i kod, są wyłączną własnością KPZsProductions i są chronione prawem autorskim i innymi przepisami dotyczącymi własności intelektualnej.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Wyłączenie Gwarancji</h2>
          <p>
            Aplikacja jest dostarczana &quot;tak jak jest&quot; i &quot;w miarę dostępności&quot; bez żadnych gwarancji. Nie gwarantujemy, że aplikacja będzie działać bez przerw, bezpiecznie lub bez błędów.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Ograniczenie Odpowiedzialności</h2>
          <p>
            W maksymalnym zakresie dozwolonym przez prawo, KPZsProductions nie ponosi odpowiedzialności za jakiekolwiek pośrednie, przypadkowe, specjalne, wynikowe lub karne szkody wynikające z korzystania lub niemożności korzystania z aplikacji.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Zmiany w Warunkach</h2>
          <p>
            Możemy modyfikować niniejsze Warunki w dowolnym momencie. O znaczących zmianach powiadomimy Cię za pośrednictwem aplikacji lub poczty elektronicznej.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">11. Prawo Właściwe</h2>
          <p>
            Niniejsze Warunki podlegają prawu polskiemu, bez względu na jego przepisy kolizyjne.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">12. Skontaktuj się z nami</h2>
          <p>
            Jeśli masz pytania dotyczące niniejszych Warunków, skontaktuj się z nami pod adresem:{" "}
            <Link href="mailto:info@KPZsProductions.com" className="text-[var(--primary)] hover:underline">
              info@KPZsProductions.com
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 