"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { PasswordCard } from "@/components/password-card/password-card";
import { SearchInput } from "@/components/search-input/search-input";
import { savePasswords, usePasswords, type PasswordItem } from "@/lib/passwords";

type PasswordListProps = {
  onEdit: (item: PasswordItem) => void;
};

export function PasswordList({ onEdit }: PasswordListProps) {
  const passwords = usePasswords();
  const [query, setQuery] = useState("");

  const filteredPasswords = passwords.filter((item) =>
    `${item.site} ${item.username}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (id: string) => {
    savePasswords(passwords.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar senhas..." />

      {filteredPasswords.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPasswords.map((item) => (
            <PasswordCard
              key={item.id}
              site={item.site}
              username={item.username}
              password={item.password}
              onEdit={() => onEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/40 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
            <Lock className="size-6" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              {query ? "Nenhum resultado para a busca" : "Nenhuma senha salva"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {query
                ? "Tente buscar por outro site ou usuário."
                : 'Clique em "Nova Senha" para começar.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
