import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChecklistActions from "@/components/ChecklistActions";

interface ChecklistPageProps {
    params: Promise<{ id: string }>;
}

export default async function ChecklistDetailPage({ params }: ChecklistPageProps) {
    const { id } = await params;

    const checklist = await prisma.checklist.findUnique({
        where: { id },
        include: {
            pedido: true,
            motorista: true,
            responsavel: true,
            ajudante: true,
            itens: true,
            fotos: true,
        },
    });

    if (!checklist) return notFound();

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white truncate">
                        Checklist: {checklist.pedido?.numero || checklist.id}
                    </h1>
                    <span
                        className={`text-sm px-3 py-1 rounded-full font-semibold ${checklist.status === "PENDENTE"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : checklist.status === "APROVADO"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}
                    >
                        {checklist.status}
                    </span>
                </div>

                {/* Botões Editar/Excluir */}
                <ChecklistActions checklistId={checklist.id} />
            </div>

            {/* Informações */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-zinc-700 dark:text-zinc-300">
                <div>
                    <span className="font-medium text-zinc-900 dark:text-white">Motorista:</span>{" "}
                    {checklist.motorista.name}
                </div>
                <div>
                    <span className="font-medium text-zinc-900 dark:text-white">Responsável:</span>{" "}
                    {checklist.responsavel?.name || "-"}
                </div>
                <div>
                    <span className="font-medium text-zinc-900 dark:text-white">Ajudante:</span>{" "}
                    {checklist.ajudante?.name || "-"}
                </div>
                <div>
                    <span className="font-medium text-zinc-900 dark:text-white">Pedido:</span>{" "}
                    {checklist.pedido?.cliente}
                </div>
                <div>
                    <span className="font-medium text-zinc-900 dark:text-white">Criado em:</span>{" "}
                    {checklist.createdAt.toLocaleDateString("pt-BR")}
                </div>
                {checklist.observacao && (
                    <div className="col-span-1 sm:col-span-3">
                        <span className="font-medium text-zinc-900 dark:text-white">Observação:</span>{" "}
                        {checklist.observacao}
                    </div>
                )}
            </div>

            {/* Itens do checklist */}
            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Itens ({checklist.itens.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {checklist.itens.map((item) => (
                        <div
                            key={item.id}
                            className={`p-3 rounded-lg border ${item.marcado
                                    ? "bg-green-50 border-green-400 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-zinc-50 border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                }`}
                        >
                            {item.descricao}
                        </div>
                    ))}
                </div>
            </div>

            {/* Fotos */}
            {checklist.fotos.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        Fotos ({checklist.fotos.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {checklist.fotos.map((foto) => (
                            <img
                                key={foto.id}
                                src={foto.url}
                                alt="Foto do checklist"
                                className="w-full h-48 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}