"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { User, Lock, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dark, setDark] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        }
    }, []);

    function toggleTheme() {
        document.documentElement.classList.toggle("dark");
        const isDark = document.documentElement.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        setDark(isDark);
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const result = await signIn("credentials", {
            username: username.trim(),
            password: password.trim(),
            redirect: false,
        });

        setLoading(false);

        console.log(result);

        if (result?.error) {
            toast.error("Usuário ou senha inválidos: " + result.error);
        } else {
            toast.success("Login realizado com sucesso!");
            window.location.href = "/dashboard";
        }
    }

    function DotsLoading() {
        const [dots, setDots] = useState(".");

        useEffect(() => {
            const interval = setInterval(() => {
                setDots(prev => (prev.length >= 3 ? "." : prev + "."));
            }, 500);

            return () => clearInterval(interval);
        }, []);

        return <span>Entrando{dots}</span>;
    }


    return (
        <div className="min-h-screen flex items-center justify-center
                    bg-white dark:bg-black
                    transition-colors duration-300">

            <div className="relative w-full max-w-md p-10
                      bg-white dark:bg-zinc-900
                      border border-zinc-200 dark:border-zinc-800
                      rounded-2xl shadow-xl">

                <button
                    onClick={toggleTheme}
                    className="absolute top-5 right-5 text-zinc-500 dark:text-zinc-400 hover:text-green-600 transition"
                >
                    {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <h1 className="text-2xl font-semibold text-center
                       text-zinc-800 dark:text-white mb-2">
                    Checklist System
                </h1>

                <p className="text-center text-sm
                      text-zinc-500 dark:text-zinc-400 mb-8">
                    Acesso ao painel operacional
                </p>

                <form onSubmit={handleLogin} className="space-y-5">

                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg
                         border border-zinc-300 dark:border-zinc-700
                         bg-white dark:bg-zinc-800
                         text-zinc-800 dark:text-white
                         focus:ring-2 focus:ring-green-600
                         outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg
                         border border-zinc-300 dark:border-zinc-700
                         bg-white dark:bg-zinc-800
                         text-zinc-800 dark:text-white
                         focus:ring-2 focus:ring-green-600
                         outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg
       bg-green-600 hover:bg-green-700
       text-white font-medium
       transition duration-200
       flex items-center justify-center gap-2"
                    >
                        {loading ? <DotsLoading /> : "Entrar"}
                    </button>


                </form>
            </div>
        </div>
    );
}
