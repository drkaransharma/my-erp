"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AccountsTable } from "@/components/finance/accounts-table";
import { AccountForm } from "@/components/finance/account-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUser } from "@/lib/user-context";
import type { Account } from "@/types/finance";

export default function ChartOfAccountsPage() {
  const { hasPermission } = useUser();
  const canCreate = hasPermission("finance", "create");
  const canEdit = hasPermission("finance", "edit");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const fetchAccounts = useCallback(async () => {
    const res = await fetch("/api/accounts");
    setAccounts(await res.json());
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  return (
    <div>
      <PageHeader title="Chart of Accounts" description="Manage your organization's chart of accounts">
        {canCreate && (
          <Button onClick={() => { setEditingAccount(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />Add Account
          </Button>
        )}
      </PageHeader>
      <AccountsTable accounts={accounts} onEdit={canEdit ? (a) => { setEditingAccount(a); setFormOpen(true); } : undefined} />
      {(canCreate || canEdit) && (
        <AccountForm open={formOpen} onOpenChange={setFormOpen} account={editingAccount} onSave={fetchAccounts} />
      )}
    </div>
  );
}
