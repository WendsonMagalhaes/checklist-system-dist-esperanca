"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditarPerfilForm({ user }: { user: any }) {
    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        username: user.username,
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/perfil/editar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro ao atualizar perfil");

            toast.success("Perfil atualizado com sucesso!");
            setForm(prev => ({ ...prev, password: "" }));
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-800 border-2 border-green-600 rounded-2xl shadow-sm p-6 space-y-6"
        >


            {/* Campos */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome">
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        className="border-green-500 focus:ring-green-500 focus:border-green-500"
                    />
                </Field>

                <Field label="Email">
                    <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="border-green-500 focus:ring-green-500 focus:border-green-500"
                    />
                </Field>

                <Field label="Usuário">
                    <Input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Seu usuário"
                        className="border-green-500 focus:ring-green-500 focus:border-green-500"
                    />
                </Field>

                <Field label="Nova Senha">
                    <Input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Deixe em branco para não alterar"
                        className="border-green-500 focus:ring-green-500 focus:border-green-500"
                    />
                </Field>
            </div>

            {/* Botão */}
            <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                disabled={loading}
            >
                {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
        </form>
    );
}

/* ================= COMPONENTE FIELD ================= */
function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col">
            <span className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {label}
            </span>
            <div className="mt-1">{children}</div>
        </div>
    );
}