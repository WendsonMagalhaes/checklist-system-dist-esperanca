import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed...");

    const hashedPassword = await bcrypt.hash("123456", 10);

    // ADMIN
    const adminExists = await prisma.user.findUnique({
        where: { username: "admin" },
    });

    if (!adminExists) {
        await prisma.user.create({
            data: {
                name: "Administrador",
                email: "admin@empresa.com",
                username: "admin",
                password: hashedPassword,
                role: Role.ADMIN,
                active: true,
            },
        });

        console.log("✅ Admin criado");
    } else {
        console.log("ℹ️ Admin já existe");
    }

    // MOTORISTA TESTE
    const motoristaExists = await prisma.user.findUnique({
        where: { username: "motorista1" },
    });

    if (!motoristaExists) {
        await prisma.user.create({
            data: {
                name: "Motorista Teste",
                email: "motorista@empresa.com",
                username: "motorista1",
                password: hashedPassword,
                role: Role.MOTORISTA,
                active: true,
            },
        });

        console.log("✅ Motorista criado");
    } else {
        console.log("ℹ️ Motorista já existe");
    }

    console.log("🎉 Seed finalizado com sucesso!");
}

main()
    .catch((e) => {
        console.error("❌ Erro no seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
