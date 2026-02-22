// app/checklist/[id]/edit/page.tsx

import { prisma } from "@/lib/prisma";
import ChecklistForm from "@/components/ChecklistForm";
import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { Checklist, FotoChecklist } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditChecklistPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // 🔥 DESENROLAR A PROMISE
    const { id } = await params;

    // ✅ Busca checklist com relações válidas e dados do pedido via select
    const checklist = await prisma.checklist.findUnique({
        where: { id },
        include: {
            motorista: true,
            ajudante: true,
            responsavel: true,
            itens: true,
            fotos: true,
        },
    });

    if (!checklist) return notFound();

    // Busca o pedido separadamente para pegar numero e cliente
    const pedido = await prisma.pedido.findUnique({
        where: { id: checklist.pedidoId },
        select: {
            numero: true,
            cliente: true,
        },
    });

    const motoristas = await prisma.user.findMany({
        where: {
            OR: [
                { role: Role.MOTORISTA },
                ...(checklist.motoristaId ? [{ id: checklist.motoristaId }] : []),
            ],
        },
    });

    const ajudantes = await prisma.user.findMany({
        where: {
            OR: [
                { role: Role.AJUDANTE },
                ...(checklist.ajudanteId ? [{ id: checklist.ajudanteId }] : []),
            ],
        },
    });


    const defaultValues = {
        id: checklist.id,
        numero: pedido?.numero || "",
        cliente: pedido?.cliente || "",
        motoristaId: checklist.motoristaId || "",
        ajudanteId: checklist.ajudanteId || "",
        itens: checklist.itens || [],
        fotos: checklist.fotos?.map((f: FotoChecklist) => f.url) || [],
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Editar Checklist: {pedido?.numero || checklist.id}
                </h1>

                <Link
                    href="/checklist"
                    className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-green-600 transition text-sm"
                >
                    <ArrowLeft size={18} />
                    Voltar
                </Link>
            </div>
            <ChecklistForm
                motoristas={motoristas}
                ajudantes={ajudantes}
                defaultValues={defaultValues}
                isEdit
            />
        </div>
    );
}