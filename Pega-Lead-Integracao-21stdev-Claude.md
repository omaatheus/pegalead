# Implementação — Redesign Pega Lead com referências do 21st.dev

> Documento para entregar ao **Claude Code Max — Sonnet 5.5** na raiz do repositório local do Pega Lead.
> **Effort:** padrão ou médio, se houver seletor. **Ação:** implementação local. **Não fazer deploy, commits, migrações ou chamadas reais de criação de contas.**

## Contexto verificado na auditoria (confirmar no código antes de editar)

- Next.js 16.2.2, React 19.2.4, TypeScript estrito, Tailwind CSS v4.
- `src/app/page.tsx`: página principal de teste Heimdall; `src/app/exposec` tem outro fluxo que deve permanecer intacto.
- `src/components/forms/LeadCaptureForm.tsx`: formulário principal, Zod 4 e `useState` local.
- Componentes próprios em `src/components/ui/` (`Input`, `Checkbox`, `Button`, `Textarea`, `SocialButton`). **Verifique capitalização e APIs reais; não substitua o Button existente por `shadcn/button` automaticamente.**
- `src/app/globals.css`: CSS global. Imagens existentes reportadas: `public/heimdall.png`, `public/intrusao.png`.
- `src/app/actions/api.ts`: Server Action que cria lead, conta e integra Postgres, MailGrid, Heimdall e CRM. **Nesta tarefa, manter esse fluxo e payload intactos.**
- `ANALYTICS_OPTIONS` (17 itens), `COMPANY_OPTIONS` (5), `LeadFormData` e `ApiResponse` já são contratos existentes e não devem ser alterados.
- A auditoria identificou problemas críticos no backend (validação no servidor, senha, rollback, abuso e e-mail). **Não os misture ao redesign. Informe os riscos em separado e não afirme que foram corrigidos.**

## Objetivo da implementação

Refatorar **apenas a experiência de frontend da rota `/`** numa landing page B2B premium, acessível e responsiva, mantendo identidade dark Zions Vision. Usar e adaptar dois padrões de componentes enviados pelo time a partir do 21st.dev:

1. **Stepper visual de progresso:** baseado no componente `v-carousel-8`/`Particle` (ver código de referência no apêndice). O demo tem Embla, cinco passos estáticos, textos em inglês e botão Finish sem ação. Transformar em fluxo **controlado pelo estado do formulário**, com apenas **2 etapas**: `Seus dados` e `Personalize seu teste`. É aceitável dispensar Embla caso uma transição CSS simples seja mais estável, acessível e evite dependência; manter o padrão visual de barra, contador e navegação.
2. **Choicebox/card selecionável:** baseado no demo `radio-group-card-vertical` (ver apêndice). Para **segmento da empresa**, utilizar radio group de escolha única, controlado pelo estado atual, preservando exatamente os IDs de `COMPANY_OPTIONS`. Para **analíticos**, criar variante **checkbox múltiplo**; nunca usar radio group para 17 analíticos. Preservar exatamente os IDs originais de `ANALYTICS_OPTIONS` no payload.

Não copiar literalmente textos, ícones ou arrays demonstrativos (Brand Strategy, UX/UI Design, Welcome aboard etc.) para a aplicação.

## Orientações de implementação

### 1. Inspeção inicial objetiva

- Verificar `package.json`, `tsconfig.json`, `src/app/page.tsx`, `src/app/globals.css`, `src/components/forms/LeadCaptureForm.tsx` e componentes UI usados no formulário.
- Identificar `@/*` alias e a capitalização real dos arquivos (`Button.tsx` vs `button.tsx`) antes de importar; ambiente Linux é case-sensitive.
- Checar quais pacotes já estão instalados (`lucide-react` já foi reportado); instalar **somente** dependências realmente necessárias. **Não executar `shadcn init` nem `shadcn add --overwrite` sem necessidade** — o repositório já utiliza componentes próprios.
- Não instalar `embla-carousel-react` se optar por um stepper controlado sem carrossel. Não instalar Radix se os radios e checkboxes nativos oferecerem a acessibilidade e visual desejados.
- Evitar imagens genéricas do Unsplash: usar assets de produto existentes e logos oficiais, após verificar que pertencem ao projeto.

### 2. Layout desktop e mobile

