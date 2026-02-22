"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ App Router
import { toast } from "sonner";

interface Props {
    checklistId: string;
}

export default function ChecklistCardActions({ checklistId }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // ✅ hook

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/checklists/${checklistId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Erro ao excluir checklist.");

            toast.success("Checklist excluído com sucesso!");
            router.push("/checklist");
        } catch (err: any) {
            toast.error(err.message || "Erro ao excluir checklist.");
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center gap-3 mt-2">
                {/* Editar */}
                <Link
                    href={`/checklist/${checklistId}/edit`}
                    className="text-green-600 hover:text-green-700 transition"
                    title="Editar"
                >
                    <Pencil size={18} />
                </Link>

                {/* Excluir */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-red-400 hover:text-red-500 transition"
                    title="Excluir"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Modal de confirmação */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-80 relative shadow-lg">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">
                            Confirmar Exclusão
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                            Tem certeza que deseja excluir este checklist? Esta ação não pode ser desfeita.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-400 text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {loading ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}