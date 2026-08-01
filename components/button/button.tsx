"use client";

import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "default" | "icon";

type ButtonProps = Omit<
  React.ComponentProps<typeof motion.button>,
  "ref" | "whileTap" | "transition" | "className"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-[background-color,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-background shadow-sm shadow-primary/25 hover:bg-primary/90",
  secondary: "border border-border bg-card text-foreground hover:bg-hover",
  danger: "border border-red-500/40 text-red-400 hover:bg-red-500/10",
  ghost: "text-muted hover:bg-hover hover:text-foreground",
};

const sizeClassName: Record<ButtonSize, string> = {
  default: "px-4 py-2",
  icon: "size-9",
};

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`${baseClassName} ${variantClassName[variant]} ${sizeClassName[size]} ${className}`}
      {...props}
    />
  );
}
