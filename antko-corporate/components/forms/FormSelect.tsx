import { JSX } from "preact";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  multiple?: boolean;
}

export function FormSelect({
  name,
  label,
  value = "",
  placeholder = "Select an option",
  required = false,
  disabled = false,
  error,
  helpText,
  options,
  onChange,
  onBlur,
  className = "",
  multiple = false
}: FormSelectProps) {
  const hasError = Boolean(error);
  
  const baseSelectClasses = `
    w-full px-4 py-3 border rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-offset-1
    transition-colors duration-200
    disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
    appearance-none bg-white
  `;

  const selectClasses = hasError
    ? `${baseSelectClasses} border-red-300 focus:border-red-500 focus:ring-red-500`
    : `${baseSelectClasses} border-slate-300 focus:border-antko-blue-500 focus:ring-antko-blue-500`;

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
        <select
          id={name}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          multiple={multiple}
          class={selectClasses}
          onChange={(e) => onChange && onChange(e.currentTarget.value)}
          onBlur={onBlur}
        >
          {!multiple && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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