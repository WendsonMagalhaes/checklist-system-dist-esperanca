"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Usuario = {
    id: string;
    name: string;
};

type PedidoFormProps = {
    usuarios: Usuario[];
    pedido?: any;
};

export default function PedidoForm({
    usuarios,
    pedido,
}: PedidoFormProps) {
    const router = useRouter();

    const [titulo, setTitulo] = useState(pedido?.titulo || "");
    const [motoristaId, setMotoristaId] = useState(
        pedido?.motoristaId || ""
    );
    const [ajudanteId, setAjudanteId] = useState(
        pedido?.ajudanteId || ""
    );

    const [checklist, setChecklist] = useState({
        pneus: pedido?.checklist?.pneus || false,
        documentos: pedido?.checklist?.documentos || false,
        luzes: pedido?.checklist?.luzes || false,
        equipamentos: pedido?.checklist?.equipamentos || false,
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const response = await fetch(
            pedido ? `/api/pedidos/${pedido.id}` : "/api/pedidos",
            {
                method: pedido ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    titulo,
                    motoristaId,
                    ajudanteId,
                    checklist,
                }),
            }
        );

        if (response.ok) {
            router.push("/pedidos");
            router.refresh();
        }
    }

    function toggleChecklist(item: keyof typeof checklist) {
        setChecklist((prev) => ({
            ...prev,
            [item]: !prev[item],
        }));
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800"
        >
            {/* Dados do Pedido */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                    Dados do Pedido
                </h2>

                <input
                    type="text"
                    placeholder="Título do pedido"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <select
                        value={motoristaId}
                        onChange={(e) => setMotoristaId(e.target.value)}
                        required
                        className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    >
                        <option value="">Selecione o motorista</option>
                        {usuarios.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={ajudanteId}
                        onChange={(e) => setAjudanteId(e.target.value)}
                        required
                        className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    >
                        <option value="">Selecione o ajudante</option>
                        {usuarios.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                    Checklist
                </h2>

                {Object.entries(checklist).map(([key, value]) => (
                    <label
                        key={key}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={() =>
                                toggleChecklist(key as keyof typeof checklist)
                            }
                            className="w-4 h-4 accent-green-600"
                        />
                        <span className="capitalize">{key}</span>
                    </label>
                ))}
            </div>

            <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
                {pedido ? "Atualizar Pedido" : "Criar Pedido"}
            </button>
        </form>
    );
}
