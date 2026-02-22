import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusPedido } from "@prisma/client";
import { Card } from "@/components/Card";
import { Pedido } from "@prisma/client";


export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // 🔹 Buscar métricas
    const totalPedidos = await prisma.pedido.count();

    const pedidosPendentes = await prisma.pedido.count({
        where: { status: StatusPedido.AGUARDANDO_CONFERENCIA },
    });

    const pedidosEmAndamento = await prisma.pedido.count({
        where: {
            status: StatusPedido.EM_CONFERENCIA
        },
    });

    const pedidosConferidos = await prisma.pedido.count({
        where: { status: StatusPedido.CONFERIDO },
    });
    const pedidosFinalizados = await prisma.pedido.count({
        where: { status: StatusPedido.CARREGADO },
    });
    const ultimosPedidos = await prisma.pedido.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return (
        <div className="px-6 py-8 space-y-8">
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                Dashboard
            </h1>

            {/* Cards */}
            <div className="grid gap-6 md:grid-cols-5">
                <Card title="Total de Pedidos" value={totalPedidos as number} />
                <Card title="Pendentes" value={pedidosPendentes as number} />
                <Card title="Em Andamento" value={pedidosEmAndamento as number} />
                <Card title="Conferidos" value={pedidosConferidos as number} />
                <Card title="Finalizados" value={pedidosFinalizados as number} />
            </div>

            {/* Últimos pedidos */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">
                    Últimos Pedidos
                </h2>

                <div className="space-y-3">
                    {ultimosPedidos.map((pedido: Pedido) => (
                        <div
                            key={pedido.id}
                            className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2"
                        >
                            <span className="text-sm text-zinc-600 dark:text-zinc-300">
                                {pedido.numero}
                            </span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-300">
                                {pedido.cliente}
                            </span>

                            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                {pedido.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
