"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/input/input";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  variant?: "default" | "card";
};

const eyeButtonClassName =
  "grid size-8 place-items-center rounded-lg text-muted transition-colors duration-200 hover:bg-hover hover:text-foreground";

export function PasswordInput({
  label,
  variant = "card",
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      label={label}
      type={showPassword ? "text" : "password"}
      variant={variant}
      className={`pr-10 ${className}`}
      suffix={
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          className={eyeButtonClassName}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      }
      {...props}
    />
  );
}
