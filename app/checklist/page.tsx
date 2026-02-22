import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ChecklistCardActions from "@/components/ChecklistCardActions";
import { Checklist } from "@prisma/client";

// Define o tipo combinando Checklist + relações
type ChecklistWithRelations = Checklist & {
    pedido: { id: string; numero: string };
    motorista: { id: string; name: string };
    responsavel?: { id: string; name: string } | null;
    ajudante?: { id: string; name: string } | null;
    itens: { id: string; descricao: string; marcado: boolean }[];
    fotos: { id: string; url: string }[];
};

export default async function ChecklistPage() {
    // Prisma já infere corretamente o tipo ao usar include, mas definimos tipo explícito
    const checklists: ChecklistWithRelations[] = await prisma.checklist.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
            motorista: true,
            responsavel: true,
            ajudante: true,
            itens: true,
            fotos: true,
            pedido: true,
        },
    });

    return (
        <div className="p-8 space-y-6 max-w-6xl mx-auto">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                    Checklists
                </h1>
                <Link
                    href="/checklist/novo"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Novo Checklist
                </Link>
            </div>

            {/* Lista de checklists */}
            <div className="flex flex-col gap-4">
                {checklists.map((checklist) => (
                    <div
                        key={checklist.id}
                        className="w-full p-6 border border-green-600 rounded-xl hover:shadow-lg transition
             bg-white dark:bg-zinc-800"
                    >
                        {/* Topo: título e status */}
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                            <Link
                                href={`/checklist/${checklist.id}`}
                                className="text-lg font-semibold text-zinc-800 dark:text-white truncate hover:underline"
                            >
                                {checklist.pedido?.numero || `Checklist ${checklist.id}`}
                            </Link>
                            <span
                                className={`text-xs px-2 py-1 rounded-full font-semibold ${checklist.status === "PENDENTE"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                        : checklist.status === "APROVADO"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    }`}
                            >
                                {checklist.status}
                            </span>
                        </div>

                        {/* Conteúdo em linha */}
                        <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <div className="flex flex-wrap gap-6">
                                <div>
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                                        Motorista:
                                    </span>{" "}
                                    {checklist.motorista.name}
                                </div>
                                <div>
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                                        Responsável:
                                    </span>{" "}
                                    {checklist.responsavel?.name || "-"}
                                </div>
                                <div>
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                                        Ajudante:
                                    </span>{" "}
                                    {checklist.ajudante?.name || "-"}
                                </div>
                                <div>
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                                        Itens:
                                    </span>{" "}
                                    {checklist.itens.length}
                                </div>
                                <div>
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                                        Fotos:
                                    </span>{" "}
                                    {checklist.fotos.length}
                                </div>
                                <div>
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                                        Criado em:
                                    </span>{" "}
                                    {checklist.createdAt.toLocaleDateString("pt-BR")}
                                </div>
                            </div>

                            {/* Botões minimalistas */}
                            <div>
                                <ChecklistCardActions checklistId={checklist.id} />
                            </div>
                        </div>
                    </div>
                ))}

                {checklists.length === 0 && (
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Nenhum checklist encontrado.
                    </p>
                )}
            </div>
        </div>
    );
}