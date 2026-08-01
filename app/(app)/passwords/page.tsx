"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/topbar/topbar";
import { PasswordList } from "@/components/password-list/password-list";
import { PasswordFormDialog } from "@/components/password-form/password-form";
import type { PasswordItem } from "@/lib/passwords";

export default function PasswordsPage() {
  const [dialog, setDialog] = useState<PasswordItem | null | undefined>(
    undefined
  );

  return (
    <>
      <TopBar title="Minhas Senhas" onNewPassword={() => setDialog(null)} />
      <PasswordList onEdit={setDialog} />

      <AnimatePresence>
        {dialog !== undefined && (
          <PasswordFormDialog
            key={dialog?.id ?? "new"}
            initialData={dialog}
            onClose={() => setDialog(undefined)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
