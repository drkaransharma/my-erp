export type ContactStatus = "ACTIVE" | "INACTIVE";
export type LeadSource = "WEBSITE" | "REFERRAL" | "LINKEDIN" | "COLD_CALL" | "TRADE_SHOW" | "OTHER";
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";
export type DealStage = "PROSPECTING" | "QUALIFICATION" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";

export interface CrmCompany {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { contacts: number; deals: number };
  _dealValue?: number;
}

export interface CrmContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  companyId: string | null;
  status: ContactStatus;
  notes: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company?: CrmCompany;
}

export interface CrmLead {
  id: string;
  title: string;
  contactId: string | null;
  companyId: string | null;
  source: LeadSource;
  status: LeadStatus;
  value: number;
  assignedTo: string | null;
  probability: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  contact?: CrmContact;
  company?: CrmCompany;
}

export interface CrmDeal {
  id: string;
  title: string;
  companyId: string | null;
  contactId: string | null;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  company?: CrmCompany;
  contact?: CrmContact;
}
