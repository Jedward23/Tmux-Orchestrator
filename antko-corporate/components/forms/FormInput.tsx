import { JSX } from "preact";

interface FormInputProps {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "password" | "number" | "url";
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  icon?: JSX.Element;
}

export function FormInput({
  name,
  label,
  type = "text",
  value = "",
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  onChange,
  onBlur,
  className = "",
  maxLength,
  pattern,
  autoComplete,
  icon
}: FormInputProps) {
  const hasError = Boolean(error);
  
  const baseInputClasses = `
    w-full px-4 py-3 border rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-offset-1
    transition-colors duration-200
    disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
    ${icon ? 'pl-12' : ''}
  `;

  const inputClasses = hasError
    ? `${baseInputClasses} border-red-300 focus:border-red-500 focus:ring-red-500`
    : `${baseInputClasses} border-slate-300 focus:border-antko-blue-500 focus:ring-antko-blue-500`;

  return (
    <div class={`space-y-2 ${className}`}>
      <label 
        htmlFor={name} 
        class="block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
      </label>
      
      <div class="relative">
        {icon && (
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="text-slate-400">
              {icon}
            </div>
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          pattern={pattern}
          autoComplete={autoComplete}
          class={inputClasses}
          onInput={(e) => onChange && onChange(e.currentTarget.value)}
          onBlur={onBlur}
        />
      </div>

      {helpText && !hasError && (
        <p class="text-sm text-slate-500">{helpText}</p>
      )}
      
      {hasError && (
        <p class="text-sm text-red-600 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}