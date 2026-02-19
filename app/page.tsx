"use client";

import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-slate-50 dark:bg-slate-900
                    transition-colors duration-300">

      <div className="w-full max-w-md p-10
                      bg-white dark:bg-slate-800
                      rounded-xl shadow-lg
                      border border-slate-200 dark:border-slate-700
                      transition-colors duration-300">

        {/* Botões Tema */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setTheme("light")}
            className={`px-3 py-1 text-xs rounded-md border transition
              ${theme === "light"
                ? "bg-green-600 text-white border-green-600"
                : "border-slate-300 text-slate-600 hover:border-green-500"
              }`}
          >
            Claro
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`px-3 py-1 text-xs rounded-md border transition
              ${theme === "dark"
                ? "bg-green-600 text-white border-green-600"
                : "border-slate-300 text-slate-600 hover:border-green-500"
              }`}
          >
            Escuro
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-center
                       text-slate-800 dark:text-white mb-2">
          Checklist System
        </h1>

        <p className="text-center text-sm
                      text-slate-500 dark:text-slate-400 mb-8">
          Acesso ao painel operacional
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg
                       border border-slate-300 dark:border-slate-600
                       bg-white dark:bg-slate-700
                       text-slate-800 dark:text-white
                       placeholder:text-slate-600 dark:placeholder:text-slate-400
                       focus:ring-2 focus:ring-green-600 focus:border-green-600
                       outline-none transition"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg
                       border border-slate-300 dark:border-slate-600
                       bg-white dark:bg-slate-700
                       text-slate-800 dark:text-white
                       placeholder:text-slate-600 dark:placeholder:text-slate-400
                       focus:ring-2 focus:ring-green-600 focus:border-green-600
                       outline-none transition"
          />

          <button
            type="submit"
            className="w-full p-3 rounded-lg
                       bg-green-600 hover:bg-green-700
                       text-white font-medium transition"
          >
            Entrar
          </button>
        </form>

      </div>
    </div>
  );
}
