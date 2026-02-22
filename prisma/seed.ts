import { PrismaClient, Role, StatusPedido, StatusChecklist } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed...");

    const hashedPassword = await bcrypt.hash("123456", 10);

    //
    // 1️⃣ USUÁRIOS
    //
    const usersData = [
        { name: "Administrador", email: "admin@empresa.com", username: "admin", role: Role.ADMIN },
        { name: "Supervisor Teste", email: "supervisor@empresa.com", username: "supervisor1", role: Role.SUPERVISOR },
        { name: "Supervisor Maria", email: "supervisor2@empresa.com", username: "supervisor2", role: Role.SUPERVISOR },
        { name: "Motorista João", email: "motorista1@empresa.com", username: "motorista1", role: Role.MOTORISTA },
        { name: "Motorista Pedro", email: "motorista2@empresa.com", username: "motorista2", role: Role.MOTORISTA },
        { name: "Ajudante Carlos", email: "ajudante1@empresa.com", username: "ajudante1", role: Role.AJUDANTE },
        { name: "Ajudante Lucas", email: "ajudante2@empresa.com", username: "ajudante2", role: Role.AJUDANTE },
    ];

    const createdUsers: any = {};

    for (const user of usersData) {
        const created = await prisma.user.upsert({
            where: { username: user.username },
            update: {},
            create: {
                ...user,
                password: hashedPassword,
                active: true,
            },
        });

        createdUsers[user.username] = created;
        console.log(`✅ ${user.username} pronto`);
    }

    //
    // 2️⃣ PEDIDOS
    //
    const pedidosData = [
        { numero: "PED-001", cliente: "Cliente Exemplo LTDA" },
        { numero: "PED-002", cliente: "Transportes Brasil" },
        { numero: "PED-003", cliente: "Logística XPTO" },
    ];

    const createdPedidos: any = {};

    for (const pedido of pedidosData) {
        const created = await prisma.pedido.upsert({
            where: { numero: pedido.numero },
            update: {},
            create: {
                ...pedido,
                status: StatusPedido.AGUARDANDO_CONFERENCIA,
            },
        });

        createdPedidos[pedido.numero] = created;
        console.log(`✅ Pedido ${pedido.numero} criado`);
    }

    //
    // 3️⃣ CHECKLISTS DIFERENTES
    //

    // 🔹 Checklist 1 - Pendente
    const checklist1 = await prisma.checklist.upsert({
        where: { pedidoId: createdPedidos["PED-001"].id },
        update: {},
        create: {
            pedidoId: createdPedidos["PED-001"].id,
            data: new Date(),
            status: StatusChecklist.PENDENTE,
            motoristaId: createdUsers["motorista1"].id,
            ajudanteId: createdUsers["ajudante1"].id,
            responsavelId: createdUsers["supervisor1"].id,
            observacao: "Carga aguardando conferência final.",
        },
    });

    // 🔹 Checklist 2 - Alguns itens marcados
    const checklist2 = await prisma.checklist.upsert({
        where: { pedidoId: createdPedidos["PED-002"].id },
        update: {},
        create: {
            pedidoId: createdPedidos["PED-002"].id,
            data: new Date(),
            status: StatusChecklist.PENDENTE,
            motoristaId: createdUsers["motorista2"].id,
            ajudanteId: createdUsers["ajudante2"].id,
            responsavelId: createdUsers["supervisor2"].id,
            observacao: "Verificar quantidade de volumes.",
        },
    });

    // 🔹 Checklist 3 - Concluído
    const checklist3 = await prisma.checklist.upsert({
        where: { pedidoId: createdPedidos["PED-003"].id },
        update: {},
        create: {
            pedidoId: createdPedidos["PED-003"].id,
            data: new Date(),
            status: StatusChecklist.APROVADO,
            motoristaId: createdUsers["motorista1"].id,
            ajudanteId: createdUsers["ajudante2"].id,
            responsavelId: createdUsers["supervisor1"].id,
            observacao: "Checklist finalizado sem divergências.",
        },
    });

    console.log("✅ Checklists criados");

    //
    // 4️⃣ ITENS DO CHECKLIST
    //
    const itensPadrao = [
        "Caixas lacradas",
        "Quantidade conferida",
        "Produto sem avarias",
        "Nota fiscal anexada",
    ];

    for (const checklist of [checklist1, checklist2, checklist3]) {
        for (const descricao of itensPadrao) {
            await prisma.checklistItem.create({
                data: {
                    checklistId: checklist.id,
                    descricao,
                    marcado: checklist.id === checklist2.id ? Math.random() > 0.5 : checklist.id === checklist3.id,
                },
            });
        }
    }

    console.log("✅ Itens criados");
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