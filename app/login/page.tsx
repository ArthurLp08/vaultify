import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(90,132,255,0.14),transparent)]"
      />
      <div className="relative flex w-full justify-center">
        <AuthForm />
      </div>
    </div>
  );
}
