import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode; // Nova prop para receber o ícone
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, icon, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <label 
        htmlFor={inputId} 
        className={`group relative flex items-start gap-3 cursor-pointer p-2 -ml-2 rounded-lg hover:bg-slate-800/40 transition-colors ${className || ''}`}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="sr-only" 
          {...props}
        />
        
        <div className="relative flex items-center justify-center mt-0.5 min-w-[20px] w-5 h-5 rounded-[4px] border border-slate-600 bg-[#0a1526]/80 
                        group-hover:border-[#FACC15]/60
                        group-has-[:checked]:bg-[#FACC15]/10 group-has-[:checked]:border-[#FACC15] 
                        transition-all duration-300 shadow-sm">
          
          <Check 
            strokeWidth={3.5}
            className="w-3.5 h-3.5 text-[#FACC15] scale-0 group-has-[:checked]:scale-100 transition-transform duration-300 ease-out" 
          />
        </div>
        
        <div className="flex items-center gap-2.5 mt-[1px]">
          {icon && (
            <div className="text-slate-400 group-hover:text-slate-300 group-has-[:checked]:text-[#FACC15] transition-colors">
              {icon}
            </div>
          )}
          <span className="text-sm text-slate-300 group-hover:text-slate-100 group-has-[:checked]:text-slate-50 transition-colors leading-relaxed">
            {label}
          </span>
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';