- Em desktop, criar apresentação split-screen, com ~45% de área visual/proposta de valor e ~55% para formulário. Adaptar aos limites do design existente, sem tornar a página excessivamente larga.
- Área de apresentação: logo real, headline clara (`Transforme suas câmeras em inteligência operacional` pode servir como rascunho), benefícios verificáveis, visual do Heimdall com assets existentes. Sem prometer recursos ou resultados não confirmados.
- Formulário com bom contraste, bordas sutis, realce roxo se coerente com a interface atual, estados de foco visíveis, CTA destacado.
- Em mobile, uma coluna, sem overflow horizontal; indicador de progresso compacto e CTA acessível sem encobrir mensagens de erro.
- A auditoria encontrou amarelo `#FACC15` no código, enquanto a captura mostra roxo no CTA. **Revisar o tema real antes de consolidar tokens; não assumir nenhuma cor como padrão oficial sem evidência.**
- Não anunciar `7 dias grátis`, `sem cartão` ou prazo de acesso sem confirmação técnica/comercial.

### 3. Fluxo funcional (sem mudanças de contrato)

**Etapa 1 — Seus dados**: nome, e-mail, telefone/WhatsApp, empresa, CNPJ. Validar apenas os campos da etapa antes de permitir `Continuar`, usando o schema/validações existentes; manter valores ao avançar/voltar.

**Etapa 2 — Personalize seu teste**: segmento (uma opção) e analíticos de interesse (múltiplas opções, mínimo um); apresentar opções como cards responsivos e agrupá-las visualmente **sem alterar IDs ou payload**. A renderização deve derivar da lista original: não inventar IDs novos.

Botões `Voltar`, `Continuar` e `Gerar acesso` devem ter `type` explícito e comportamento correto dentro do `<form>`. Somente o botão final pode iniciar a Server Action já existente, após validação; nenhuma navegação entre etapas deve submeter o formulário.

Preservar loading, erros por campo, erro global, resultado de sucesso e exibição de credenciais já existentes. Não introduzir chamadas duplicadas ou envio prematuro. Proteger o CTA contra double-submit. As duas etapas devem manter o estado sem desmontar/perder os campos.

### 4. Acessibilidade e comportamento

- `fieldset` e `legend` semânticos para segmento e analíticos; `type=radio` para único, `type=checkbox` para múltiplo (ou Radix equivalente).
- Cards clicáveis integralmente, com `focus-visible`, estados visuais de selecionado e desabilitado, navegação por teclado.
- `aria-invalid`, `aria-describedby` somente com IDs presentes e texto de erro legível. O demo Choicebox tem `aria-describedby` apontando para ID ausente: corrigir.
- Anunciar erros gerais e mudanças de etapa com `aria-live`, sem excesso de narração; encaminhar foco ao primeiro campo inválido ou ao título da etapa quando necessário.
- Respeitar `prefers-reduced-motion`; não depender de animações de terceiros sem CSS instalado.
- Labels e texto inteiramente em português do Brasil.

### 5. Isolamento de risco

- Não alterar `/exposec`, schema Prisma, banco, Server Actions, CRM, MailGrid, contrato Heimdall, URLs, variáveis de ambiente ou dados de leads.
- Não executar chamadas reais que criem empresas, usuários, senhas, e-mails ou cartões de CRM.
- Não abrir, exibir ou copiar segredos; não compartilhar repositório com o 21st.dev.
- Não iniciar deploy, commit ou push sem aprovação.
- Se for indispensável alterar algum contrato de backend, **interromper e registrar a dependência**, em vez de modificar silenciosamente.

### 6. Critérios de aceite e entrega

- `/` apresenta split-screen consistente em desktop; layout responsivo em 360, 768 e 1280 px.
- Etapa 1 valida campos presentes; etapa 2 permite uma empresa/segmento e múltiplos analíticos, com mínimo de um.
- Mesmos dados, IDs e payload chegam à função existente. Sem tocar em `/exposec`.
- Back/next/submit funcionam, preservam estado, não submetem antes da hora; sucesso/erro/loading preservados.
- Executar comandos disponíveis no `package.json` para lint, typecheck, build e testes relevantes. **Reportar comandos e resultados reais, sem declarar sucesso se não executou.**
- Entregar lista de arquivos alterados, dependências adicionadas, resumo do diff, riscos remanescentes e validações manuais necessárias (sem chamadas ao backend real).

