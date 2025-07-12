"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-[var(--container-color)] p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-white)]">Polityka Cookies</h1>
        
        <div className="prose prose-invert max-w-none text-[var(--text-white)]">
          <p className="mb-4">Ostatnia aktualizacja: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Wprowadzenie</h2>
          <p>
            Niniejsza Polityka Cookies wyjaśnia, w jaki sposób KPZsProductions (&quot;my&quot;, &quot;nas&quot;, &quot;nasze&quot;) używa plików cookie i podobnych technologii w aplikacji i witrynie WhatNow?! – Chaos Generator. Wyjaśnia, czym są te technologie i dlaczego ich używamy, a także Twoje prawa do kontrolowania ich wykorzystania.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Czym są pliki cookie?</h2>
          <p>
            Pliki cookie to małe pliki tekstowe, które są przechowywane na Twoim komputerze lub urządzeniu mobilnym podczas odwiedzania witryny. Pozwalają one witrynie rozpoznać Twoje urządzenie i zapamiętać, czy odwiedziłeś witrynę wcześniej. Pliki cookie są szeroko stosowane w celu zwiększenia wydajności witryn internetowych i dostarczania informacji właścicielom witryn.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Rodzaje używanych przez nas plików cookie</h2>
          <p>
            Używamy następujących rodzajów plików cookie:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Niezbędne pliki cookie:</strong> Te pliki cookie są niezbędne do prawidłowego funkcjonowania witryny. Umożliwiają podstawowe funkcje, takie jak nawigacja po stronie, dostęp do bezpiecznych obszarów i funkcjonalność gry.</li>
            <li><strong>Pliki cookie preferencji:</strong> Te pliki cookie pozwalają nam zapamiętywać Twoje wybory i zapewniać ulepszone, spersonalizowane funkcje. Mogą być ustawiane przez nas lub przez dostawców zewnętrznych, których usługi dodaliśmy do naszych stron.</li>
            <li><strong>Analityczne pliki cookie:</strong> Te pliki cookie pomagają nam zrozumieć, w jaki sposób odwiedzający wchodzą w interakcje z naszą witryną, zbierając i raportując informacje anonimowo. Pomagają nam poprawić sposób działania naszej witryny.</li>
            <li><strong>Marketingowe pliki cookie:</strong> Te pliki cookie są używane do śledzenia odwiedzających na różnych witrynach. Służą do wyświetlania reklam, które są odpowiednie i angażujące dla poszczególnych użytkowników.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Konkretne pliki cookie, których używamy</h2>
          <p>
            Oto kilka przykładów plików cookie, których używamy:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Uwierzytelnianie:</strong> Używamy plików cookie do identyfikacji użytkownika podczas odwiedzania naszej witryny i do pomocy w korzystaniu z interaktywnych funkcji.</li>
            <li><strong>Sesja:</strong> Używamy plików cookie do utrzymywania sesji podczas korzystania z naszej aplikacji.</li>
            <li><strong>Preferencje:</strong> Używamy plików cookie do zapamiętywania Twoich ustawień i preferencji.</li>
            <li><strong>Bezpieczeństwo:</strong> Używamy plików cookie do identyfikacji i zapobiegania zagrożeniom bezpieczeństwa.</li>
            <li><strong>Analityka:</strong> Używamy plików cookie, aby pomóc nam zrozumieć, w jaki sposób nasza witryna jest używana.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Pliki cookie stron trzecich</h2>
          <p>
            Niektóre pliki cookie są umieszczane przez strony trzecie w naszym imieniu. Strony trzecie obejmują wyszukiwarki, dostawców usług pomiarowych i analitycznych, sieci społecznościowe i firmy reklamowe. Te pliki cookie umożliwiają:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Integrację z platformami społecznościowymi</li>
            <li>Statystyki użytkowania w celu ulepszenia naszych usług i marketingu</li>
            <li>Przetwarzanie płatności</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Zarządzanie plikami cookie</h2>
          <p>
            Większość przeglądarek internetowych umożliwia kontrolowanie plików cookie za pomocą ustawień preferencji. Jednak ograniczenie plików cookie może wpłynąć na Twoje wrażenia z korzystania z naszej witryny. Oto jak zarządzać plikami cookie w popularnych przeglądarkach:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Chrome:</strong> Ustawienia → Prywatność i bezpieczeństwo → Pliki cookie i inne dane witryn</li>
            <li><strong>Firefox:</strong> Opcje → Prywatność i bezpieczeństwo → Pliki cookie i dane witryn</li>
            <li><strong>Safari:</strong> Preferencje → Prywatność → Pliki cookie i dane witryn</li>
            <li><strong>Edge:</strong> Ustawienia → Uprawnienia witryn → Pliki cookie i dane witryn</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Twoje wybory</h2>
          <p>
            Masz prawo zdecydować, czy akceptować, czy odrzucać pliki cookie. Możesz skorzystać z tego prawa, dostosowując ustawienia przeglądarki tak, aby odrzucała pliki cookie. Jeśli zdecydujesz się odrzucić pliki cookie, nadal możesz korzystać z naszej witryny, ale Twój dostęp do niektórych funkcji i obszarów może być ograniczony.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Aktualizacje niniejszej Polityki Cookies</h2>
          <p>
            Możemy od czasu do czasu aktualizować niniejszą Politykę Cookies w celu odzwierciedlenia zmian w używanych przez nas plikach cookie lub z innych przyczyn operacyjnych, prawnych lub regulacyjnych. Prosimy o regularne odwiedzanie niniejszej Polityki Cookies, aby być na bieżąco z naszym wykorzystaniem plików cookie.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Skontaktuj się z nami</h2>
          <p>
            Jeśli masz pytania dotyczące naszej Polityki Cookies, skontaktuj się z nami pod adresem:{" "}
            <Link href="mailto:info@KPZsProductions.com" className="text-[var(--primary)] hover:underline">
              info@KPZsProductions.com
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 