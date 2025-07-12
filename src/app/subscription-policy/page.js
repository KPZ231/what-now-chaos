"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SubscriptionPolicy() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-[var(--container-color)] p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-white)]">Polityka Subskrypcji</h1>
        
        <div className="prose prose-invert max-w-none text-[var(--text-white)]">
          <p className="mb-4">Ostatnia aktualizacja: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Usługi Subskrypcyjne</h2>
          <p>
            WhatNow?! – Chaos Generator oferuje usługi subskrypcyjne premium, które zapewniają dostęp do dodatkowej zawartości, funkcji i usług. Niniejsza polityka określa warunki korzystania z tych subskrypcji.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Plany Subskrypcyjne</h2>
          <p>
            Oferujemy następujące opcje subskrypcji:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Plan Miesięczny:</strong> Dostęp do funkcji premium na jeden miesiąc, automatycznie odnawiany co miesiąc.</li>
            <li><strong>Plan Roczny:</strong> Dostęp do funkcji premium na jeden rok, automatycznie odnawiany co roku po obniżonej cenie.</li>
            <li><strong>Zakupy Jednorazowe:</strong> Specyficzne pakiety treści premium dostępne za jednorazową opłatą z trwałym dostępem.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Bezpłatny Okres Próbny</h2>
          <p>
            Możemy oferować bezpłatne okresy próbne dla naszych usług premium. Po zakończeniu okresu próbnego Twoja subskrypcja automatycznie przekształci się w płatną subskrypcję, chyba że anulujesz ją przed zakończeniem okresu próbnego.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Rozliczenia i Płatności</h2>
          <p>
            Subskrybując nasze usługi premium:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Upoważniasz nas do obciążania podanej metody płatności w sposób cykliczny za wybrany plan subskrypcji.</li>
            <li>Płatność zostanie pobrana na początku okresu subskrypcji.</li>
            <li>W przypadku subskrypcji cyklicznych płatność zostanie automatycznie odnowiona, chyba że anulujesz ją co najmniej 24 godziny przed końcem bieżącego okresu.</li>
            <li>Wszystkie opłaty są bezzwrotne, z wyjątkiem przypadków wymaganych przez prawo lub wyraźnie określonych w niniejszej polityce.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Anulowanie</h2>
          <p>
            Możesz anulować subskrypcję w dowolnym momencie w ustawieniach konta. Po anulowaniu:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Będziesz mieć dostęp do funkcji premium do końca bieżącego okresu rozliczeniowego.</li>
            <li>Nie zostaną zwrócone żadne częściowe zwroty za niewykorzystane okresy subskrypcji.</li>
            <li>Twoja subskrypcja nie zostanie automatycznie odnowiona po zakończeniu bieżącego okresu rozliczeniowego.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Zmiany Cen</h2>
          <p>
            Możemy zmienić nasze opłaty subskrypcyjne w dowolnym momencie. Wszelkie zmiany cen będą miały zastosowanie do okresów rozliczeniowych po dacie zmiany. Powiadomimy Cię o wszelkich zmianach cen przed ich wejściem w życie.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Zwroty</h2>
          <p>
            Generalnie, zakupy są bezzwrotne. Jednak w wyjątkowych okolicznościach możemy zapewnić zwroty według naszego wyłącznego uznania. Jeśli uważasz, że kwalifikujesz się do zwrotu, skontaktuj się z naszym działem obsługi klienta.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Zakończenie Konta</h2>
          <p>
            Jeśli zakończymy Twoje konto z powodu naruszenia naszych Warunków Usługi, nie będziesz uprawniony do zwrotu żadnych opłat subskrypcyjnych.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Zmiany w Usługach Subskrypcyjnych</h2>
          <p>
            Zastrzegamy sobie prawo do modyfikowania, zawieszania lub zaprzestania świadczenia dowolnej części naszych usług subskrypcyjnych w dowolnym momencie. Jeśli całkowicie zaprzestaniemy świadczenia usługi subskrypcyjnej, możemy zapewnić proporcjonalny zwrot za niewykorzystaną część subskrypcji.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Skontaktuj się z nami</h2>
          <p>
            Jeśli masz pytania dotyczące naszej Polityki Subskrypcji, skontaktuj się z nami pod adresem:{" "}
            <Link href="mailto:info@KPZsProductions.com" className="text-[var(--primary)] hover:underline">
              info@KPZsProductions.com
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 