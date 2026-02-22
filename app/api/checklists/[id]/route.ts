import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configuração Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        if (!id)
            return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

        const session = await auth();
        if (!session?.user?.id)
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        const formData = await req.formData();
        const motoristaId = formData.get("motoristaId")?.toString();
        const ajudanteId = formData.get("ajudanteId")?.toString();
        const itens = formData.getAll("itens") as string[];
        const fotosFiles = formData.getAll("fotos") as File[];
        const fotosExistentes = formData.getAll("fotosExistentes") as string[];
        const numero = formData.get("numero")?.toString();
        const cliente = formData.get("cliente")?.toString();

        if (!motoristaId)
            return NextResponse.json({ error: "Motorista obrigatório" }, { status: 400 });

        // 1️⃣ Busca checklist com pedido
        const checklistExistente = await prisma.checklist.findUnique({
            where: { id },
            include: { pedido: true },
        });
        if (!checklistExistente)
            return NextResponse.json({ error: "Checklist não encontrado" }, { status: 404 });

        // 2️⃣ Atualiza checklist (motorista, ajudante e itens)
        await prisma.checklist.update({
            where: { id },
            data: {
                motoristaId,
                ajudanteId: ajudanteId || null,
                itens: {
                    deleteMany: {},
                    create: itens.map((i) => JSON.parse(i)),
                },
            },
        });

        // 3️⃣ Atualiza pedido (numero e cliente)
        await prisma.pedido.update({
            where: { id: checklistExistente.pedidoId },
            data: {
                numero: numero ?? checklistExistente.pedido.numero,
                cliente: cliente ?? checklistExistente.pedido.cliente,
            },
        });

        // 4️⃣ Remove fotos deletadas
        await prisma.fotoChecklist.deleteMany({
            where: {
                checklistId: checklistExistente.id,
                url: { notIn: fotosExistentes },
            },
        });

        // 5️⃣ Adiciona fotos novas
        if (fotosFiles.length > 0) {
            const uploadPromises = fotosFiles.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString("base64");
                const uploadResponse = await cloudinary.uploader.upload(
                    `data:${file.type};base64,${base64}`,
                    { folder: "checklists" }
                );

                return prisma.fotoChecklist.create({
                    data: { checklistId: checklistExistente.id, url: uploadResponse.secure_url },
                });
            });

            await Promise.all(uploadPromises);
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Erro ao atualizar checklist:", err);
        return NextResponse.json({ error: "Erro ao atualizar checklist" }, { status: 500 });
    }
}

// DELETE — deletar checklist
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> } // OBS: params é Promise
) {
    try {
        const session = await auth();
        if (!session?.user?.id)
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        // 🔥 AQUI: desestrutura depois de await
        const { id } = await context.params;

        if (!id)
            return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

        // ✅ Deleta o checklist
        await prisma.checklist.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Erro ao deletar checklist:", err);
        return NextResponse.json({ error: "Erro ao deletar checklist" }, { status: 500 });
    }
}