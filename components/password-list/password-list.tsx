"use client";

import { useState } from "react";
import { AlertTriangle, Lock } from "lucide-react";
import { PasswordCard } from "@/components/password-card/password-card";
import { SearchInput } from "@/components/search-input/search-input";
import { Button } from "@/components/button/button";
import {
  deletePassword,
  usePasswords,
  type PasswordItem,
} from "@/lib/passwords";

type PasswordListProps = {
  onEdit: (item: PasswordItem) => void;
};

export function PasswordList({ onEdit }: PasswordListProps) {
  const { passwords, loading, error, refresh } = usePasswords();
  const [query, setQuery] = useState("");

  const filteredPasswords = passwords.filter((item) =>
    `${item.site} ${item.username}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deletePassword(id);
    } catch {
      refresh();
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar senhas..." />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-lg border border-border bg-card/60"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/40 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-lg bg-red-500/10 text-red-400">
            <AlertTriangle className="size-6" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              Não foi possível carregar as senhas
            </p>
            <p className="mt-1 text-xs text-muted">{error}</p>
          </div>
          <Button type="button" variant="secondary" onClick={refresh}>
            Tentar novamente
          </Button>
        </div>
      ) : filteredPasswords.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {filteredPasswords.map((item, index) => (
            <PasswordCard
              key={item.id}
              site={item.site}
              username={item.username}
              password={item.password}
              delay={Math.min(index * 0.04, 0.3)}
              onEdit={() => onEdit(item)}
              onDelete={() => void handleDelete(item.id)}
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
