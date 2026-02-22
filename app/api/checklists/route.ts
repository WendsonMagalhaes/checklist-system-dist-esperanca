import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

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

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
        }

        const { pedido, fotoFile, ajudante, observacao } = await req.json();

        if (!pedido) {
            return NextResponse.json({ error: "Pedido é obrigatório" }, { status: 400 });
        }

        let fotoUrl: string | undefined;

        // upload para Cloudinary se base64 existir
        if (fotoFile) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(
                    `data:image/jpeg;base64,${fotoFile}`,
                    { folder: "checklists" }
                );
                fotoUrl = uploadResponse.secure_url;
            } catch (err) {
                console.error("Erro ao enviar foto para Cloudinary:", err);
                return NextResponse.json({ error: "Erro ao enviar foto" }, { status: 500 });
            }
        }

        // cria checklist no banco
        const checklist = await prisma.checklist.create({
            data: {
                pedidoId: pedido, // passa direto o ID
                motoristaId: session.user.id, // obrigatório
                ajudanteId: ajudante || null, // opcional
                observacao,
                data: new Date(),
                responsavelId: null, // opcional, se quiser conectar depois
            },
        });

        // se houver foto, cria registro em FotoChecklist
        if (fotoUrl) {
            await prisma.fotoChecklist.create({
                data: {
                    checklistId: checklist.id,
                    url: fotoUrl,
                },
            });
        }

        return NextResponse.json({ success: true, checklist });
    } catch (error) {
        console.error("Erro ao criar checklist:", error);
        return NextResponse.json({ error: "Erro ao criar checklist" }, { status: 500 });
    }
}