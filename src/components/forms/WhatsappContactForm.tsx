'use client';

import { useState } from 'react';
import { z } from 'zod';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea'; 
import { Button } from '@/components/ui/Button';

const whatsappSchema = z.object({
  name: z.string().min(3, 'O nome completo é obrigatório.'),
  company: z.string().min(2, 'O nome da empresa é obrigatório.'),
  cnpj: z.string().refine((val) => val === '' || val.length >= 14, {
    message: 'Insira um CNPJ válido.',
  }),
  message: z.string().min(10, 'A mensagem deve conter pelo menos 10 caracteres.'),
});

type FormErrors = z.inferFlattenedErrors<typeof whatsappSchema>['fieldErrors'];

type WhatsAppFormData = z.infer<typeof whatsappSchema>;

export default function WhatsAppContactForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({}); 
  
  const [formData, setFormData] = useState<WhatsAppFormData>({
    name: '',
    company: '',
    cnpj: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = whatsappSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return; 
    }

    setErrors({});
    setLoading(true);

    try {
      const cnpjLine = formData.cnpj ? `*CNPJ:* ${formData.cnpj}\n` : '';

      const textToSend = `*Nome:* ${formData.name}\n*Empresa:* ${formData.company}\n${cnpjLine}\n\n*Mensagem:* ${formData.message}`;
        
      const encodedMessage = encodeURIComponent(textToSend);
       
      const WHATSAPP_NUMBER = "551151943960"; 
      
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      // setFormData({ name: '', company: '', cnpj: '', message: '' });
      
    } catch (error) {
      console.error("Erro ao redirecionar para o WhatsApp", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full mx-auto" noValidate>
      
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-100 border-b border-slate-700/50 pb-2 tracking-wide">
          Fale Conosco via WhatsApp
        </h2>
        
        <Input 
          label="Nome Completo" 
          name="name" 
          type="text" 
          value={formData.name} 
          onChange={handleInputChange} 
          error={errors.name?.[0]} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
          <Input 
            label="Empresa" 
            name="company" 
            type="text" 
            value={formData.company} 
            onChange={handleInputChange} 
            error={errors.company?.[0]}
          />
          <Input 
            label="CNPJ (Opcional)"
            name="cnpj" 
            type="text" 
            value={formData.cnpj} 
            onChange={handleInputChange} 
            error={errors.cnpj?.[0]}
          />
        </div>

        <Textarea 
          label="Sua Mensagem" 
          name="message" 
          value={formData.message} 
          onChange={handleInputChange} 
          error={errors.message?.[0]}
          placeholder="Como podemos te ajudar hoje?"
        />
      </div>

      <div className="pt-2">
    <Button type="submit" isLoading={loading} icon={ <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>}> 
          <div className="flex items-center justify-center gap-2">
           
            Enviar para WhatsApp
          </div>
        </Button>
      </div>
    </form>
  );
}