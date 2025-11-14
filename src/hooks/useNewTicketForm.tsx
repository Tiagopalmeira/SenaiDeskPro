import { useState } from 'react';

export interface TicketFormData {
  solicitante: string;
  matricula: string;
  cargo: string;
  local: string;
  subLocal: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  imagem?: File | null;
  dataAbertura: string;
  horaAbertura: string;
}

export function useNewTicketForm(
  userName: string,
  userMatricula: string,
  userCargo: string
) {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const [formData, setFormData] = useState<TicketFormData>({
    solicitante: userName,
    matricula: userMatricula,
    cargo: userCargo,
    local: '',
    subLocal: '',
    descricao: '',
    categoria: '',
    prioridade: '',
    imagem: null,
    dataAbertura: currentDate,
    horaAbertura: currentTime,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (field: keyof TicketFormData, value: string) => {
    setFormData((prev) => {
      if (field === 'local') {
        return { ...prev, [field]: value, subLocal: '' };
      }
      return { ...prev, [field]: value };
    });
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
    if (!formData.local) newErrors.local = true;
    if (!formData.subLocal) newErrors.subLocal = true;
    if (!formData.categoria) newErrors.categoria = true;
    if (!formData.prioridade) newErrors.prioridade = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    setFormData({
      solicitante: userName,
      matricula: userMatricula,
      cargo: userCargo,
      local: '',
      subLocal: '',
      descricao: '',
      categoria: '',
      prioridade: '',
      imagem: null,
      dataAbertura: currentDate,
      horaAbertura: currentTime,
    });
    setErrors({});
    setImagePreview(null);
  };

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

