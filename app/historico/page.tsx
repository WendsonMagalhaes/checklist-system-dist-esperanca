import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Prisma } from "@prisma/client";

export default async function HistoricoPage() {
    type ChecklistWithRelations = Prisma.ChecklistGetPayload<{
        include: {
            pedido: { select: { numero: true; cliente: true } };
            motorista: { select: { name: true } };
            ajudante: { select: { name: true } };
        };
    }>;

    const checklists: ChecklistWithRelations[] = await prisma.checklist.findMany({
        orderBy: { data: "desc" },
        include: {
            pedido: { select: { numero: true, cliente: true } },
            motorista: { select: { name: true } },
            ajudante: { select: { name: true } },
        },
    });

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-white">
                Histórico de Checklists
            </h1>

            <Card className="border border-green-600 shadow-sm">
                <CardHeader>
                    <CardTitle>Checklists Registrados</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* DESKTOP - TABELA */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-base border-collapse"> {/* text-base em vez de text-sm */}
                            <thead className="bg-green-50 dark:bg-green-900/20 text-left">
                                <tr>
                                    <th className="px-4 py-2 text-zinc-700 dark:text-zinc-300 text-lg">Pedido</th>
                                    <th className="px-4 py-2 text-zinc-700 dark:text-zinc-300 text-lg">Cliente</th>
                                    <th className="px-4 py-2 text-zinc-700 dark:text-zinc-300 text-lg">Motorista</th>
                                    <th className="px-4 py-2 text-zinc-700 dark:text-zinc-300 text-lg">Status</th>
                                    <th className="px-4 py-2 text-zinc-700 dark:text-zinc-300 text-lg">Data</th>
                                    <th className="px-4 py-2 text-zinc-700 dark:text-zinc-300 text-lg text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklists.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="border-b border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-zinc-700/50 transition"
                                    >
                                        <td className="px-4 py-2 font-medium text-zinc-800 dark:text-white">
                                            <Link href={`/checklist/${c.id}`} className="text-green-700 hover:underline truncate">
                                                {c.pedido?.numero ?? "-"}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400 truncate">{c.pedido?.cliente ?? "-"}</td>
                                        <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">{c.motorista?.name ?? "-"}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`text-sm px-2 py-1 rounded-full font-semibold ${c.status === "PENDENTE"
                                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                    : c.status === "APROVADO"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                    }`}
                                            >
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">{new Date(c.data).toLocaleDateString("pt-BR")}</td>
                                        <td className="px-4 py-2 text-right">
                                            <Link
                                                href={`/checklist/${c.id}/edit`}
                                                className="text-green-600 hover:text-green-700 transition flex justify-end items-center"
                                                title="Editar"
                                            >
                                                <Pencil size={20} /> {/* aumentei o ícone também */}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE - CARDS */}
                    <div className="md:hidden flex flex-col gap-4">
                        {checklists.map((c) => (
                            <div
                                key={c.id}
                                className="border border-green-600 rounded-xl p-4 bg-white dark:bg-zinc-800 shadow-sm space-y-2"
                            >
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                    <Link
                                        href={`/checklist/${c.id}`}
                                        className="font-semibold text-green-700 hover:underline truncate text-base"
                                    >
                                        {c.pedido?.numero ?? "-"}
                                    </Link>
                                    <span
                                        className={`text-sm px-2 py-1 rounded-full font-semibold ${c.status === "PENDENTE"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                            : c.status === "APROVADO"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                            }`}
                                    >
                                        {c.status}
                                    </span>
                                </div>

                                <div className="text-base text-zinc-700 dark:text-zinc-300 truncate"> {/* maior */}
                                    Cliente: {c.pedido?.cliente ?? "-"}
                                </div>
                                <div className="text-base text-zinc-700 dark:text-zinc-300 truncate"> {/* maior */}
                                    Motorista: {c.motorista?.name ?? "-"}
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">{new Date(c.data).toLocaleDateString("pt-BR")}</div>

                                <div className="pt-2 flex justify-end">
                                    <Link href={`/checklist/${c.id}/edit`}>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                            Editar
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}