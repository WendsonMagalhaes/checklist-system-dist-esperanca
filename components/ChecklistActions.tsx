"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
    checklistId: string;
}

export default function ChecklistActions({ checklistId }: Props) {
    const handleDelete = async () => {
        if (!confirm("Tem certeza que quer excluir este checklist?")) return;

        const res = await fetch(`/api/checklist/${checklistId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            alert("Checklist excluído com sucesso!");
            window.location.href = "/checklist"; // volta para a lista
        } else {
            alert("Erro ao excluir checklist.");
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-2 sm:mt-0">
            {/* Editar */}
            <Link
                href={`/checklist/${checklistId}/edit`}
                className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                title="Editar"
            >
                <Pencil size={18} />
            </Link>

            {/* Excluir */}
            <button
                onClick={handleDelete}
                className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                title="Excluir"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}