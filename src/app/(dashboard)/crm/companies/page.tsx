"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { CompaniesTable } from "@/components/crm/companies-table";
import { CompanyForm } from "@/components/crm/company-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { CrmCompany } from "@/types/crm";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CrmCompany[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CrmCompany | null>(null);

  const fetch_ = useCallback(async () => {
    const res = await fetch("/api/crm/companies");
    setCompanies(await res.json());
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return (
    <div>
      <PageHeader title="Companies" description="Manage your CRM companies and organizations">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Company
        </Button>
      </PageHeader>
      <CompaniesTable companies={companies} onEdit={(c) => { setEditing(c); setFormOpen(true); }} />
      <CompanyForm open={formOpen} onOpenChange={setFormOpen} company={editing} onSave={fetch_} />
    </div>
  );
}
