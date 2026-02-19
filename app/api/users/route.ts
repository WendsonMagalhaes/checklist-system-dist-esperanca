import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                role: true,
                active: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        return NextResponse.json(
            { success: false, message: "Erro ao listar usuários" },
            { status: 500 }
        );
    }
}
