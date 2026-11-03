import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

interface ChoiceCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'title'> {
  /** radio = escolha única; checkbox = múltipla escolha. */
  type: 'radio' | 'checkbox';
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

/**
 * Card selecionável baseado em input nativo (radio/checkbox): o card inteiro é clicável,
 * o teclado e o leitor de tela funcionam sem JS adicional e o foco é visível.
 */
export const ChoiceCard = forwardRef<HTMLInputElement, ChoiceCardProps>(
  ({ type, title, description, icon, id, className, ...props }, ref) => {
    const inputId = id ?? `${props.name}-${props.value}`;
    const descriptionId = description ? `${inputId}-description` : undefined;

    return (
      <label
        htmlFor={inputId}
        className={`
          group relative flex h-full cursor-pointer items-start gap-3 rounded-lg border p-3.5
          border-slate-700/80 bg-[#0a1526]/70 text-left
          transition-colors duration-200 motion-reduce:transition-none
          hover:border-slate-500 hover:bg-slate-800/40
          has-[:checked]:border-[#FACC15] has-[:checked]:bg-[#FACC15]/10
          has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#FACC15]/70 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#060d1a]
          has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50
          ${className ?? ''}
        `}
      >
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-describedby={descriptionId}
          className="sr-only"
          {...props}
        />

        {icon && (
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-slate-400 group-has-[:checked]:text-[#FACC15]"
          >
            {icon}
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium leading-snug text-slate-200 group-has-[:checked]:text-slate-50">
            {title}
          </span>
          {description && (
            <span id={descriptionId} className="text-xs leading-snug text-slate-400">
              {description}
            </span>
          )}
        </span>

        <span
          aria-hidden="true"
          className={`
            mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-slate-500 bg-[#0a1526]
            ${type === 'radio' ? 'rounded-full' : 'rounded-[4px]'}
            group-has-[:checked]:border-[#FACC15] group-has-[:checked]:bg-[#FACC15]
          `}
        >
          <Check
            strokeWidth={3.5}
            className="h-3.5 w-3.5 scale-0 text-[#060d1a] transition-transform duration-200 motion-reduce:transition-none group-has-[:checked]:scale-100"
          />
        </span>
      </label>
    );
  },
);

ChoiceCard.displayName = 'ChoiceCard';
