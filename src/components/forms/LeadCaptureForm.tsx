'use client';

import { useState } from 'react';
import { z } from 'zod';
import { ANALYTICS_OPTIONS } from '@/constants/analytics';
import { GenerateTestAccess } from '@/services/api/api';
import { LeadFormData, ApiResponse } from '@/types';

import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

const leadSchema = z.object({
  name: z.string().min(3, 'O nome completo é obrigatório.'),
  email: z.string().email('Insira um e-mail corporativo válido.'),
  phone: z.string().min(10, 'Insira um telefone válido.'),
  company: z.string().min(2, 'O nome da empresa é obrigatório.'),
  cnpj: z.string().min(14, 'Insira um CNPJ válido.'), 
  selectedAnalytics: z.array(z.string()).min(1, 'Selecione pelo menos um analítico para testar.'),
});

type FormErrors = z.inferFlattenedErrors<typeof leadSchema>['fieldErrors'];

export default function LeadCaptureForm() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ApiResponse | null>(null);
  const [errors, setErrors] = useState<FormErrors>({}); 
  
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    cnpj: '',
    selectedAnalytics: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (id: string) => {
    setFormData((prev) => {
      const jaSelecionado = prev.selectedAnalytics.includes(id);
      const newAnalytics = jaSelecionado
        ? prev.selectedAnalytics.filter(item => item !== id)
        : [...prev.selectedAnalytics, id];
      if (newAnalytics.length > 0 && errors.selectedAnalytics) {
        setErrors((prev) => ({ ...prev, selectedAnalytics: undefined }));
      }

      return { ...prev, selectedAnalytics: newAnalytics };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = leadSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return; 
    }

    setErrors({});
    setLoading(true);

    try {
      const resposta = await GenerateTestAccess(result.data as LeadFormData);
      setResultado(resposta);
    } catch (error) {
      console.error("Erro ao gerar acesso", error);
    } finally {
      setLoading(false);
    }
  };

  if (resultado?.sucess && resultado.credentials) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-emerald-900/10 border border-emerald-500/20 rounded-xl text-center backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-emerald-400 mb-2">Acesso Gerado com Sucesso!</h2>
        <p className="mb-6 text-slate-300">Utilize as credenciais abaixo para acessar a plataforma.</p>
        
        <div className="bg-[#060d1a]/80 p-6 rounded-lg border border-slate-700/50 text-left w-full max-w-sm shadow-inner">
          <div className="mb-4">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Acesse o Link</span>
            <a href={resultado.credentials.acessLink} className="text-[#FACC15] font-medium hover:text-yellow-300 hover:underline transition-colors break-all">
              {resultado.credentials.acessLink}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Usuário</span>
              <div className="bg-slate-800/50 px-3 py-2 rounded border border-slate-700/50">
                <strong className="text-slate-100 font-mono text-sm">{resultado.credentials.user}</strong>
              </div>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Senha</span>
              <div className="bg-slate-800/50 px-3 py-2 rounded border border-slate-700/50">
                <strong className="text-slate-100 font-mono text-sm">{resultado.credentials.password}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full mx-auto" noValidate>
      
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-100 border-b border-slate-700/50 pb-2 tracking-wide">
          Dados do Lead
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
            label="E-mail Corporativo" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            error={errors.email?.[0]}
          />
          <Input 
            label="Telefone / WhatsApp" 
            name="phone" 
            type="tel" 
            value={formData.phone} 
            onChange={handleInputChange} 
            error={errors.phone?.[0]}
          />
        </div>

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
            label="CNPJ" 
            name="cnpj" 
            type="text" 
            value={formData.cnpj} 
            onChange={handleInputChange} 
            error={errors.cnpj?.[0]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700/50 pb-2 tracking-wide">
          Analíticos de Interesse
        </h3>
        
        {errors.selectedAnalytics && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 animate-in fade-in">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-400 font-medium">{errors.selectedAnalytics[0]}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 pt-2">
          {ANALYTICS_OPTIONS.map((analitico) => (
            <Checkbox
              key={analitico.id}
              name={analitico.id}
              label={analitico.label}
              checked={formData.selectedAnalytics.includes(analitico.id)}
              onChange={() => handleCheckboxChange(analitico.id)}
            />
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" isLoading={loading}>
          Testar Plataforma Agora
        </Button>
      </div>
    </form>
  );
}