'use client';

import { useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { ANALYTICS_OPTIONS } from '@/constants/analytics';
import { ExtendedLeadData, GenerateTestAccess } from '@/app/actions/api';
import { LeadFormData, ApiResponse, CompanyData } from '@/types';

import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

import { getTranslatedFieldError } from '@/utils/errorMapper';
import { SocialButton } from '../ui/SocialButton';
import { maskCNPJ, maskPhone } from '@/utils/masks';
import { COMPANY_OPTIONS } from '@/constants/typeCompany';

// 1. Schema atualizado com superRefine para validação condicional
const leadSchema = z.object({
  name: z.string().min(3, 'O nome completo é obrigatório.'),
  email: z.string().email('Insira um e-mail corporativo válido.'),
  phone: z.string().min(14, 'Insira um telefone válido.'),
  company: z.string().min(2, 'O nome da empresa é obrigatório.'),
  identifier: z.string().length(18, 'Insira um CNPJ válido.'),
  company_segment: z.string().min(1, 'O segmento da empresa é obrigatório.'),
  wantsHeimdall: z.boolean(),
  wantsZeusVision: z.boolean(),
  selectedAnalytics: z.array(z.string()),
}).superRefine((data, ctx) => {
  // Valida se nenhum produto foi selecionado
  if (!data.wantsHeimdall && !data.wantsZeusVision) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecione pelo menos um produto (Heimdall ou Zeus Vision).',
      path: ['products'], 
    });
  }
  // Valida se Heimdall está selecionado mas não há analíticos
  if (data.wantsHeimdall && data.selectedAnalytics.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecione pelo menos um analítico para testar no Heimdall.',
      path: ['selectedAnalytics'],
    });
  }
});

type FormErrors = z.inferFlattenedErrors<typeof leadSchema>['fieldErrors'] & {
  products?: string[];
};

type ExtendedLeadFormData = LeadFormData & {
  origin: string;
  wantsHeimdall: boolean;
  wantsZeusVision: boolean;
};

export default function AbrintLeadCaptureForm() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ApiResponse | null>(null);
  const [errors, setErrors] = useState<FormErrors>({}); 
  const [apiError, setApiError] = useState<string | null>(null);
  
  const ABRINT_COMPANY_OPTIONS = [
    { id: 'telecom', label: 'Telecom' },
  ]

  const [formData, setFormData] = useState<ExtendedLeadFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    identifier: '',
    selectedAnalytics: [],
    company_segment: '',
    origin: 'abrint_2026',
    wantsHeimdall: false,
    wantsZeusVision: false,
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

  const handleProductChange = (product: 'wantsHeimdall' | 'wantsZeusVision') => {
    setFormData((prev) => {
      const newValue = !prev[product];
      
      const newAnalytics = (product === 'wantsHeimdall' && !newValue) 
        ? [] 
        : prev.selectedAnalytics;

      if (errors.products) {
        setErrors((prevErrors) => ({ ...prevErrors, products: undefined }));
      }

      return {
        ...prev,
        [product]: newValue,
        selectedAnalytics: newAnalytics
      };
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
      const resposta = await GenerateTestAccess(result.data as ExtendedLeadData);
      
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
            name: getTranslatedFieldError(apiErrors.name),
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

  // Alteração principal: Tratamento de sucesso voltado apenas para o feedback visual
  if (resultado?.sucess) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 w-full bg-emerald-900/10 border border-emerald-500/20 rounded-xl text-center backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        
        <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 mb-4 sm:mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-2">
          Contato Registrado com Sucesso!
        </h2>
        
        <p className="max-w-md mx-auto mb-6 text-sm sm:text-base text-slate-300">
          {resultado.message || "Seus dados foram enviados com sucesso. Nossa equipe entrará em contato em breve para dar andamento."}
        </p>

        <div className="mt-4 pt-6 border-t border-emerald-500/20 w-full flex flex-col items-center">
          <p className="mb-4 text-sm font-medium text-slate-300">
            Enquanto isso, acompanhe a Zions Vision:
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
          Deixe seu contato
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Preencha os dados abaixo e entraremos em contato para apresentar nossas inovações em visão computacional.
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
              label="E-mail corporativo" 
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
            {ABRINT_COMPANY_OPTIONS.map((empresa) => (
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
            Produto de interesse
          </h3>
          
          {errors.products && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 animate-in fade-in">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-400 font-medium">{errors.products[0]}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 pt-2">
            <Checkbox
              name="wantsHeimdall"
              label="Heimdall"
              checked={formData.wantsHeimdall}
              onChange={() => handleProductChange('wantsHeimdall')}
            />
            <Checkbox
              name="wantsZeusVision"
              label="Zeus Vision"
              checked={formData.wantsZeusVision}
              onChange={() => handleProductChange('wantsZeusVision')}
            />
          </div>

          {formData.wantsHeimdall && (
            <div className="mt-4 p-5 bg-slate-800/30 border border-slate-700/50 rounded-lg animate-in fade-in slide-in-from-top-2">
              <h4 className="text-sm font-semibold text-slate-200 mb-3">
                Selecione os analíticos do Heimdall:
              </h4>

              {errors.selectedAnalytics && (
                <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-red-400 font-medium">{errors.selectedAnalytics[0]}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4">
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
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" isLoading={loading}>
            Enviar meu contato
          </Button>
        </div>
      </form>
    </>
  );
}