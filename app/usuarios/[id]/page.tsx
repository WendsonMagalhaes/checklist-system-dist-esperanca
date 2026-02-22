// app/usuarios/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Role } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

export default async function VisualizarUsuarioPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();

    if (!session?.user) redirect("/login");

    if (
        session.user.role !== Role.ADMIN &&
        session.user.role !== Role.SUPERVISOR
    ) {
        redirect("/dashboard");
    }

    const { id } = await params;

    if (!id) return notFound();

    const usuario = await prisma.user.findUnique({
        where: { id },
    });

    if (!usuario) return notFound();

    return (
        <div className="px-4 py-6 md:p-8 max-w-4xl mx-auto space-y-6">
            {/* Voltar */}
            <Link
                href="/usuarios"
                className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-green-600 transition text-sm"
            >
                <ArrowLeft size={18} />
                Voltar
            </Link>

            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm p-5 md:p-8 space-y-6">

                {/* Cabeçalho */}
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-white">
                            {usuario.name}
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            @{usuario.username}
                        </p>
                    </div>

                    <RoleBadge role={usuario.role} />
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700" />

                {/* Informações */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Info label="Email" value={usuario.email} />
                    <Info label="Perfil" value={usuario.role} />
                    <Info
                        label="Status"
                        value={usuario.active ? "Ativo" : "Inativo"}
                    />
                    <Info
                        label="Criado em"
                        value={usuario.createdAt.toLocaleDateString("pt-BR")}
                    />
                </div>

                {/* Botão */}
                <div className="pt-2">
                    <Link
                        href={`/usuarios/${usuario.id}/edit`}
                        className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-4 py-3 md:py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                    >
                        <Pencil size={16} />
                        Editar usuário
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col">
            <span className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {label}
            </span>
            <span className="mt-1 font-medium text-zinc-800 dark:text-white text-sm">
                {value}
            </span>
        </div>
    );
}

function RoleBadge({ role }: { role: Role }) {
    const styles =
        role === Role.ADMIN
            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            : role === Role.SUPERVISOR
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";

    return (
        <span
            className={`self-start md:self-auto text-xs px-3 py-1 rounded-full font-semibold ${styles}`}
        >
            {role}
        </span>
    );
}