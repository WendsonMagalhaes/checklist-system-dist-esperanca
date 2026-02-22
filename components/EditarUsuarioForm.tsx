"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

type Usuario = {
    id: string;
    name: string;
    email: string;
    role: string;
    ativo: boolean;
};

type Props = {
    defaultValues: Usuario;
};

export default function UserEditForm({ defaultValues }: Props) {
    const router = useRouter();

    if (!defaultValues) return null; // 🔥 proteção extra

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(defaultValues?.name ?? "");
    const [email, setEmail] = useState(defaultValues?.email ?? "");
    const [role, setRole] = useState(defaultValues?.role ?? "USER");
    const [ativo, setAtivo] = useState(
        defaultValues?.ativo ? "true" : "false"
    );



    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch(`/api/usuarios/${defaultValues.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    role,
                    ativo: ativo === "true",
                }),
            });

            if (res.ok) {
                router.push(`/usuarios/${defaultValues.id}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <LoadingOverlay show={loading} text="Atualizando usuário..." />

            <form
                onSubmit={handleSubmit}
                className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-2"
            >
                {/* DADOS PESSOAIS */}
                <Card className="border border-emerald-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <Label>Nome *</Label>
                            <Input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Email *</Label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* PERMISSÕES */}
                <Card className="border border-emerald-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Permissões e Status</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <Label>Função</Label>
                            <Select value={role} onValueChange={(value) => setRole(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a função" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="ADMIN"
                                        className="hover:bg-emerald-600 hover:text-white focus:bg-emerald-600 focus:text-white"
                                    >
                                        Administrador
                                    </SelectItem>
                                    <SelectItem
                                        value="USER"
                                        className="hover:bg-emerald-600 hover:text-white focus:bg-emerald-600 focus:text-white"
                                    >
                                        Usuário
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select value={ativo} onValueChange={(value) => setAtivo(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="true"
                                        className="hover:bg-emerald-600 hover:text-white focus:bg-emerald-600 focus:text-white"
                                    >
                                        Ativo
                                    </SelectItem>
                                    <SelectItem
                                        value="false"
                                        className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                                    >
                                        Inativo
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* AÇÕES */}
                <div className="lg:col-span-2 flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        className="w-full bg-emerald-700 text-white hover:bg-emerald-800"
                    >
                        Salvar Alterações
                    </Button>
                </div>
            </form>
        </>
    );
}