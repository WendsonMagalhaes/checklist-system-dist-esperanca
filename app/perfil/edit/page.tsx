import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditarPerfilForm from "@/components/EditarPerfilForm";

export default async function EditarPerfilPage() {
    const session = await auth();

    if (!session?.user) redirect("/login");

    const user = session.user;

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                Editar Perfil
            </h1>
            <EditarPerfilForm user={user} />
        </div>
    );
}