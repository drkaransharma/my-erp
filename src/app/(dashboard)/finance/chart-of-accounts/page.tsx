"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AccountsTable } from "@/components/finance/accounts-table";
import { AccountForm } from "@/components/finance/account-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Account } from "@/types/finance";

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const fetchAccounts = useCallback(async () => {
    const res = await fetch("/api/accounts");
    const data = await res.json();
    setAccounts(data);
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingAccount(null);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader title="Chart of Accounts" description="Manage your organization's chart of accounts">
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </PageHeader>

      <AccountsTable accounts={accounts} onEdit={handleEdit} />

      <AccountForm
        open={formOpen}
        onOpenChange={setFormOpen}
        account={editingAccount}
        onSave={fetchAccounts}
      />
    </div>
  );
}
