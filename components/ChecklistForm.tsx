"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Camera, ImagePlus, Upload, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Usuario = {
    id: string;
    name: string;
};

type ChecklistItem = {
    descricao: string;
    marcado: boolean;
};

type DefaultValues = {
    id?: string;
    numero?: string;
    cliente?: string;
    motoristaId?: string;
    ajudanteId?: string;
    itens?: ChecklistItem[];
    fotos?: string[];
};

type Props = {
    motoristas: Usuario[];
    ajudantes: Usuario[];
    defaultValues?: DefaultValues;
    isEdit?: boolean;
};

const ITENS_FIXOS = [
    "Caixas lacradas",
    "Quantidade conferida",
    "Produto sem avarias",
    "Nota fiscal anexada",
];

export default function ChecklistForm({
    motoristas = [],
    ajudantes = [],
    defaultValues,
    isEdit = false,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [numeroPedido, setNumeroPedido] = useState(
        defaultValues?.numero ?? ""
    );

    const [cliente, setCliente] = useState(
        defaultValues?.cliente ?? ""
    );

    const [motoristaId, setMotoristaId] = useState(
        defaultValues?.motoristaId ?? ""
    );

    const [ajudanteId, setAjudanteId] = useState(
        defaultValues?.ajudanteId ?? ""
    );
    const [itensMarcados, setItensMarcados] = useState<string[]>([]);
    const [fotos, setFotos] = useState<File[]>([]);
    const [previewFotos, setPreviewFotos] = useState<string[]>([]);

    // 🔥 CARREGAR DADOS PARA EDIÇÃO
    // 🔥 CARREGAR DADOS PARA EDIÇÃO
    useEffect(() => {
        if (!defaultValues) return;

        // ✅ Itens marcados
        if (defaultValues.itens) {
            const marcados = defaultValues.itens
                .filter((item) => item.marcado)
                .map((item) => item.descricao);

            setItensMarcados(marcados);
        }

        // ✅ Fotos existentes
        if (defaultValues.fotos && defaultValues.fotos.length > 0) {
            setPreviewFotos(defaultValues.fotos);
            // Se quiser, você pode inicializar fotos como File[], mas geralmente para imagens já existentes, mantemos só o preview
            // setFotos([]); // opcional
        }
    }, [defaultValues]);

    function toggleItem(item: string) {
        setItensMarcados((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
        );
    }

    function adicionarFotos(files: FileList | null) {
        if (!files) return;

        const novosArquivos = Array.from(files);

        // adiciona aos arquivos existentes
        setFotos((prev) => [...prev, ...novosArquivos]);

        // cria preview para todos
        const novosPreviews = novosArquivos.map((file) =>
            URL.createObjectURL(file)
        );

        setPreviewFotos((prev) => [...prev, ...novosPreviews]);
    }

    function removerFoto(index: number) {
        setFotos((prev) => prev.filter((_, i) => i !== index));
        setPreviewFotos((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("motoristaId", motoristaId);
            formData.append("ajudanteId", ajudanteId);
            formData.append("numero", numeroPedido);
            formData.append("cliente", cliente);


            // Adiciona os itens fixos com estado marcado
            ITENS_FIXOS.forEach((item) => {
                formData.append(
                    "itens",
                    JSON.stringify({
                        descricao: item,
                        marcado: itensMarcados.includes(item),
                    })
                );
            });

            // Adiciona novas fotos (File)
            fotos.forEach((foto) => formData.append("fotos", foto));

            // Adiciona URLs das fotos que devem permanecer
            previewFotos.forEach((url) =>
                formData.append("fotosExistentes", url)
            );

            const url = isEdit
                ? `/api/checklists/${defaultValues?.id}`
                : "/api/checklists";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, { method, body: formData });

            if (!res.ok) throw new Error("Erro ao salvar checklist");

            router.push("/checklist");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <LoadingOverlay
                show={loading}
                text={isEdit ? "Atualizando checklist..." : "Criando checklist..."}
            />
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">

                {/* DADOS DO PEDIDO */}
                <Card className="border border-green-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Dados do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Número do Pedido *</Label>
                            <Input
                                required
                                value={numeroPedido}
                                onChange={(e) => setNumeroPedido(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Cliente</Label>
                            <Input
                                value={cliente}
                                onChange={(e) => setCliente(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* EQUIPE */}
                <Card className="border border-green-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Equipe</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <Select
                            value={motoristaId || ""}
                            onValueChange={(value) => setMotoristaId(String(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o motorista" />
                            </SelectTrigger>
                            <SelectContent>
                                {motoristas.map((m) => (
                                    <SelectItem
                                        key={m.id}
                                        value={m.id}
                                        className="
        hover:bg-green-600
        hover:text-white
        focus:bg-green-600
        focus:text-white
        data-[state=checked]:bg-green-700
        data-[state=checked]:text-white
        transition-colors
    ">
                                        {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={ajudanteId || ""}
                            onValueChange={(value) => setAjudanteId(String(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o ajudante" />
                            </SelectTrigger>
                            <SelectContent>
                                {ajudantes.map((a) => (
                                    <SelectItem
                                        key={a.id}
                                        value={a.id}
                                        className="
        hover:bg-green-600
        hover:text-white
        focus:bg-green-600
        focus:text-white
        data-[state=checked]:bg-green-700
        data-[state=checked]:text-white
        transition-colors
    ">
                                        {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </CardContent>
                </Card>

                {/* CHECKLIST */}
                <Card className="border border-green-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Checklist da Mercadoria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ITENS_FIXOS.map((item) => (
                            <div key={item} className="flex items-center space-x-3">
                                <Checkbox
                                    checked={itensMarcados.includes(item)}
                                    onCheckedChange={() => toggleItem(item)}
                                />
                                <Label>{item}</Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                {/* FOTOS */}
                <Card className="border border-green-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Fotos da Entrega</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        {/* MOBILE */}
                        <div className="flex gap-3 flex-wrap md:hidden">

                            {/* Botão Câmera */}
                            <label className="flex items-center gap-2 cursor-pointer bg-green-600/90 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded-xl text-sm shadow-sm">
                                <Camera size={18} />
                                Tirar Foto
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={(e) => adicionarFotos(e.target.files)}
                                />
                            </label>

                            {/* Botão Galeria */}
                            <label className="flex items-center gap-2 cursor-pointer bg-gray-600 hover:bg-gray-700 transition-colors text-white px-4 py-2 rounded-xl text-sm shadow-sm">
                                <ImagePlus size={18} />
                                Galeria
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => adicionarFotos(e.target.files)}
                                />
                            </label>

                        </div>

                        {/* DESKTOP */}
                        <div className="hidden md:flex">
                            <label className="flex items-center gap-2 cursor-pointer bg-green-600/90 hover:bg-green-600 transition-colors text-white px-5 py-2.5 rounded-xl text-sm shadow-sm">
                                <Upload size={18} />
                                Adicionar Imagens
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => adicionarFotos(e.target.files)}
                                />
                            </label>
                        </div>

                        {/* Preview */}
                        {previewFotos.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {previewFotos.map((src, index) => (
                                    <div
                                        key={index}
                                        className="relative rounded-xl overflow-hidden group"
                                    >
                                        <img
                                            src={src}
                                            alt="preview"
                                            className="object-cover h-28 w-full"
                                        />

                                        {/* Botão estilizado */}
                                        <button
                                            type="button"
                                            onClick={() => removerFoto(index)}
                                            className="
                        absolute top-0.5 right-0.5
                        bg-emerald-500/90
                        hover:bg-red-400
                        text-white
                        rounded-full
                        p-1.5
                        shadow-md
                        transition-all
                        duration-200
                        hover:scale-110
                        active:scale-95
                        backdrop-blur-sm
                    "
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </CardContent>
                </Card>
                <div className="lg:col-span-2">
                    <Button type="submit" className="w-full bg-green-700 text-white">
                        {isEdit ? "Atualizar Checklist" : "Criar Checklist"}
                    </Button>
                </div>
            </form>
        </>
    );
}