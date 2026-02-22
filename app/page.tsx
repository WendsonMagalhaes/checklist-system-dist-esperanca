import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ClipboardList } from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-8">
        Bem-vindo, {session.user?.name}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <Link
          href="/dashboard"
          className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800
                     bg-white dark:bg-zinc-900
                     hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <LayoutDashboard size={22} className="text-green-600" />
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Dashboard
            </h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Visualize indicadores e andamento dos pedidos.
          </p>
        </Link>

        <Link
          href="/pedidos"
          className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800
                     bg-white dark:bg-zinc-900
                     hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList size={22} className="text-green-600" />
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Pedidos
            </h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gerencie e acompanhe os pedidos operacionais.
          </p>
        </Link>

      </div>
    </div>
  );
}
