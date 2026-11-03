'use client';

import { useId, useRef, useState } from 'react';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Cable, Building2, Network, Radio, ShieldCheck } from 'lucide-react';
import { GenerateTestAccess } from '@/app/actions/api';
import { LeadFormData, ApiResponse, CompanyData } from '@/types';

import { Input } from '@/components/ui/Input';
import { ChoiceCard } from '@/components/ui/ChoiceCard';
import { Stepper } from '@/components/ui/Stepper';
import { getAnalyticsGroups } from '@/constants/analyticsGroups';
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

const STEP_TITLES = ['Seus dados', 'Personalize seu teste'];

const stepOneSchema = leadSchema.pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  identifier: true,
});

const STEP_ONE_FIELDS = ['name', 'email', 'phone', 'company', 'identifier'] as const;

// Ícones puramente visuais, indexados pelos IDs originais de COMPANY_OPTIONS.
const SEGMENT_ICONS: Record<string, React.ReactNode> = {
  monitoring_center: <Radio className="h-5 w-5" />,
  telecom: <Network className="h-5 w-5" />,
  cftv_installation: <Cable className="h-5 w-5" />,
  security_company: <ShieldCheck className="h-5 w-5" />,
  facilities_and_concierge: <Building2 className="h-5 w-5" />,
};

const ANALYTICS_GROUPS = getAnalyticsGroups();

