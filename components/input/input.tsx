import { useId } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  variant?: "default" | "card";
  suffix?: React.ReactNode;
};

export function Input({
  label,
  id,
  variant = "default",
  suffix,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const backgroundClassName = variant === "card" ? "bg-background" : "bg-card";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`h-10 w-full rounded-lg border border-border ${backgroundClassName} px-3 text-sm text-foreground placeholder:text-muted/70 transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none read-only:cursor-not-allowed read-only:opacity-70 ${className}`}
          {...props}
        />
        {suffix && (
          <div className="absolute right-1 top-1 grid place-items-center">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}
