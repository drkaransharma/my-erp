"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LeadsTable } from "@/components/crm/leads-table";
import { LeadForm } from "@/components/crm/lead-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUser } from "@/lib/user-context";
import type { CrmLead, CrmCompany, CrmContact } from "@/types/crm";

export default function LeadsPage() {
  const { hasPermission } = useUser();
  const canCreate = hasPermission("crm", "create");
  const canEdit = hasPermission("crm", "edit");

  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [companies, setCompanies] = useState<CrmCompany[]>([]);
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CrmLead | null>(null);

  const fetchData = useCallback(async () => {
    const [leadsRes, companiesRes, contactsRes] = await Promise.all([fetch("/api/crm/leads"), fetch("/api/crm/companies"), fetch("/api/crm/contacts")]);
    setLeads(await leadsRes.json());
    setCompanies(await companiesRes.json());
    setContacts(await contactsRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <PageHeader title="Leads" description="Track and manage sales leads">
        {canCreate && <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Lead</Button>}
      </PageHeader>
      <LeadsTable leads={leads} onEdit={canEdit ? (l) => { setEditing(l); setFormOpen(true); } : undefined} />
      {(canCreate || canEdit) && <LeadForm open={formOpen} onOpenChange={setFormOpen} lead={editing} companies={companies} contacts={contacts} onSave={fetchData} />}
    </div>
  );
}
