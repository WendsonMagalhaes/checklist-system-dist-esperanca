"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Camera, Users, FileText, Sun, Moon } from "lucide-react";
import DotsLoading from "@/components/DotsLoading";

export default function CreateChecklistPage() {
    const [pedido, setPedido] = useState("");
    const [fotoUrl, setFotoUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [ajudante, setAjudante] = useState("");
    const [observacao, setObservacao] = useState("");
    const [loading, setLoading] = useState(false);
    const [dark, setDark] = useState(false);

    // alternar tema
    function toggleTheme() {
        document.documentElement.classList.toggle("dark");
        const isDark = document.documentElement.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        setDark(isDark);
    }

    // carregar tema salvo
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "dark") {
                document.documentElement.classList.add("dark");
                setDark(true);
            }
        }
    }, []);

    // converte arquivo em base64
    function toBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = (err) => reject(err);
        });
    }

    // Criar checklist
    async function handleCreateChecklist(e: React.FormEvent) {
        e.preventDefault();

        if (!pedido) {
            toast.error("Pedido é obrigatório");
            return;
        }

        setLoading(true);

        let fotoBase64: string | null = null;
        if (selectedFile) {
            try {
                fotoBase64 = await toBase64(selectedFile);
            } catch (err) {
                toast.error("Erro ao processar a foto");
                console.error(err);
                setLoading(false);
                return;
            }
        }

        try {
            const res = await fetch("/api/checklists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pedido,
                    fotoFile: fotoBase64,
                    ajudante,
                    observacao,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Checklist criado com sucesso!");
                // resetar formulário
                setPedido("");
                setFotoUrl("");
                setSelectedFile(null);
                setAjudante("");
                setObservacao("");
            } else {
                toast.error(data.error || "Erro ao criar checklist");
            }
        } catch (err) {
            toast.error("Erro ao conectar com o servidor");
            console.error(err);
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300 p-6">
            <div className="relative w-full max-w-md p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
                {/* botão tema */}
                <button
                    onClick={toggleTheme}
                    className="absolute top-5 right-5 text-zinc-500 dark:text-zinc-400 hover:text-green-600 transition"
                >
                    {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <h1 className="text-2xl font-semibold text-center text-zinc-800 dark:text-white mb-2">
                    Criar Checklist
                </h1>
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                    Preencha os campos para registrar um novo checklist
                </p>

                <form onSubmit={handleCreateChecklist} className="space-y-5">
                    {/* Pedido */}
                    <div className="relative">
                        <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Pedido"
                            value={pedido}
                            onChange={(e) => setPedido(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-green-600 outline-none"
                            required
                        />
                    </div>

                    {/* Upload Foto */}
                    <div className="relative">
                        <Camera size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (!e.target.files?.[0]) return;
                                setSelectedFile(e.target.files[0]);
                                setFotoUrl(URL.createObjectURL(e.target.files[0]));
                            }}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-green-600 outline-none"
                        />
                    </div>

                    {/* preview da imagem */}
                    {fotoUrl && (
                        <img src={fotoUrl} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
                    )}

                    {/* Ajudante */}
                    <div className="relative">
                        <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Ajudante"
                            value={ajudante}
                            onChange={(e) => setAjudante(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-green-600 outline-none"
                        />
                    </div>

                    {/* Observação */}
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-2 text-zinc-400" />
                        <textarea
                            placeholder="Observação"
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-green-600 outline-none resize-none h-24"
                        />
                    </div>

                    {/* Botão */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? <DotsLoading text="Salvando" /> : "Criar Checklist"}
                    </button>
                </form>
            </div>
        </div>
    );
}
