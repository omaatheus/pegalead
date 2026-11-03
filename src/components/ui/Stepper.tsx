interface StepperProps {
  steps: string[];
  /** Índice (base 0) da etapa atual. */
  current: number;
}

/** Indicador de progresso controlado pelo estado do formulário (sem carrossel). */
export function Stepper({ steps, current }: StepperProps) {
  const total = steps.length;
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-slate-300">{steps[current]}</span>
        <span>
          Etapa {current + 1} de {total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Progresso do formulário"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current + 1}
        aria-valuetext={`Etapa ${current + 1} de ${total}: ${steps[current]}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800"
      >
        <div
          className="h-full rounded-full bg-[#FACC15] transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
