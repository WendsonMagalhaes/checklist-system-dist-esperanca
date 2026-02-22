// app/perfil/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, ArrowLeft, User, Mail, Shield, BadgeCheck, Calendar } from "lucide-react";
import Link from "next/link";

export default async function PerfilPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const user = session.user;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">

            {/* Cabeçalho */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                        Meu Perfil
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Visualize suas informações
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-green-600 transition text-sm"
                >
                    <ArrowLeft size={18} />
                    Voltar
                </Link>
            </div>

            {/* Card de Perfil */}
            <Card className="border-2 border-green-600 rounded-xl bg-white dark:bg-zinc-800 shadow-sm">
                <CardContent className="space-y-6 p-6">

                    {/* Dados principais */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">{user.name}</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                        </div>

                        <Link
                            href="/perfil/edit"
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                        >
                            <Pencil size={16} />
                            Editar Perfil
                        </Link>
                    </div>

                    {/* Grid de informações */}
                    <div className="grid gap-6 sm:grid-cols-2">

                        {/* Conta */}
                        <Card className="border border-green-500 rounded-xl p-4 bg-white dark:bg-zinc-800 shadow-sm">
                            <h3 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Conta
                            </h3>
                            <div className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                                <p><span className="font-medium">Nome:</span> {user.name}</p>
                                <p><span className="font-medium">Usuário:</span> {user.username}</p>
                                <p><span className="font-medium">Email:</span> {user.email}</p>
                            </div>
                        </Card>

                        {/* Status */}
                        <Card className="border border-green-500 rounded-xl p-4 bg-white dark:bg-zinc-800 shadow-sm">
                            <h3 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                                <BadgeCheck className="h-4 w-4" />
                                Status
                            </h3>
                            <div className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                                <p>
                                    <span className="font-medium">Conta:</span> {user.emailVerified ? "Verificada" : "Não verificada"}
                                </p>
                                <p>
                                    <span className="font-medium">Criado em:</span> {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </Card>

                        {/* Segurança */}
                        <Card className="border border-green-500 rounded-xl p-4 bg-white dark:bg-zinc-800 shadow-sm">
                            <h3 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Segurança
                            </h3>
                            <div className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                                <p>Sua conta está protegida.</p>
                            </div>
                            <Link href="/perfil/edit">
                                <button className="mt-2 w-full rounded-lg border border-green-500 px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition">
                                    Alterar senha
                                </button>
                            </Link>
                        </Card>

                        {/* Outras informações (opcional) */}
                        {user.role && (
                            <Card className="border border-green-500 rounded-xl p-4 bg-white dark:bg-zinc-800 shadow-sm">
                                <h3 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Perfil
                                </h3>
                                <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                                    <p><span className="font-medium">Função:</span> {user.role}</p>
                                    <p><span className="font-medium">Ativo:</span> {user.active ? "Sim" : "Não"}</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}