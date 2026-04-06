import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;   
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, className, error, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full group">
        <label
          htmlFor={textareaId}
          className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
            error ? 'text-red-400' : 'text-slate-300 group-focus-within:text-[#FACC15]'
          }`}
        >
          {label}
        </label>
        
        <div className="relative rounded-md shadow-sm overflow-hidden">
          <textarea
            ref={ref}
            id={textareaId}
            className={`
              w-full 
              bg-[#0a1526]/80 backdrop-blur-sm 
              border 
              ${error ? 'border-red-500/80 hover:border-red-400' : 'border-slate-700/80 hover:border-slate-500'} 
              rounded-md px-4 py-2.5 text-sm text-slate-50 
              placeholder-slate-500
              focus:outline-none focus:border-transparent focus:ring-0
              transition-all duration-300
              resize-y min-h-[120px]
              ${className || ''}
            `}
            {...props}
          />
          
          <span className={`absolute bottom-1 left-0 w-full h-[2px] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-focus-within:scale-x-100 rounded-b-md pointer-events-none ${error ? 'bg-red-500' : 'bg-[#FACC15]'}`} />
        </div>
        
        {error && (
          <span className="text-xs text-red-400 mt-0.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';