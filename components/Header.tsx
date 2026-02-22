"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import {
    Sun,
    Moon,
    Menu,
    X,
    User,
    LogOut,
} from "lucide-react";

export default function Header() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    if (pathname === "/login") return null;

    function NavLink({ href, label }: { href: string; label: string }) {
        const active = pathname.startsWith(href);

        return (
            <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${active
                        ? "bg-green-600 text-white"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40"
                    }`}
            >
                {label}
            </Link>
        );
    }

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
            <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">

                {/* LOGO */}
                <h1 className="text-lg font-semibold text-zinc-800 dark:text-white">
                    Checklist System
                </h1>

                {/* DIREITA */}
                <div className="flex items-center gap-4">

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        <NavLink href="/dashboard" label="Dashboard" />
                        <NavLink href="/checklist" label="Checklists" />
                        <NavLink href="/historico" label="Histórico" />
                        {/* 🔒 Apenas Admin ou Supervisor */}
                        {(session?.user?.role === "ADMIN" || session?.user?.role === "SUPERVISOR") && (
                            <NavLink href="/usuarios" label="Usuários" />
                        )}                    </nav>

                    {/* Dark Mode */}
                    <button
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="text-zinc-500 dark:text-zinc-400 hover:text-green-600 transition-colors duration-200"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Usuário */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg
                       text-zinc-600 dark:text-zinc-300
                       hover:text-green-600
                       hover:bg-green-50 dark:hover:bg-green-950/40
                       transition-all duration-200"
                        >
                            <User size={18} />
                            <span className="hidden md:block text-sm">
                                {session?.user?.name}
                            </span>
                        </button>

                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden">
                                <Link
                                    href="/perfil"
                                    className="block px-4 py-2 text-sm
                           text-zinc-600 dark:text-zinc-300
                           hover:text-green-600
                           hover:bg-green-50 dark:hover:bg-green-950/40
                           transition-all duration-200"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    Perfil
                                </Link>

                                <button
                                    onClick={() =>
                                        signOut({ callbackUrl: "/login" })
                                    }
                                    className="w-full text-left px-4 py-2 text-sm
                           text-zinc-600 dark:text-zinc-300
                           hover:text-green-600
                           hover:bg-green-50 dark:hover:bg-green-950/40
                           transition-all duration-200
                           flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-zinc-600 dark:text-zinc-300 hover:text-green-600 transition-colors duration-200"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2 border-t border-zinc-200 dark:border-zinc-800">
                    <NavLink href="/dashboard" label="Dashboard" />
                    <NavLink href="/checklist" label="Checklists" />
                    <NavLink href="/historico" label="Histórico" />
                    {/* 🔒 Apenas Admin ou Supervisor */}
                    {(session?.user?.role === "ADMIN" || session?.user?.role === "SUPERVISOR") && (
                        <NavLink href="/usuarios" label="Usuários" />
                    )}                </div>
            )}
        </header>
    );

}
