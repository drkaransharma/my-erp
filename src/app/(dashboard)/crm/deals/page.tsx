"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DealsTable } from "@/components/crm/deals-table";
import { DealForm } from "@/components/crm/deal-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUser } from "@/lib/user-context";
import type { CrmDeal, CrmCompany, CrmContact } from "@/types/crm";

export default function DealsPage() {
  const { hasPermission } = useUser();
  const canCreate = hasPermission("crm", "create");
  const canEdit = hasPermission("crm", "edit");

  const [deals, setDeals] = useState<CrmDeal[]>([]);
  const [companies, setCompanies] = useState<CrmCompany[]>([]);
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CrmDeal | null>(null);

  const fetchData = useCallback(async () => {
    const [dealsRes, companiesRes, contactsRes] = await Promise.all([fetch("/api/crm/deals"), fetch("/api/crm/companies"), fetch("/api/crm/contacts")]);
    setDeals(await dealsRes.json());
    setCompanies(await companiesRes.json());
    setContacts(await contactsRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <PageHeader title="Deals" description="Manage your sales pipeline and deals">
        {canCreate && <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Deal</Button>}
      </PageHeader>
      <DealsTable deals={deals} onEdit={canEdit ? (d) => { setEditing(d); setFormOpen(true); } : undefined} />
      {(canCreate || canEdit) && <DealForm open={formOpen} onOpenChange={setFormOpen} deal={editing} companies={companies} contacts={contacts} onSave={fetchData} />}
    </div>
  );
}
