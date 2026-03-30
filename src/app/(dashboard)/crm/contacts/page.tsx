"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ContactsTable } from "@/components/crm/contacts-table";
import { ContactForm } from "@/components/crm/contact-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { CrmContact, CrmCompany } from "@/types/crm";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [companies, setCompanies] = useState<CrmCompany[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CrmContact | null>(null);

  const fetchData = useCallback(async () => {
    const [contactsRes, companiesRes] = await Promise.all([
      fetch("/api/crm/contacts"),
      fetch("/api/crm/companies"),
    ]);
    setContacts(await contactsRes.json());
    setCompanies(await companiesRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      <PageHeader title="Contacts" description="Manage your CRM contacts">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Contact
        </Button>
      </PageHeader>
      <ContactsTable contacts={contacts} onEdit={(c) => { setEditing(c); setFormOpen(true); }} />
      <ContactForm open={formOpen} onOpenChange={setFormOpen} contact={editing} companies={companies} onSave={fetchData} />
    </div>
  );
}
