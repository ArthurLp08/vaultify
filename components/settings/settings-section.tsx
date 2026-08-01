type SettingsSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
