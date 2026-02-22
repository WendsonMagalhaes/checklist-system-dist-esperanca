import { prisma } from "@/lib/prisma";
import PedidoForm from "@/components/PedidoForm";

export default async function NovoPedidoPage() {
    const usuarios = await prisma.user.findMany({
        select: { id: true, name: true },
    });

    return (
        <div className="px-6 py-8 space-y-6">
            <h1 className="text-2xl font-bold">
                Novo Pedido
            </h1>

            <PedidoForm usuarios={usuarios} />
        </div>
    );
}
