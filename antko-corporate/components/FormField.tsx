import { JSX } from "preact";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "url" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  value?: string | number;
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  step?: string;
  min?: string | number;
  max?: string | number;
  children?: JSX.Element;
}

export function FormField({ 
  label, 
  name, 
  type = "text",
  placeholder,
  value,
  checked,
  required,
  disabled,
  error,
  help,
  options,
  rows = 4,
  step,
  min,
  max,
  children
}: FormFieldProps) {
  const id = `field-${name}`;
  const hasError = !!error;
  
  const inputClasses = hasError 
    ? "form-input border-red-300 focus:border-red-500 focus:ring-red-500"
    : "form-input";

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            required={required}
            disabled={disabled}
            rows={rows}
            class={`form-textarea ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          >
            {value}
          </textarea>
        );
      
      case "select":
        return (
          <select
            id={id}
            name={name}
            required={required}
            disabled={disabled}
            class={inputClasses}
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case "checkbox":
        return (
          <div class="flex items-center">
            <input
              id={id}
              name={name}
              type="checkbox"
              checked={checked}
              required={required}
              disabled={disabled}
              class="h-4 w-4 text-antko-blue-600 focus:ring-antko-blue-500 border-slate-300 rounded"
            />
            <label htmlFor={id} class="ml-2 block text-sm font-medium text-slate-700">
              {label}
            </label>
          </div>
        );
      
      default:
        return (
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            required={required}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
            class={inputClasses}
          />
        );
    }
  };

  if (type === "checkbox") {
    return (
      <div class="mb-4">
        {renderInput()}
        {error && (
          <p class="mt-1 text-sm text-red-600">{error}</p>
        )}
        {help && (
          <p class="mt-1 text-sm text-slate-500">{help}</p>
        )}
      </div>
    );
  }

  return (
    <div class="mb-4">
      <label htmlFor={id} class="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p class="mt-1 text-sm text-red-600 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {error}
        </p>
      )}
      
      {help && (
        <p class="mt-1 text-sm text-slate-500">{help}</p>
      )}
      
      {children}
    </div>
  );
}