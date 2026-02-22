import { prisma } from "@/lib/prisma";
import ChecklistForm from "@/components/ChecklistForm";

export default async function NovoChecklistPage() {
    const motoristas = await prisma.user.findMany({
        where: { role: "MOTORISTA", active: true },
        select: { id: true, name: true },
    });

    const ajudantes = await prisma.user.findMany({
        where: { role: "AJUDANTE", active: true },
        select: { id: true, name: true },
    });

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Novo Checklist</h1>

            <ChecklistForm
                motoristas={motoristas}
                ajudantes={ajudantes}
            />
        </div>
    );
}
