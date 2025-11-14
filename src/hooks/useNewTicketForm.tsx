import { useEffect, useState } from "react";

export interface TicketFormData {
    solicitante: string;
    matricula: string;
    cargo: string;
    localId: string;
    tipoSolicitacaoId: string;
    cursoId?: string;
    descricao: string;
    prioridade: string;
    imagem?: File | null;
    dataAbertura: string;
    horaAbertura: string;
}

export function useNewTicketForm(userName: string, userMatricula: string, userCargo: string) {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    const [formData, setFormData] = useState<TicketFormData>({
        solicitante: userName,
        matricula: userMatricula,
        cargo: userCargo,
        localId: "",
        tipoSolicitacaoId: "",
        cursoId: "",
        descricao: "",
        prioridade: "",
        imagem: null,
        dataAbertura: currentDate,
        horaAbertura: currentTime,
    });

    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleChange = (field: keyof TicketFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (file: File | null) => {
        if (file) {
            setFormData((prev) => ({ ...prev, imagem: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, imagem: null }));
        setImagePreview(null);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, boolean> = {};

        if (!formData.descricao.trim()) newErrors.descricao = true;
        if (!formData.localId) newErrors.localId = true;
        if (!formData.tipoSolicitacaoId) newErrors.tipoSolicitacaoId = true;
        if (!formData.prioridade) newErrors.prioridade = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const reset = () => {
        const now = new Date();
        const currentDate = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().slice(0, 5);

        setFormData({
            solicitante: userName,
            matricula: userMatricula,
            cargo: userCargo,
            localId: "",
            tipoSolicitacaoId: "",
            cursoId: "",
            descricao: "",
            prioridade: "",
            imagem: null,
            dataAbertura: currentDate,
            horaAbertura: currentTime,
        });
        setErrors({});
        setImagePreview(null);
    };

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setFormData((prev) => {
                if (prev.solicitante === userName && prev.matricula === userMatricula && prev.cargo === userCargo) {
                    return prev;
                }

                return {
                    ...prev,
                    solicitante: userName,
                    matricula: userMatricula,
                    cargo: userCargo,
                };
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [userName, userMatricula, userCargo]);

    return {
        formData,
        errors,
        imagePreview,
        handleChange,
        handleImageChange,
        removeImage,
        validate,
        reset,
    };
}
