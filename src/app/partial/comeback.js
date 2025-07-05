"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Comeback() {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 left-4 z-40"
        >
            <Link href="/" className="flex items-center gap-2 text-lg font-medium text-[var(--text-gray)] hover:text-[var(--primary)] transition-colors">
                <span>←</span>
                <span>Powrót</span>
            </Link>
        </motion.div>
    )
}