export default function LeadCaptureForm() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ApiResponse | null>(null);
  const [errors, setErrors] = useState<FormErrors>({}); 
  const [apiError, setApiError] = useState<string | null>(null);
  const [step, setStep] = useState<0 | 1>(0);
  const [announcement, setAnnouncement] = useState('');
  const submittingRef = useRef(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
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
    let { value } = e.target;
    const { name } = e.target;

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


  const focusFirstInvalid = (ids: string[]) => {
    requestAnimationFrame(() => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          el.focus();
          return;
        }
      }
    });
  };

  const goToStep = (target: 0 | 1) => {
    setStep(target);
    setAnnouncement(`Etapa ${target + 1} de ${STEP_TITLES.length}: ${STEP_TITLES[target]}`);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const handleNext = () => {
    const result = stepOneSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      focusFirstInvalid(STEP_ONE_FIELDS.filter((f) => fieldErrors[f]));
      return;
    }
    setErrors({});
    goToStep(1);
  };

  const submitToServer = async () => {
    const result = leadSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      if (STEP_ONE_FIELDS.some((f) => fieldErrors[f])) {
        goToStep(0);
        focusFirstInvalid(STEP_ONE_FIELDS.filter((f) => fieldErrors[f]));
      } else {
        focusFirstInvalid([
          fieldErrors.company_segment ? `${uid}-segment` : '',
          fieldErrors.selectedAnalytics ? `${uid}-analytics` : '',
        ].filter(Boolean));
      }
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
            name: getTranslatedFieldError(apiErrors.name),
          });
          // Os campos com erro da API estão na etapa 1.
          goToStep(0);
        } else {
          setApiError(resposta.message || "Não foi possível processar sua solicitação no momento.");
        }
      }
    } catch (error) {
      console.error("Erro ao gerar acesso", error);
      setApiError("Erro de comunicação com o servidor. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enter dentro de um campo da etapa 1 apenas avança; nunca chama o servidor.
    if (step === 0) {
      handleNext();
      return;
    }

    // Proteção contra double-submit (clique duplo / Enter repetido).
    if (submittingRef.current || loading) return;
    submittingRef.current = true;
    try {
      await submitToServer();
    } finally {
      submittingRef.current = false;
    }
  };

  const handleCopy = (text: string, field: 'user' | 'password' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  if (resultado?.sucess && 'credentials' in resultado) {
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

  const segmentErrorId = errors.company_segment ? `${uid}-segment-error` : undefined;
  const analyticsErrorId = errors.selectedAnalytics ? `${uid}-analytics-error` : undefined;

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="mb-6">
        <Stepper steps={STEP_TITLES} current={step} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full mx-auto" noValidate>
        {apiError && (
          <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <svg aria-hidden="true" className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400 font-medium">{apiError}</p>
          </div>
        )}

        {/* Etapa 1 — permanece montada (apenas oculta) para preservar o estado dos campos. */}
        <section hidden={step !== 0} aria-labelledby={`${uid}-step-1`} className="space-y-5">
          <h2
            id={`${uid}-step-1`}
            ref={step === 0 ? stepHeadingRef : undefined}
            tabIndex={-1}
            className="text-lg font-semibold text-slate-100 tracking-wide focus:outline-none"
          >
            Seus dados
          </h2>

          <Input label="Nome completo" name="name" type="text" autoComplete="name" value={formData.name} onChange={handleInputChange} error={errors.name?.[0]} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
            <Input label="E-mail de contato" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleInputChange} error={errors.email?.[0]} />
            <Input label="Telefone / WhatsApp" name="phone" type="tel" autoComplete="tel-national" inputMode="tel" value={formData.phone} onChange={handleInputChange} error={errors.phone?.[0]} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
            <Input label="Empresa" name="company" type="text" autoComplete="organization" value={formData.company} onChange={handleInputChange} error={errors.company?.[0]} />
            <Input label="CNPJ" name="identifier" type="text" inputMode="numeric" value={formData.identifier} onChange={handleInputChange} error={errors.identifier?.[0]} />
          </div>
        </section>

        {/* Etapa 2 */}
        <section hidden={step !== 1} aria-labelledby={`${uid}-step-2`} className="space-y-7">
          <h2
            id={`${uid}-step-2`}
            ref={step === 1 ? stepHeadingRef : undefined}
            tabIndex={-1}
            className="text-lg font-semibold text-slate-100 tracking-wide focus:outline-none"
          >
            Personalize seu teste
          </h2>

          <fieldset
            id={`${uid}-segment`}
            tabIndex={-1}
            aria-describedby={segmentErrorId}
            aria-invalid={errors.company_segment ? true : undefined}
            className="space-y-3 focus:outline-none"
          >
            <legend className="text-sm font-semibold text-slate-200 mb-3">Segmento da empresa</legend>
            {errors.company_segment && (
              <p id={segmentErrorId} role="alert" className="text-sm text-red-400 font-medium">
                {errors.company_segment[0]}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPANY_OPTIONS.map((empresa) => (
                <ChoiceCard
                  key={empresa.id}
                  type="radio"
                  name="company_segment"
                  value={empresa.id}
                  id={`${uid}-segment-${empresa.id}`}
                  title={empresa.label}
                  icon={SEGMENT_ICONS[empresa.id]}
                  checked={formData.company_segment === empresa.id}
                  onChange={() => handleSegmentChange(empresa.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset
            id={`${uid}-analytics`}
            tabIndex={-1}
            aria-describedby={analyticsErrorId}
            aria-invalid={errors.selectedAnalytics ? true : undefined}
            className="space-y-4 focus:outline-none"
          >
            <legend className="text-sm font-semibold text-slate-200 mb-1">
              Analíticos de interesse
              <span className="ml-2 text-xs font-normal text-slate-400">
                {formData.selectedAnalytics.length} selecionado{formData.selectedAnalytics.length === 1 ? '' : 's'}
              </span>
            </legend>
            <p className="text-xs text-slate-400">Escolha pelo menos um analítico para testar.</p>
            {errors.selectedAnalytics && (
              <p id={analyticsErrorId} role="alert" className="text-sm text-red-400 font-medium">
                {errors.selectedAnalytics[0]}
              </p>
            )}

            {ANALYTICS_GROUPS.map((group) => (
              <div key={group.title} role="group" aria-label={group.title} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{group.title}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.options.map((analitico) => (
                    <ChoiceCard
                      key={analitico.id}
                      type="checkbox"
                      name="selectedAnalytics"
                      value={analitico.id}
                      id={`${uid}-analytic-${analitico.id}`}
                      title={analitico.label}
                      checked={formData.selectedAnalytics.includes(analitico.id)}
                      onChange={() => handleCheckboxChange(analitico.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        </section>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          {step === 1 && (
            <button
              type="button"
              onClick={() => goToStep(0)}
              disabled={loading}
              className="cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-slate-600 px-6 py-3 text-base font-medium text-slate-200 transition-colors hover:border-slate-400 hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]/70 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
            >
              <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              Voltar
            </button>
          )}

          {step === 0 ? (
            <Button type="button" onClick={handleNext} icon={<ArrowRight className="h-5 w-5" />} className="mt-0! flex-1 focus-visible:ring-2 focus-visible:ring-[#FACC15]/70 focus-visible:outline-none">
              Continuar
            </Button>
          ) : (
            <Button type="submit" isLoading={loading} className="mt-0! flex-1 focus-visible:ring-2 focus-visible:ring-[#FACC15]/70 focus-visible:outline-none">
              Gerar acesso
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
