// app/checklist/[id]/edit/page.tsx

import { prisma } from "@/lib/prisma";
import ChecklistForm from "@/components/ChecklistForm";
import { notFound } from "next/navigation";
import { Role } from "@prisma/client";

export default async function EditChecklistPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    // 🔥 DESENROLAR A PROMISE
    const { id } = await params;

    const checklist = await prisma.checklist.findUnique({
        where: {
            id, // ✅ agora não é undefined
        },
        include: {
            pedido: true,
            motorista: true,
            ajudante: true,
            itens: true,
            fotos: true,
        },
    });

    if (!checklist) return notFound();

    const motoristas = await prisma.user.findMany({
        where: {
            OR: [
                { role: Role.MOTORISTA },
                { id: checklist.motoristaId ?? undefined },
            ],
        },
    });

    const ajudantes = await prisma.user.findMany({
        where: {
            OR: [
                { role: Role.AJUDANTE },
                { id: checklist.ajudanteId ?? undefined },
            ],
        },
    });
    const defaultValues = {
        id: checklist.id,
        numero: checklist.pedido?.numero || "",
        cliente: checklist.pedido?.cliente || "",
        motoristaId: checklist.motoristaId || "",
        ajudanteId: checklist.ajudanteId || "",
        itens: checklist.itens || [],
        fotos: checklist.fotos?.map((f) => f.url) || [],
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                Editar Checklist: {checklist.pedido?.numero || checklist.id}
            </h1>

            <ChecklistForm
                motoristas={motoristas}
                ajudantes={ajudantes}
                defaultValues={defaultValues}
                isEdit
            />
        </div>
    );
}