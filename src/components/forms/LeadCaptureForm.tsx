'use client';

import { useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { ANALYTICS_OPTIONS } from '@/constants/analytics';
import { GenerateTestAccess } from '@/app/actions/api';
import { LeadFormData, ApiResponse, CompanyData } from '@/types';

import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

import { getTranslatedFieldError } from '@/utils/errorMapper';
import { SocialButton } from '../ui/SocialButton';
import { maskCNPJ, maskPhone } from '@/utils/masks';
import { COMPANY_OPTIONS } from '@/constants/typeCompany';

const leadSchema = z.object({
  name: z.string().min(3, 'O nome completo é obrigatório.'),
  email: z.string().email('Insira um e-mail corporativo válido.'),
  phone: z.string().min(14, 'Insira um telefone válido.'),
  company: z.string().min(2, 'O nome da empresa é obrigatório.'),
  identifier: z.string().length(18, 'Insira um CNPJ válido.'),
  selectedAnalytics: z.array(z.string()).min(1, 'Selecione pelo menos um analítico para testar.'),
  company_segment: z.string().min(1, 'O segmento da empresa é obrigatório.'),
});

type FormErrors = z.inferFlattenedErrors<typeof leadSchema>['fieldErrors'];

export default function LeadCaptureForm() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ApiResponse | null>(null);
  const [errors, setErrors] = useState<FormErrors>({}); 
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'user' | 'password' | 'link' | null>(null);
  
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    identifier: '',
    selectedAnalytics: [],
    company_segment: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === 'phone') {
        value = maskPhone(value);
      } else if (name === 'identifier') {
        value = maskCNPJ(value);
      }

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

  const handleSegmentChange = (id: string) => {
  setFormData((prev) => {
    const novoSegmento = prev.company_segment === id ? '' : id;
    
    if (novoSegmento && errors.company_segment) {
      setErrors((prev) => ({ ...prev, company_segment: undefined }));
    }

    return { ...prev, company_segment: novoSegmento };
  });
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = leadSchema.safeParse(formData);
    
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return; 
    }

    setErrors({});
    setApiError(null); 
    setLoading(true);

    try {
      const resposta = await GenerateTestAccess(result.data as LeadFormData & CompanyData);
      
      if (resposta.sucess) {
        setResultado(resposta);
      } else {
        if (resposta.isApiValidationError) {
          const apiErrors = resposta.fields;
          
          setErrors({
            email: getTranslatedFieldError(apiErrors.email),
            company: getTranslatedFieldError(apiErrors.company_name),
            identifier: getTranslatedFieldError(apiErrors.identifier) || getTranslatedFieldError(apiErrors.company_name), 
            phone: getTranslatedFieldError(apiErrors.phone) || getTranslatedFieldError(apiErrors.company_phone),
          });
        } else {
          setApiError(resposta.message || "Não foi possível processar sua solicitação no momento.");
        }
      }
    } catch (error: any) {
      console.error("Erro ao gerar acesso", error);
      setApiError("Erro de comunicação com o servidor. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, field: 'user' | 'password' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  if (resultado?.sucess && resultado.credentials) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 w-full bg-emerald-900/10 border border-emerald-500/20 rounded-xl text-center backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        
        <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 mb-4 sm:mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-2">Acesso Gerado com Sucesso!</h2>
        <p className="mb-6 text-sm sm:text-base text-slate-300">
          Abaixo estão as credenciais para acessar seu ambiente de teste exclusivo. Seu teste terá acesso completo aos analíticos selecionados por 7 dias. Aproveite para explorar e descobrir insights valiosos para o seu negócio!
        </p>
        
        <div className="bg-[#060d1a]/80 p-4 sm:p-6 rounded-lg border border-slate-700/50 text-left w-full max-w-md shadow-inner">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1">
               <span className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Acesse o Link</span>
            </div>
            <a href={resultado.credentials.acessLink} target="_blank" className="text-[#FACC15] text-sm sm:text-base font-medium hover:text-yellow-300 hover:underline transition-colors break-all">
              {resultado.credentials.acessLink}
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <span className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Usuário</span>
              <div className="bg-slate-800/50 p-2.5 sm:px-3 sm:py-2.5 rounded border border-slate-700/50 flex items-center justify-between gap-2">
                <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <strong className="text-slate-100 font-mono text-[13px] sm:text-sm whitespace-nowrap">
                    {resultado.credentials.user}
                  </strong>
                </div>
                <button 
                  onClick={() => handleCopy(resultado.credentials.user, 'user')}
                  className="text-slate-400 hover:text-emerald-400 transition-colors p-1.5 rounded-md hover:bg-slate-700/50 shrink-0 cursor-pointer"
                  title="Copiar usuário"
                >
                  {copiedField === 'user' ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <span className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Senha</span>
              <div className="bg-slate-800/50 p-2.5 sm:px-3 sm:py-2.5 rounded border border-slate-700/50 flex items-center justify-between gap-2">
                <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <strong className="text-slate-100 font-mono text-[13px] sm:text-sm whitespace-nowrap">
                    {resultado.credentials.password}
                  </strong>
                </div>
                <button 
                  onClick={() => handleCopy(resultado.credentials.password, 'password')}
                  className="text-slate-400 hover:text-emerald-400 transition-colors p-1.5 rounded-md hover:bg-slate-700/50 shrink-0 cursor-pointer"
                  title="Copiar senha"
                >
                  {copiedField === 'password' ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-500/20 w-full flex flex-col items-center">
          <p className="mb-4 text-sm font-medium text-slate-300">
            Acompanhe a Zions Vision e fique por dentro das últimas inovações:
          </p>
          <div className="flex items-center gap-4">
            <SocialButton ariaLabel='Acessar Instagram' svg={<svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 transition-transform group-hover:scale-110"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>} href='https://instagram.com/zions.vision/' />
            
            <SocialButton ariaLabel='Acessar LinkedIn' svg={<svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 transition-transform group-hover:scale-110"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>} href='https://www.linkedin.com/company/zionsvision/' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 mb-4 tracking-tight">
          Teste Nossa Plataforma
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Preencha os dados abaixo para gerar seu acesso exclusivo e testar nossos analíticos de vídeo na prática.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full mx-auto" noValidate>
        {apiError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 animate-in fade-in">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400 font-medium">{apiError}</p>
          </div>
        )}
        
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-100 border-b border-slate-700/50 pb-2 tracking-wide">
            Insira seus dados
          </h2>
          
          <Input 
            label="Nome completo" 
            name="name" 
            type="text" 
            value={formData.name} 
            onChange={handleInputChange} 
            error={errors.name?.[0]} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
            <Input 
              label="E-mail de contato" 
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
              name="identifier" 
              type="text" 
              value={formData.identifier} 
              onChange={handleInputChange} 
              error={errors.identifier?.[0]}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700/50 pb-2 tracking-wide">
            Segmento da Empresa
          </h3>
          
          {errors.company_segment && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 animate-in fade-in">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-400 font-medium">{errors.company_segment}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 pt-2">
            {COMPANY_OPTIONS.map((empresa) => (
              <Checkbox
                key={empresa.id}
                name={empresa.id}
                label={empresa.label}
                checked={formData.company_segment === empresa.id}
                onChange={() => handleSegmentChange(empresa.id)} 
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700/50 pb-2 tracking-wide">
            Analíticos de interesse
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
    </>
  );
}