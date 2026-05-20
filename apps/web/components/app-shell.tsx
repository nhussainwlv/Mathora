"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/student", label: "Student" },
  { href: "/student/learn", label: "Learn" },
  { href: "/student/flashcards", label: "Flashcards" },
  { href: "/student/games", label: "Games" },
  { href: "/teacher", label: "Teacher" },
  { href: "/admin", label: "Admin" },
  { href: "/parent", label: "Parent" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-4 p-4 md:p-6">
        <aside className="hidden w-64 shrink-0 rounded-3xl border border-white/20 bg-white/40 p-4 shadow-xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/40 md:block">
          <h2 className="mb-4 text-xl font-bold">Mathora</h2>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-3 py-2 text-sm transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white/60 hover:bg-white dark:bg-slate-800/60 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="w-full">
          <header className="mb-4 flex items-center justify-between rounded-2xl border border-white/20 bg-white/50 p-4 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white md:hidden dark:bg-slate-100 dark:text-slate-900"
              >
                Menu
              </button>
              <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-semibold md:text-2xl">
                Personalised Maths Learning
              </motion.h1>
            </div>
            <ThemeToggle />
          </header>

          {menuOpen ? (
            <nav className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/20 bg-white/50 p-3 backdrop-blur-md md:hidden dark:border-slate-700/50 dark:bg-slate-900/50">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "bg-white/70 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
