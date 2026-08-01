import { useId } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        className={`h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted transition-colors duration-200 focus:border-primary focus:outline-none read-only:cursor-not-allowed read-only:opacity-70 ${className}`}
        {...props}
      />
    </div>
  );
}
