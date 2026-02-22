// app/usuarios/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role, User } from "@prisma/client";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UsuariosPage() {
    const session = await auth();

    if (!session?.user) redirect("/login");
    if (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPERVISOR) {
        redirect("/dashboard");
    }

    const usuarios = await prisma.user.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-white">
                    Usuários
                </h1>

                <Link
                    href="/usuarios/novo"
                    className="inline-flex justify-center items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-base md:text-lg font-medium hover:bg-green-700 transition"
                >
                    <Plus size={18} />
                    Novo Usuário
                </Link>
            </div>

            <Card className="border border-green-600 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Usuários Registrados</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* DESKTOP */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-base border-collapse">
                            <thead className="bg-green-50 dark:bg-green-900/20">
                                <tr>
                                    <th className="px-4 py-3 text-left text-zinc-700 dark:text-zinc-300">Nome</th>
                                    <th className="px-4 py-3 text-left text-zinc-700 dark:text-zinc-300">Usuário</th>
                                    <th className="px-4 py-3 text-left text-zinc-700 dark:text-zinc-300">Perfil</th>
                                    <th className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((user: User) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-zinc-700/50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium text-lg text-zinc-800 dark:text-white">
                                            <Link href={`/usuarios/${user.id}`} className="hover:underline text-green-700 truncate">
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-lg truncate">@{user.username}</td>
                                        <td className="px-4 py-3">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/usuarios/${user.id}/edit`}
                                                className="text-green-600 hover:text-green-700 transition flex justify-end items-center"
                                                title="Editar"
                                            >
                                                <Pencil size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {usuarios.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400 text-lg">
                                            Nenhum usuário encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE */}
                    <div className="md:hidden flex flex-col gap-4">
                        {usuarios.map((user: User) => (
                            <div
                                key={user.id}
                                className="border border-green-600 rounded-xl p-5 bg-white dark:bg-zinc-800 shadow-sm space-y-3"
                            >
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                    <div>
                                        <Link
                                            href={`/usuarios/${user.id}`}
                                            className="font-semibold text-green-700 hover:underline text-lg truncate"
                                        >
                                            {user.name}
                                        </Link>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>
                                    </div>
                                    <RoleBadge role={user.role} />
                                </div>

                                <div className="pt-2">
                                    <Link href={`/usuarios/${user.id}/edit`}>
                                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white text-base">
                                            Editar
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {usuarios.length === 0 && (
                            <p className="text-center text-zinc-500 dark:text-zinc-400 py-6 text-lg">
                                Nenhum usuário encontrado.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
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

    return <span className={`text-xs px-3 py-1 rounded-full font-semibold ${styles}`}>{role}</span>;
}