## Código de referência 21st.dev fornecido pelo usuário

### A. Stepper — `v-carousel-8.tsx` (REFERÊNCIA, não copiar literalmente)

```tsx
"use client";
import useEmblaCarousel from "embla-carousel-react";
import { CheckIcon, CodeIcon, LayersIcon, PaletteIcon, RocketIcon, ZapIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { desc: "Let's get your workspace set up in just a few steps.", icon: RocketIcon, title: "Welcome aboard" },
  { desc: "Pick a color palette that matches your brand identity.", icon: PaletteIcon, title: "Choose a theme" },
  { desc: "Select the UI building blocks your project needs.", icon: LayersIcon, title: "Pick your components" },
  { desc: "Run a single command to add components to your project.", icon: CodeIcon, title: "Install via CLI" },
  { desc: "Start building — your design system is ready to ship.", icon: ZapIcon, title: "You're all set!" },
];

export default function Particle() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ watchDrag: false });
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);
  const isLast = current === STEPS.length - 1;
  return (
    <div className="w-full max-w-sm space-y-4 rounded-xl border bg-background p-6">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>Getting started</span>
          <span>Step {current + 1} of {STEPS.length}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((current + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div className="min-w-0 shrink-0 grow-0 basis-full" key={i}>
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon aria-hidden="true" className="size-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-1 text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1" disabled={current === 0} onClick={() => emblaApi?.scrollPrev()} variant="outline">Back</Button>
        <Button className="flex-1" onClick={() => !isLast && emblaApi?.scrollNext()}>
          {isLast ? <><CheckIcon />Finish</> : "Next"}
        </Button>
      </div>
    </div>
  );
}
```

> Ponto de adaptação: o original usa `max-w-sm`, cinco slides, `embla-carousel-react` e utilitários `bg-primary`, `bg-muted`, `bg-background`. Esses tokens não estão necessariamente definidos no tema atual. Não adicionar `shadcn/button` às cegas.

### B. Choicebox — `radio-group-card-vertical-demo.tsx` (REFERÊNCIA)

```tsx
import { useId } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SwatchBook, WandSparkles } from "lucide-react";

const plans = [
  { value: "1", title: "Brand Strategy", description: "Perfect for individual creators.", icon: SwatchBook, backgroundColor: "bg-blue-500/10", color: "text-blue-500" },
  { value: "2", title: "UX/UI Design", description: "Built for collaboration and growing teams.", icon: WandSparkles, backgroundColor: "bg-orange-400/10", color: "text-orange-400" },
];

const RadioGroupCardVerticalDemo = () => {
  const id = useId();
  return (
    <RadioGroup defaultValue="1" className="w-full max-w-72 justify-items-center sm:grid-cols-2">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const radioId = `${id}-${plan.value}`;
        return (
          <Label key={plan.value} htmlFor={radioId} className={`border-input cursor-pointer relative flex w-full max-w-44 flex-col items-center gap-3 rounded-md border p-5 shadow-xs transition ${plan.backgroundColor}`}>
            <div className="w-full flex flex-col justify-items-start gap-9 text-start">
              <div className="w-full flex items-center justify-between gap-2">
                <Icon className={plan.color} />
                <div className="bg-background p-px rounded-full">
                  <RadioGroupItem id={radioId} value={plan.value} aria-describedby={`${radioId}-description`} />
                </div>
              </div>
              <span className="text-base font-medium">{plan.title}</span>
            </div>
          </Label>
        );
      })}
    </RadioGroup>
  );
};
export default RadioGroupCardVerticalDemo;
```

> Ponto de adaptação: `defaultValue="1"` deve virar valor controlado e compatível com `COMPANY_OPTIONS`; `aria-describedby` referencia um elemento ausente. `max-w-72`/`max-w-44` podem criar cards estreitos; remover. Para analíticos, converter para múltipla seleção com checkbox e estado selecionado, preservando IDs.

## Observação sobre dependências

Os exemplos originais citam `embla-carousel-react`, `@radix-ui/react-label`, `@radix-ui/react-radio-group`, `@radix-ui/react-slot`, `class-variance-authority` e `lucide-react`. **Isso não significa instalar todos eles.** Inspecionar o projeto e instalar apenas os necessários para a solução escolhida. A implementação atual possui componentes UI próprios.
