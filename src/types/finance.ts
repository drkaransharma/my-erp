export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
export type JournalEntryStatus = "DRAFT" | "POSTED" | "VOIDED";
export type BillStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";
export type InvoiceStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  subtype: string | null;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  status: JournalEntryStatus;
  reference: string | null;
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
  updatedAt: string;
  lines?: JournalEntryLine[];
}

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  description: string | null;
  debit: number;
  credit: number;
  account?: Account;
}

export interface Vendor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  date: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  status: BillStatus;
  description: string | null;
  vendor?: Vendor;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  date: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  status: InvoiceStatus;
  description: string | null;
  customer?: Customer;
}
