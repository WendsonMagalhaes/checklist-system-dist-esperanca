// app/usuarios/[id]/edit/page.tsx

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt";
import { ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session?.user) redirect("/login");

    if (
        session.user.role !== Role.ADMIN &&
        session.user.role !== Role.SUPERVISOR
    ) {
        redirect("/dashboard");
    }

    // ✅ Aqui fazemos o "unwrap" da promise
    const { id } = await params;

    if (!id) return notFound();

    const usuario = await prisma.user.findUnique({
        where: { id },
    });

    if (!usuario) return notFound();

    async function atualizarUsuario(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as Role;

        if (!name || !username || !email || !role) return;

        const dadosAtualizados: any = { name, username, email, role };

        if (password) {
            dadosAtualizados.password = await hash(password, 10);
        }

        await prisma.user.update({
            where: { id },
            data: dadosAtualizados,
        });

        revalidatePath("/usuarios");
        redirect("/usuarios");
    }

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-white">
                    Editar Usuário
                </h1>

                <Link
                    href="/usuarios"
                    className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-green-600 transition text-sm"
                >
                    <ArrowLeft size={18} />
                    Voltar
                </Link>
            </div>

            {/* Card principal */}
            <div className="w-full p-4 md:p-6 border-2 border-green-600 rounded-xl bg-white dark:bg-zinc-800 space-y-6">
                <form action={atualizarUsuario} className="flex flex-col gap-6">
                    {/* Linha 1 */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <InputGreen label="Nome completo" name="name" defaultValue={usuario.name} />
                        <InputGreen label="Usuário" name="username" defaultValue={usuario.username} />
                    </div>

                    {/* Linha 2 */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <InputGreen label="Email" name="email" type="email" defaultValue={usuario.email} />
                        <InputGreen label="Senha (opcional)" name="password" type="password" placeholder="Digite para alterar" />
                    </div>

                    {/* Perfil */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                            Perfil
                        </label>

                        <Select name="role" defaultValue={usuario.role}>
                            <SelectTrigger className="w-full border-2 border-green-600">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={Role.ADMIN}>ADMIN</SelectItem>
                                <SelectItem value={Role.SUPERVISOR}>SUPERVISOR</SelectItem>
                                <SelectItem value={Role.USER}>USER</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Botão Atualizar */}
                    <div className="flex justify-end">
                        <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700" type="submit">
                            Atualizar Usuário
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Input verde responsivo
function InputGreen({
    label,
    name,
    type = "text",
    defaultValue,
    placeholder,
}: {
    label: string;
    name: string;
    type?: string;
    defaultValue?: string;
    placeholder?: string;
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {label}
            </label>
            <Input
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="w-full border-2 border-green-600 focus:ring-2 focus:ring-green-600"
            />
        </div>
    );
}