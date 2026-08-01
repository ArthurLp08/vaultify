import { TopBar } from "@/components/topbar/topbar";
import { ProfileForm } from "@/components/settings/profile-form";
import { SecurityForm } from "@/components/settings/security-form";
import { SessionSection } from "@/components/settings/session-section";

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Configurações" />
      <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <ProfileForm />
          <SecurityForm />
        </div>
        <SessionSection />
      </div>
    </>
  );
}
