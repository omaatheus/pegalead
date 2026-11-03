import { ShieldCheck, ListChecks, KeyRound } from 'lucide-react';
import LeadCaptureForm from '@/components/forms/LeadCaptureForm';
import { ANALYTICS_OPTIONS } from '@/constants/analytics';

// Somente afirmações verificáveis no código: quantidade de analíticos disponíveis no formulário
// e o fluxo de entrega das credenciais ao final do cadastro.
const BENEFITS = [
  {
    icon: ListChecks,
    text: `${ANALYTICS_OPTIONS.length} analíticos disponíveis para você escolher no teste.`,
  },
  {
    icon: ShieldCheck,
    text: 'Transforme as câmeras que você já possui em inteligência operacional.',
  },
  {
    icon: KeyRound,
    text: 'Receba as credenciais de acesso ao final do cadastro.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex-grow w-full relative flex flex-col items-center pt-28 pb-12 px-4 sm:px-8 bg-[#060d1a] overflow-x-clip">
      <div aria-hidden="true" className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FACC15]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-10 lg:gap-14 items-start my-auto">
        <section aria-labelledby="hero-title" className="lg:sticky lg:top-28 space-y-6 text-center lg:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FACC15]">Zions Vision · Heimdall</p>
          <h1 id="hero-title" className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-slate-50 tracking-tight leading-tight">
            Transforme suas câmeras em inteligência operacional
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Preencha os dados ao lado para gerar seu acesso e testar os analíticos de vídeo da plataforma Heimdall na prática.
          </p>

          <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-slate-300">
                <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#FACC15]" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="w-full bg-[#0a1526]/60 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl p-6 sm:p-10">
          <LeadCaptureForm />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
    </main>
  );
}
