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

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
        }

        const formData = await req.formData();
        const numero = formData.get("numero")?.toString();
        const cliente = formData.get("cliente")?.toString();
        const motoristaId = formData.get("motoristaId")?.toString();
        const ajudanteId = formData.get("ajudanteId")?.toString();
        const itens = formData.getAll("itens") as string[];
        const fotosFiles = formData.getAll("fotos") as File[];

        if (!numero || !motoristaId) {
            return NextResponse.json({ error: "Número do pedido e motorista são obrigatórios" }, { status: 400 });
        }

        // Verifica se pedido já existe
        let pedido = await prisma.pedido.findUnique({ where: { numero } });
        if (!pedido) {
            pedido = await prisma.pedido.create({
                data: { numero, cliente: cliente || "" },
            });
        }

        // Cria checklist
        const checklist = await prisma.checklist.create({
            data: {
                pedidoId: pedido.id,
                motoristaId,
                ajudanteId: ajudanteId || undefined,
                data: new Date(),
                itens: {
                    create: itens.map((i) => JSON.parse(i)),
                },
            },
        });

        // Upload fotos para Cloudinary
        const fotosPromises = fotosFiles.map(async (file) => {
            const blob = await file.arrayBuffer();
            const base64 = Buffer.from(blob).toString("base64");

            const uploadResponse = await cloudinary.uploader.upload(
                `data:${file.type};base64,${base64}`,
                { folder: "checklists" }
            );

            return prisma.fotoChecklist.create({
                data: { checklistId: checklist.id, url: uploadResponse.secure_url },
            });
        });

        await Promise.all(fotosPromises);

        return NextResponse.json({ success: true, checklistId: checklist.id });
    } catch (err) {
        console.error("Erro ao criar checklist:", err);
        return NextResponse.json({ error: "Erro ao criar checklist" }, { status: 500 });
    }
}