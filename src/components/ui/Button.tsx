'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, disabled, className, icon, ...props }, ref) => {
    const isDisabled = isLoading || disabled;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          cursor-pointer
          w-full flex items-center justify-center gap-2.5 
          py-3 px-6 mt-6 
          rounded-lg font-medium text-base tracking-wide
          transition-all duration-200 ease-in-out
          
          /* Estado Padrão (Sólido e Limpo) */
          bg-[#1e40af] text-white border border-transparent shadow-sm
          
          /* Hover: Azul levemente mais escuro, texto/borda amarelos bem sutis e elevação mínima */
          hover:bg-[#152e82] hover:border-[#FACC15]/30 hover:text-[#FACC15] 
          hover:shadow-md hover:-translate-y-[1px]
          
          /* Clique (Active): Leve "aperto" no botão */
          active:scale-[0.98] active:translate-y-0
          
          /* Estado Desabilitado / Loading */
          disabled:opacity-70 disabled:cursor-not-allowed 
          disabled:bg-slate-800 disabled:text-slate-400 disabled:border-slate-700
          disabled:hover:bg-slate-800 disabled:hover:text-slate-400 disabled:hover:border-slate-700
          disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100

          ${className || ''}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-5 w-5 text-current" />
        ) : (
          icon ||
          <Sparkles className="h-5 w-5 text-current" />
        )}
        
        <span>
          {isLoading ? 'Gerando acesso exclusivo...' : children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';