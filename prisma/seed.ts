import { PrismaClient, AccountType, JournalEntryStatus, BillStatus, InvoiceStatus, ContactStatus, LeadSource, LeadStatus, DealStage, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();
  await prisma.crmDeal.deleteMany();
  await prisma.crmLead.deleteMany();
  await prisma.crmContact.deleteMany();
  await prisma.crmCompany.deleteMany();
  await prisma.journalEntryLine.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.account.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.customer.deleteMany();

  console.log("Cleared existing data");

  // ==================== ACCOUNTS ====================
  const accounts = await Promise.all([
    // Assets (1000s)
    prisma.account.create({ data: { code: "1000", name: "Cash", type: AccountType.ASSET, subtype: "Current Asset", balance: 284500.00 } }),
    prisma.account.create({ data: { code: "1100", name: "Petty Cash", type: AccountType.ASSET, subtype: "Current Asset", balance: 1500.00 } }),
    prisma.account.create({ data: { code: "1200", name: "Accounts Receivable", type: AccountType.ASSET, subtype: "Current Asset", balance: 127800.00 } }),
    prisma.account.create({ data: { code: "1300", name: "Inventory", type: AccountType.ASSET, subtype: "Current Asset", balance: 95000.00 } }),
    prisma.account.create({ data: { code: "1400", name: "Prepaid Expenses", type: AccountType.ASSET, subtype: "Current Asset", balance: 12000.00 } }),
    prisma.account.create({ data: { code: "1500", name: "Equipment", type: AccountType.ASSET, subtype: "Fixed Asset", balance: 175000.00 } }),
    prisma.account.create({ data: { code: "1600", name: "Accumulated Depreciation", type: AccountType.ASSET, subtype: "Fixed Asset", balance: -35000.00 } }),

    // Liabilities (2000s)
    prisma.account.create({ data: { code: "2000", name: "Accounts Payable", type: AccountType.LIABILITY, subtype: "Current Liability", balance: 89300.00 } }),
    prisma.account.create({ data: { code: "2100", name: "Accrued Expenses", type: AccountType.LIABILITY, subtype: "Current Liability", balance: 15200.00 } }),
    prisma.account.create({ data: { code: "2200", name: "Short-term Loans", type: AccountType.LIABILITY, subtype: "Current Liability", balance: 50000.00 } }),
    prisma.account.create({ data: { code: "2300", name: "Long-term Debt", type: AccountType.LIABILITY, subtype: "Long-term Liability", balance: 200000.00 } }),
    prisma.account.create({ data: { code: "2400", name: "Tax Payable", type: AccountType.LIABILITY, subtype: "Current Liability", balance: 22800.00 } }),

    // Equity (3000s)
    prisma.account.create({ data: { code: "3000", name: "Common Stock", type: AccountType.EQUITY, subtype: "Owner's Equity", balance: 150000.00 } }),
    prisma.account.create({ data: { code: "3100", name: "Retained Earnings", type: AccountType.EQUITY, subtype: "Owner's Equity", balance: 78500.00 } }),

    // Revenue (4000s)
    prisma.account.create({ data: { code: "4000", name: "Service Revenue", type: AccountType.REVENUE, subtype: "Operating Revenue", balance: 385000.00 } }),
    prisma.account.create({ data: { code: "4100", name: "Product Revenue", type: AccountType.REVENUE, subtype: "Operating Revenue", balance: 142000.00 } }),
    prisma.account.create({ data: { code: "4200", name: "Interest Income", type: AccountType.REVENUE, subtype: "Other Revenue", balance: 3500.00 } }),
    prisma.account.create({ data: { code: "4300", name: "Consulting Revenue", type: AccountType.REVENUE, subtype: "Operating Revenue", balance: 68000.00 } }),

    // Expenses (5000s)
    prisma.account.create({ data: { code: "5000", name: "Salaries & Wages", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 195000.00 } }),
    prisma.account.create({ data: { code: "5100", name: "Rent Expense", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 36000.00 } }),
    prisma.account.create({ data: { code: "5200", name: "Utilities", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 8400.00 } }),
    prisma.account.create({ data: { code: "5300", name: "Office Supplies", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 4200.00 } }),
    prisma.account.create({ data: { code: "5400", name: "Depreciation Expense", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 35000.00 } }),
    prisma.account.create({ data: { code: "5500", name: "Marketing & Advertising", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 28500.00 } }),
    prisma.account.create({ data: { code: "5600", name: "Insurance", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 9600.00 } }),
    prisma.account.create({ data: { code: "5700", name: "Professional Fees", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 15000.00 } }),
    prisma.account.create({ data: { code: "5800", name: "Travel & Entertainment", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 7800.00 } }),
    prisma.account.create({ data: { code: "5900", name: "Software & Subscriptions", type: AccountType.EXPENSE, subtype: "Operating Expense", balance: 12000.00 } }),
  ]);

  const accountMap = Object.fromEntries(accounts.map((a) => [a.code, a.id]));
  console.log(`Created ${accounts.length} accounts`);

  // ==================== VENDORS ====================
  const vendors = await Promise.all([
    prisma.vendor.create({ data: { name: "Acme Office Supplies", email: "orders@acmesupplies.com", phone: "+1-555-0101", address: "123 Supply Lane, Chicago, IL 60601" } }),
    prisma.vendor.create({ data: { name: "TechParts International", email: "sales@techparts.com", phone: "+1-555-0102", address: "456 Tech Blvd, San Jose, CA 95110" } }),
    prisma.vendor.create({ data: { name: "CloudHost Services", email: "billing@cloudhost.io", phone: "+1-555-0103", address: "789 Cloud Ave, Seattle, WA 98101" } }),
    prisma.vendor.create({ data: { name: "Legal Associates LLP", email: "invoices@legalassoc.com", phone: "+1-555-0104", address: "321 Law St, New York, NY 10001" } }),
    prisma.vendor.create({ data: { name: "Metro Insurance Group", email: "premiums@metroins.com", phone: "+1-555-0105", address: "654 Insurance Way, Hartford, CT 06101" } }),
    prisma.vendor.create({ data: { name: "Premier Marketing Co", email: "billing@premiermark.com", phone: "+1-555-0106", address: "987 Ad Row, Austin, TX 78701" } }),
  ]);

  console.log(`Created ${vendors.length} vendors`);

  // ==================== CUSTOMERS ====================
  const customers = await Promise.all([
    prisma.customer.create({ data: { name: "Global Retail Corp", email: "ap@globalretail.com", phone: "+1-555-0201", address: "100 Retail Plaza, Dallas, TX 75201" } }),
    prisma.customer.create({ data: { name: "Northern Manufacturing Ltd", email: "accounts@northmfg.com", phone: "+1-555-0202", address: "200 Factory Rd, Detroit, MI 48201" } }),
    prisma.customer.create({ data: { name: "Pacific Trading Company", email: "finance@pacifictrading.com", phone: "+1-555-0203", address: "300 Harbor Dr, Long Beach, CA 90801" } }),
    prisma.customer.create({ data: { name: "Summit Consulting Group", email: "billing@summitcg.com", phone: "+1-555-0204", address: "400 Summit Ave, Denver, CO 80201" } }),
    prisma.customer.create({ data: { name: "Riverside Healthcare", email: "procurement@riversidehealth.org", phone: "+1-555-0205", address: "500 Medical Way, Boston, MA 02101" } }),
    prisma.customer.create({ data: { name: "Atlas Logistics Inc", email: "invoices@atlaslogistics.com", phone: "+1-555-0206", address: "600 Freight Blvd, Memphis, TN 38101" } }),
    prisma.customer.create({ data: { name: "Pinnacle Software Solutions", email: "ap@pinnaclesoft.com", phone: "+1-555-0207", address: "700 Code Lane, Portland, OR 97201" } }),
  ]);

  console.log(`Created ${customers.length} customers`);

  // ==================== JOURNAL ENTRIES ====================
  const journalEntries = [
    {
      entryNumber: "JE-2026-0001",
      date: new Date("2026-01-05"),
      description: "Monthly rent payment - January",
      status: JournalEntryStatus.POSTED,
      reference: "CHK-10045",
      lines: [
        { accountCode: "5100", debit: 3000, credit: 0, description: "January rent" },
        { accountCode: "1000", debit: 0, credit: 3000, description: "Rent payment" },
      ],
    },
    {
      entryNumber: "JE-2026-0002",
      date: new Date("2026-01-10"),
      description: "Service revenue - Global Retail Corp",
      status: JournalEntryStatus.POSTED,
      reference: "INV-001",
      lines: [
        { accountCode: "1200", debit: 45000, credit: 0, description: "AR - Global Retail" },
        { accountCode: "4000", debit: 0, credit: 45000, description: "ERP implementation services" },
      ],
    },
    {
      entryNumber: "JE-2026-0003",
      date: new Date("2026-01-15"),
      description: "Payroll - January first half",
      status: JournalEntryStatus.POSTED,
      reference: "PAY-2026-01A",
      lines: [
        { accountCode: "5000", debit: 16250, credit: 0, description: "Salaries" },
        { accountCode: "1000", debit: 0, credit: 16250, description: "Payroll disbursement" },
      ],
    },
    {
      entryNumber: "JE-2026-0004",
      date: new Date("2026-01-20"),
      description: "Office supplies purchase",
      status: JournalEntryStatus.POSTED,
      reference: "PO-3021",
      lines: [
        { accountCode: "5300", debit: 1400, credit: 0, description: "Office supplies" },
        { accountCode: "2000", debit: 0, credit: 1400, description: "AP - Acme Supplies" },
      ],
    },
    {
      entryNumber: "JE-2026-0005",
      date: new Date("2026-01-25"),
      description: "Customer payment received - Northern Manufacturing",
      status: JournalEntryStatus.POSTED,
      reference: "DEP-8821",
      lines: [
        { accountCode: "1000", debit: 32000, credit: 0, description: "Payment received" },
        { accountCode: "1200", debit: 0, credit: 32000, description: "AR payment - Northern Mfg" },
      ],
    },
    {
      entryNumber: "JE-2026-0006",
      date: new Date("2026-01-31"),
      description: "Payroll - January second half",
      status: JournalEntryStatus.POSTED,
      reference: "PAY-2026-01B",
      lines: [
        { accountCode: "5000", debit: 16250, credit: 0, description: "Salaries" },
        { accountCode: "1000", debit: 0, credit: 16250, description: "Payroll disbursement" },
      ],
    },
    {
      entryNumber: "JE-2026-0007",
      date: new Date("2026-02-01"),
      description: "Monthly rent payment - February",
      status: JournalEntryStatus.POSTED,
      reference: "CHK-10058",
      lines: [
        { accountCode: "5100", debit: 3000, credit: 0, description: "February rent" },
        { accountCode: "1000", debit: 0, credit: 3000, description: "Rent payment" },
      ],
    },
    {
      entryNumber: "JE-2026-0008",
      date: new Date("2026-02-05"),
      description: "Consulting revenue - Summit Consulting",
      status: JournalEntryStatus.POSTED,
      reference: "INV-004",
      lines: [
        { accountCode: "1200", debit: 28000, credit: 0, description: "AR - Summit Consulting" },
        { accountCode: "4300", debit: 0, credit: 28000, description: "ERP consulting engagement" },
      ],
    },
    {
      entryNumber: "JE-2026-0009",
      date: new Date("2026-02-10"),
      description: "Software subscription payments",
      status: JournalEntryStatus.POSTED,
      reference: "ACH-4421",
      lines: [
        { accountCode: "5900", debit: 4000, credit: 0, description: "Monthly software licenses" },
        { accountCode: "1000", debit: 0, credit: 4000, description: "Software payment" },
      ],
    },
    {
      entryNumber: "JE-2026-0010",
      date: new Date("2026-02-15"),
      description: "Payroll - February first half",
      status: JournalEntryStatus.POSTED,
      reference: "PAY-2026-02A",
      lines: [
        { accountCode: "5000", debit: 16250, credit: 0, description: "Salaries" },
        { accountCode: "1000", debit: 0, credit: 16250, description: "Payroll disbursement" },
      ],
    },
    {
      entryNumber: "JE-2026-0011",
      date: new Date("2026-02-20"),
      description: "Marketing campaign payment",
      status: JournalEntryStatus.POSTED,
      reference: "INV-PM-2026",
      lines: [
        { accountCode: "5500", debit: 9500, credit: 0, description: "Q1 marketing campaign" },
        { accountCode: "2000", debit: 0, credit: 9500, description: "AP - Premier Marketing" },
      ],
    },
    {
      entryNumber: "JE-2026-0012",
      date: new Date("2026-02-28"),
      description: "Product revenue - Pacific Trading",
      status: JournalEntryStatus.POSTED,
      reference: "INV-003",
      lines: [
        { accountCode: "1200", debit: 35000, credit: 0, description: "AR - Pacific Trading" },
        { accountCode: "4100", debit: 0, credit: 35000, description: "ERP license sales" },
      ],
    },
    {
      entryNumber: "JE-2026-0013",
      date: new Date("2026-03-01"),
      description: "Monthly rent payment - March",
      status: JournalEntryStatus.POSTED,
      reference: "CHK-10072",
      lines: [
        { accountCode: "5100", debit: 3000, credit: 0, description: "March rent" },
        { accountCode: "1000", debit: 0, credit: 3000, description: "Rent payment" },
      ],
    },
    {
      entryNumber: "JE-2026-0014",
      date: new Date("2026-03-05"),
      description: "Service revenue - Riverside Healthcare",
      status: JournalEntryStatus.POSTED,
      reference: "INV-005",
      lines: [
        { accountCode: "1200", debit: 52000, credit: 0, description: "AR - Riverside Healthcare" },
        { accountCode: "4000", debit: 0, credit: 52000, description: "ERP integration services" },
      ],
    },
    {
      entryNumber: "JE-2026-0015",
      date: new Date("2026-03-10"),
      description: "Insurance premium - Q1",
      status: JournalEntryStatus.POSTED,
      reference: "POL-2026-Q1",
      lines: [
        { accountCode: "5600", debit: 3200, credit: 0, description: "Quarterly insurance premium" },
        { accountCode: "1000", debit: 0, credit: 3200, description: "Insurance payment" },
      ],
    },
    {
      entryNumber: "JE-2026-0016",
      date: new Date("2026-03-15"),
      description: "Equipment purchase",
      status: JournalEntryStatus.POSTED,
      reference: "PO-3045",
      lines: [
        { accountCode: "1500", debit: 25000, credit: 0, description: "Server equipment" },
        { accountCode: "1000", debit: 0, credit: 25000, description: "Equipment payment" },
      ],
    },
    {
      entryNumber: "JE-2026-0017",
      date: new Date("2026-03-20"),
      description: "Utility payments - Q1 catchup",
      status: JournalEntryStatus.POSTED,
      reference: "UTIL-Q1-2026",
      lines: [
        { accountCode: "5200", debit: 2800, credit: 0, description: "Q1 utilities" },
        { accountCode: "1000", debit: 0, credit: 2800, description: "Utility payment" },
      ],
    },
    {
      entryNumber: "JE-2026-0018",
      date: new Date("2026-03-25"),
      description: "Legal fees - contract review",
      status: JournalEntryStatus.DRAFT,
      reference: "INV-LA-0089",
      lines: [
        { accountCode: "5700", debit: 5000, credit: 0, description: "Contract review services" },
        { accountCode: "2000", debit: 0, credit: 5000, description: "AP - Legal Associates" },
      ],
    },
    {
      entryNumber: "JE-2026-0019",
      date: new Date("2026-03-28"),
      description: "Service revenue - Atlas Logistics",
      status: JournalEntryStatus.DRAFT,
      reference: "INV-006",
      lines: [
        { accountCode: "1200", debit: 38000, credit: 0, description: "AR - Atlas Logistics" },
        { accountCode: "4000", debit: 0, credit: 38000, description: "ERP implementation services" },
      ],
    },
  ];

  for (const entry of journalEntries) {
    const totalDebit = entry.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = entry.lines.reduce((sum, l) => sum + l.credit, 0);

    await prisma.journalEntry.create({
      data: {
        entryNumber: entry.entryNumber,
        date: entry.date,
        description: entry.description,
        status: entry.status,
        reference: entry.reference,
        totalDebit,
        totalCredit,
        lines: {
          create: entry.lines.map((line) => ({
            accountId: accountMap[line.accountCode],
            debit: line.debit,
            credit: line.credit,
            description: line.description,
          })),
        },
      },
    });
  }

  console.log(`Created ${journalEntries.length} journal entries`);

  // ==================== BILLS (Accounts Payable) ====================
  const bills = [
    { billNumber: "BILL-001", vendorIdx: 0, date: "2026-01-10", dueDate: "2026-02-10", amount: 1400, amountPaid: 1400, status: BillStatus.PAID, description: "Office supplies - January" },
    { billNumber: "BILL-002", vendorIdx: 1, date: "2026-01-15", dueDate: "2026-02-15", amount: 12500, amountPaid: 12500, status: BillStatus.PAID, description: "Server components" },
    { billNumber: "BILL-003", vendorIdx: 2, date: "2026-02-01", dueDate: "2026-03-01", amount: 4000, amountPaid: 4000, status: BillStatus.PAID, description: "Cloud hosting - February" },
    { billNumber: "BILL-004", vendorIdx: 5, date: "2026-02-15", dueDate: "2026-03-15", amount: 9500, amountPaid: 5000, status: BillStatus.PARTIAL, description: "Q1 marketing campaign" },
    { billNumber: "BILL-005", vendorIdx: 3, date: "2026-02-20", dueDate: "2026-03-20", amount: 7500, amountPaid: 0, status: BillStatus.OVERDUE, description: "Legal consulting - February" },
    { billNumber: "BILL-006", vendorIdx: 4, date: "2026-03-01", dueDate: "2026-03-31", amount: 3200, amountPaid: 3200, status: BillStatus.PAID, description: "Q1 insurance premium" },
    { billNumber: "BILL-007", vendorIdx: 2, date: "2026-03-01", dueDate: "2026-04-01", amount: 4000, amountPaid: 0, status: BillStatus.PENDING, description: "Cloud hosting - March" },
    { billNumber: "BILL-008", vendorIdx: 0, date: "2026-03-10", dueDate: "2026-04-10", amount: 2100, amountPaid: 0, status: BillStatus.PENDING, description: "Office supplies - March" },
    { billNumber: "BILL-009", vendorIdx: 1, date: "2026-03-15", dueDate: "2026-04-15", amount: 25000, amountPaid: 0, status: BillStatus.PENDING, description: "Server equipment purchase" },
    { billNumber: "BILL-010", vendorIdx: 3, date: "2026-03-25", dueDate: "2026-04-25", amount: 5000, amountPaid: 0, status: BillStatus.PENDING, description: "Contract review services" },
  ];

  for (const bill of bills) {
    await prisma.bill.create({
      data: {
        billNumber: bill.billNumber,
        vendorId: vendors[bill.vendorIdx].id,
        date: new Date(bill.date),
        dueDate: new Date(bill.dueDate),
        amount: bill.amount,
        amountPaid: bill.amountPaid,
        status: bill.status,
        description: bill.description,
      },
    });
  }

  console.log(`Created ${bills.length} bills`);

  // ==================== INVOICES (Accounts Receivable) ====================
  const invoices = [
    { invoiceNumber: "INV-001", customerIdx: 0, date: "2026-01-10", dueDate: "2026-02-10", amount: 45000, amountPaid: 45000, status: InvoiceStatus.PAID, description: "ERP implementation - Phase 1" },
    { invoiceNumber: "INV-002", customerIdx: 1, date: "2026-01-20", dueDate: "2026-02-20", amount: 32000, amountPaid: 32000, status: InvoiceStatus.PAID, description: "SAP integration services" },
    { invoiceNumber: "INV-003", customerIdx: 2, date: "2026-02-28", dueDate: "2026-03-30", amount: 35000, amountPaid: 15000, status: InvoiceStatus.PARTIAL, description: "ERP license and setup" },
    { invoiceNumber: "INV-004", customerIdx: 3, date: "2026-02-05", dueDate: "2026-03-05", amount: 28000, amountPaid: 0, status: InvoiceStatus.OVERDUE, description: "ERP consulting engagement" },
    { invoiceNumber: "INV-005", customerIdx: 4, date: "2026-03-05", dueDate: "2026-04-05", amount: 52000, amountPaid: 0, status: InvoiceStatus.PENDING, description: "Oracle integration services" },
    { invoiceNumber: "INV-006", customerIdx: 5, date: "2026-03-28", dueDate: "2026-04-28", amount: 38000, amountPaid: 0, status: InvoiceStatus.PENDING, description: "ERP implementation - Phase 1" },
    { invoiceNumber: "INV-007", customerIdx: 6, date: "2026-01-15", dueDate: "2026-02-15", amount: 18500, amountPaid: 18500, status: InvoiceStatus.PAID, description: "Custom module development" },
    { invoiceNumber: "INV-008", customerIdx: 0, date: "2026-03-01", dueDate: "2026-04-01", amount: 22000, amountPaid: 0, status: InvoiceStatus.PENDING, description: "ERP implementation - Phase 2" },
    { invoiceNumber: "INV-009", customerIdx: 1, date: "2026-02-10", dueDate: "2026-03-10", amount: 15000, amountPaid: 0, status: InvoiceStatus.OVERDUE, description: "Training and onboarding" },
    { invoiceNumber: "INV-010", customerIdx: 6, date: "2026-03-20", dueDate: "2026-04-20", amount: 8500, amountPaid: 0, status: InvoiceStatus.PENDING, description: "Maintenance support - Q2" },
  ];

  for (const inv of invoices) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: inv.invoiceNumber,
        customerId: customers[inv.customerIdx].id,
        date: new Date(inv.date),
        dueDate: new Date(inv.dueDate),
        amount: inv.amount,
        amountPaid: inv.amountPaid,
        status: inv.status,
        description: inv.description,
      },
    });
  }

  console.log(`Created ${invoices.length} invoices`);

  // ==================== CRM: COMPANIES ====================
  const crmCompanies = await Promise.all([
    prisma.crmCompany.create({ data: { name: "Nexus Technologies", industry: "Technology", website: "https://nexustech.com", phone: "+1-555-1001", address: "100 Innovation Dr, San Francisco, CA 94105" } }),
    prisma.crmCompany.create({ data: { name: "Meridian Healthcare", industry: "Healthcare", website: "https://meridianhealth.com", phone: "+1-555-1002", address: "200 Medical Center Blvd, Boston, MA 02115" } }),
    prisma.crmCompany.create({ data: { name: "Titan Manufacturing", industry: "Manufacturing", website: "https://titanmfg.com", phone: "+1-555-1003", address: "300 Industrial Park Rd, Detroit, MI 48201" } }),
    prisma.crmCompany.create({ data: { name: "Vertex Financial Group", industry: "Finance", website: "https://vertexfg.com", phone: "+1-555-1004", address: "400 Wall St, New York, NY 10005" } }),
    prisma.crmCompany.create({ data: { name: "Horizon Retail Co", industry: "Retail", website: "https://horizonretail.com", phone: "+1-555-1005", address: "500 Commerce Way, Dallas, TX 75201" } }),
    prisma.crmCompany.create({ data: { name: "Apex Logistics", industry: "Logistics", website: "https://apexlogistics.com", phone: "+1-555-1006", address: "600 Freight Ln, Memphis, TN 38103" } }),
    prisma.crmCompany.create({ data: { name: "Cascade Energy", industry: "Energy", website: "https://cascadeenergy.com", phone: "+1-555-1007", address: "700 Power Ave, Houston, TX 77001" } }),
    prisma.crmCompany.create({ data: { name: "Stellar Education", industry: "Education", website: "https://stellaredu.com", phone: "+1-555-1008", address: "800 Campus Dr, Palo Alto, CA 94301" } }),
    prisma.crmCompany.create({ data: { name: "Orion Consulting", industry: "Consulting", website: "https://orionconsulting.com", phone: "+1-555-1009", address: "900 Strategy Blvd, Chicago, IL 60601" } }),
    prisma.crmCompany.create({ data: { name: "Redwood Properties", industry: "Real Estate", website: "https://redwoodprop.com", phone: "+1-555-1010", address: "1000 Realty Row, Miami, FL 33101" } }),
  ]);

  console.log(`Created ${crmCompanies.length} CRM companies`);

  // ==================== CRM: CONTACTS ====================
  const crmContacts = await Promise.all([
    prisma.crmContact.create({ data: { firstName: "James", lastName: "Chen", email: "james.chen@nexustech.com", phone: "+1-555-2001", title: "CTO", companyId: crmCompanies[0].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-28") } }),
    prisma.crmContact.create({ data: { firstName: "Sarah", lastName: "Mitchell", email: "s.mitchell@nexustech.com", phone: "+1-555-2002", title: "VP Engineering", companyId: crmCompanies[0].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-20") } }),
    prisma.crmContact.create({ data: { firstName: "Dr. Emily", lastName: "Parker", email: "e.parker@meridianhealth.com", phone: "+1-555-2003", title: "COO", companyId: crmCompanies[1].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-25") } }),
    prisma.crmContact.create({ data: { firstName: "Robert", lastName: "Nguyen", email: "r.nguyen@meridianhealth.com", phone: "+1-555-2004", title: "IT Director", companyId: crmCompanies[1].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-15") } }),
    prisma.crmContact.create({ data: { firstName: "Michael", lastName: "Torres", email: "m.torres@titanmfg.com", phone: "+1-555-2005", title: "CEO", companyId: crmCompanies[2].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-22") } }),
    prisma.crmContact.create({ data: { firstName: "Lisa", lastName: "Anderson", email: "l.anderson@titanmfg.com", phone: "+1-555-2006", title: "VP Operations", companyId: crmCompanies[2].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-02-28") } }),
    prisma.crmContact.create({ data: { firstName: "David", lastName: "Kowalski", email: "d.kowalski@vertexfg.com", phone: "+1-555-2007", title: "CFO", companyId: crmCompanies[3].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-27") } }),
    prisma.crmContact.create({ data: { firstName: "Amanda", lastName: "Brooks", email: "a.brooks@horizonretail.com", phone: "+1-555-2008", title: "Head of IT", companyId: crmCompanies[4].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-18") } }),
    prisma.crmContact.create({ data: { firstName: "Kevin", lastName: "Patel", email: "k.patel@horizonretail.com", phone: "+1-555-2009", title: "Procurement Manager", companyId: crmCompanies[4].id, status: ContactStatus.INACTIVE, lastContactedAt: new Date("2026-01-10") } }),
    prisma.crmContact.create({ data: { firstName: "Rachel", lastName: "Kim", email: "r.kim@apexlogistics.com", phone: "+1-555-2010", title: "VP Technology", companyId: crmCompanies[5].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-26") } }),
    prisma.crmContact.create({ data: { firstName: "Thomas", lastName: "Wright", email: "t.wright@cascadeenergy.com", phone: "+1-555-2011", title: "CIO", companyId: crmCompanies[6].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-10") } }),
    prisma.crmContact.create({ data: { firstName: "Jennifer", lastName: "Davis", email: "j.davis@cascadeenergy.com", phone: "+1-555-2012", title: "Project Manager", companyId: crmCompanies[6].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-05") } }),
    prisma.crmContact.create({ data: { firstName: "Andrew", lastName: "Lee", email: "a.lee@stellaredu.com", phone: "+1-555-2013", title: "Dean of Technology", companyId: crmCompanies[7].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-02-20") } }),
    prisma.crmContact.create({ data: { firstName: "Maria", lastName: "Garcia", email: "m.garcia@orionconsulting.com", phone: "+1-555-2014", title: "Managing Director", companyId: crmCompanies[8].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-29") } }),
    prisma.crmContact.create({ data: { firstName: "Christopher", lastName: "Adams", email: "c.adams@orionconsulting.com", phone: "+1-555-2015", title: "Senior Partner", companyId: crmCompanies[8].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-12") } }),
    prisma.crmContact.create({ data: { firstName: "Natalie", lastName: "Brown", email: "n.brown@redwoodprop.com", phone: "+1-555-2016", title: "VP Operations", companyId: crmCompanies[9].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-08") } }),
    prisma.crmContact.create({ data: { firstName: "Daniel", lastName: "Wilson", email: "d.wilson@redwoodprop.com", phone: "+1-555-2017", title: "IT Manager", companyId: crmCompanies[9].id, status: ContactStatus.INACTIVE, lastContactedAt: new Date("2025-12-15") } }),
    prisma.crmContact.create({ data: { firstName: "Sophia", lastName: "Martinez", email: "s.martinez@nexustech.com", phone: "+1-555-2018", title: "Product Manager", companyId: crmCompanies[0].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-24") } }),
    prisma.crmContact.create({ data: { firstName: "Ryan", lastName: "Thompson", email: "r.thompson@titanmfg.com", phone: "+1-555-2019", title: "Plant Manager", companyId: crmCompanies[2].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-01") } }),
    prisma.crmContact.create({ data: { firstName: "Olivia", lastName: "Johnson", email: "o.johnson@vertexfg.com", phone: "+1-555-2020", title: "Director of Digital", companyId: crmCompanies[3].id, status: ContactStatus.ACTIVE, lastContactedAt: new Date("2026-03-19") } }),
  ]);

  console.log(`Created ${crmContacts.length} CRM contacts`);

  // ==================== CRM: LEADS ====================
  const leads = [
    { title: "ERP Migration - Nexus Tech", contactIdx: 0, companyIdx: 0, source: LeadSource.WEBSITE, status: LeadStatus.WON, value: 180000, assignedTo: "Alex Rivera", probability: 100 },
    { title: "SAP Integration - Meridian", contactIdx: 2, companyIdx: 1, source: LeadSource.REFERRAL, status: LeadStatus.NEGOTIATION, value: 145000, assignedTo: "Alex Rivera", probability: 75 },
    { title: "Oracle Upgrade - Titan Mfg", contactIdx: 4, companyIdx: 2, source: LeadSource.TRADE_SHOW, status: LeadStatus.PROPOSAL, value: 210000, assignedTo: "Jordan Blake", probability: 50 },
    { title: "Finance Module - Vertex FG", contactIdx: 6, companyIdx: 3, source: LeadSource.LINKEDIN, status: LeadStatus.QUALIFIED, value: 95000, assignedTo: "Jordan Blake", probability: 30 },
    { title: "Retail ERP Suite - Horizon", contactIdx: 7, companyIdx: 4, source: LeadSource.COLD_CALL, status: LeadStatus.CONTACTED, value: 120000, assignedTo: "Sam Ortiz", probability: 15 },
    { title: "Logistics Platform - Apex", contactIdx: 9, companyIdx: 5, source: LeadSource.WEBSITE, status: LeadStatus.NEW, value: 85000, assignedTo: "Sam Ortiz", probability: 5 },
    { title: "Energy Grid Analytics - Cascade", contactIdx: 10, companyIdx: 6, source: LeadSource.REFERRAL, status: LeadStatus.PROPOSAL, value: 165000, assignedTo: "Alex Rivera", probability: 50 },
    { title: "Campus ERP - Stellar Edu", contactIdx: 12, companyIdx: 7, source: LeadSource.TRADE_SHOW, status: LeadStatus.CONTACTED, value: 72000, assignedTo: "Jordan Blake", probability: 15 },
    { title: "Consulting Platform - Orion", contactIdx: 13, companyIdx: 8, source: LeadSource.LINKEDIN, status: LeadStatus.NEGOTIATION, value: 130000, assignedTo: "Alex Rivera", probability: 75 },
    { title: "Property Management - Redwood", contactIdx: 15, companyIdx: 9, source: LeadSource.COLD_CALL, status: LeadStatus.QUALIFIED, value: 58000, assignedTo: "Sam Ortiz", probability: 30 },
    { title: "HR Module Add-on - Nexus", contactIdx: 1, companyIdx: 0, source: LeadSource.REFERRAL, status: LeadStatus.WON, value: 65000, assignedTo: "Jordan Blake", probability: 100 },
    { title: "Inventory System - Titan", contactIdx: 5, companyIdx: 2, source: LeadSource.WEBSITE, status: LeadStatus.LOST, value: 90000, assignedTo: "Sam Ortiz", probability: 0 },
    { title: "Digital Transformation - Vertex", contactIdx: 19, companyIdx: 3, source: LeadSource.LINKEDIN, status: LeadStatus.NEW, value: 200000, assignedTo: "Alex Rivera", probability: 5 },
    { title: "Supply Chain AI - Apex", contactIdx: 9, companyIdx: 5, source: LeadSource.TRADE_SHOW, status: LeadStatus.QUALIFIED, value: 110000, assignedTo: "Jordan Blake", probability: 30 },
    { title: "Data Analytics Platform - Cascade", contactIdx: 11, companyIdx: 6, source: LeadSource.OTHER, status: LeadStatus.LOST, value: 75000, assignedTo: "Sam Ortiz", probability: 0 },
  ];

  for (const lead of leads) {
    await prisma.crmLead.create({
      data: {
        title: lead.title,
        contactId: crmContacts[lead.contactIdx].id,
        companyId: crmCompanies[lead.companyIdx].id,
        source: lead.source,
        status: lead.status,
        value: lead.value,
        assignedTo: lead.assignedTo,
        probability: lead.probability,
      },
    });
  }

  console.log(`Created ${leads.length} CRM leads`);

  // ==================== CRM: DEALS ====================
  const deals = [
    { title: "Nexus Tech - Full ERP Implementation", companyIdx: 0, contactIdx: 0, value: 180000, stage: DealStage.CLOSED_WON, probability: 100, expectedClose: "2026-02-28", actualClose: "2026-02-25" },
    { title: "Nexus Tech - HR Module Add-on", companyIdx: 0, contactIdx: 1, value: 65000, stage: DealStage.CLOSED_WON, probability: 100, expectedClose: "2026-03-15", actualClose: "2026-03-12" },
    { title: "Meridian Healthcare - SAP Integration", companyIdx: 1, contactIdx: 2, value: 145000, stage: DealStage.NEGOTIATION, probability: 75, expectedClose: "2026-04-30", actualClose: null },
    { title: "Titan Manufacturing - Oracle Upgrade", companyIdx: 2, contactIdx: 4, value: 210000, stage: DealStage.PROPOSAL, probability: 50, expectedClose: "2026-05-15", actualClose: null },
    { title: "Vertex Financial - Finance Module", companyIdx: 3, contactIdx: 6, value: 95000, stage: DealStage.QUALIFICATION, probability: 25, expectedClose: "2026-06-01", actualClose: null },
    { title: "Horizon Retail - ERP Suite", companyIdx: 4, contactIdx: 7, value: 120000, stage: DealStage.PROSPECTING, probability: 10, expectedClose: "2026-07-01", actualClose: null },
    { title: "Cascade Energy - Grid Analytics", companyIdx: 6, contactIdx: 10, value: 165000, stage: DealStage.PROPOSAL, probability: 50, expectedClose: "2026-05-01", actualClose: null },
    { title: "Orion Consulting - Platform Build", companyIdx: 8, contactIdx: 13, value: 130000, stage: DealStage.NEGOTIATION, probability: 75, expectedClose: "2026-04-15", actualClose: null },
    { title: "Redwood Properties - Property Mgmt", companyIdx: 9, contactIdx: 15, value: 58000, stage: DealStage.QUALIFICATION, probability: 25, expectedClose: "2026-06-15", actualClose: null },
    { title: "Apex Logistics - Supply Chain AI", companyIdx: 5, contactIdx: 9, value: 110000, stage: DealStage.PROSPECTING, probability: 10, expectedClose: "2026-08-01", actualClose: null },
    { title: "Titan Manufacturing - Inventory System", companyIdx: 2, contactIdx: 5, value: 90000, stage: DealStage.CLOSED_LOST, probability: 0, expectedClose: "2026-03-01", actualClose: "2026-02-20" },
    { title: "Stellar Education - Campus ERP", companyIdx: 7, contactIdx: 12, value: 72000, stage: DealStage.PROSPECTING, probability: 10, expectedClose: "2026-09-01", actualClose: null },
  ];

  for (const deal of deals) {
    await prisma.crmDeal.create({
      data: {
        title: deal.title,
        companyId: crmCompanies[deal.companyIdx].id,
        contactId: crmContacts[deal.contactIdx].id,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        expectedCloseDate: new Date(deal.expectedClose),
        actualCloseDate: deal.actualClose ? new Date(deal.actualClose) : null,
      },
    });
  }

  console.log(`Created ${deals.length} CRM deals`);

  // ==================== ADMIN: ROLES ====================
  const allPerms = { view: true, create: true, edit: true, delete: true };
  const viewOnly = { view: true, create: false, edit: false, delete: false };
  const viewCreate = { view: true, create: true, edit: false, delete: false };
  const noAccess = { view: false, create: false, edit: false, delete: false };

  const roles = await Promise.all([
    prisma.role.create({ data: { name: "Super Admin", description: "Full access to all modules", isSystem: true, permissions: { finance: allPerms, crm: allPerms, hr: allPerms, inventory: allPerms, admin: allPerms } } }),
    prisma.role.create({ data: { name: "Finance Admin", description: "Full finance access, view others", isSystem: true, permissions: { finance: allPerms, crm: viewOnly, hr: viewOnly, inventory: viewOnly, admin: noAccess } } }),
    prisma.role.create({ data: { name: "Finance User", description: "View and create in finance", isSystem: true, permissions: { finance: viewCreate, crm: viewOnly, hr: noAccess, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "CRM Admin", description: "Full CRM access, view others", isSystem: true, permissions: { finance: viewOnly, crm: allPerms, hr: viewOnly, inventory: viewOnly, admin: noAccess } } }),
    prisma.role.create({ data: { name: "CRM User", description: "View and create in CRM", isSystem: true, permissions: { finance: noAccess, crm: viewCreate, hr: noAccess, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "HR Admin", description: "Full HR access, view others", isSystem: true, permissions: { finance: viewOnly, crm: viewOnly, hr: allPerms, inventory: viewOnly, admin: noAccess } } }),
    prisma.role.create({ data: { name: "HR User", description: "View and create in HR", isSystem: true, permissions: { finance: noAccess, crm: noAccess, hr: viewCreate, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "Inventory Admin", description: "Full inventory access, view others", isSystem: true, permissions: { finance: viewOnly, crm: viewOnly, hr: viewOnly, inventory: allPerms, admin: noAccess } } }),
    prisma.role.create({ data: { name: "Inventory User", description: "View and create in inventory", isSystem: true, permissions: { finance: noAccess, crm: noAccess, hr: noAccess, inventory: viewCreate, admin: noAccess } } }),
    prisma.role.create({ data: { name: "Viewer", description: "Read-only access to all modules", isSystem: true, permissions: { finance: viewOnly, crm: viewOnly, hr: viewOnly, inventory: viewOnly, admin: noAccess } } }),
  ]);

  console.log(`Created ${roles.length} roles`);

  // ==================== ADMIN: DEPARTMENTS ====================
  const departments = await Promise.all([
    prisma.department.create({ data: { name: "Executive", description: "C-suite and executive leadership" } }),
    prisma.department.create({ data: { name: "Finance", description: "Financial planning, accounting, and reporting" } }),
    prisma.department.create({ data: { name: "Sales & CRM", description: "Sales, business development, and customer relationships" } }),
    prisma.department.create({ data: { name: "Human Resources", description: "People operations, recruitment, and culture" } }),
    prisma.department.create({ data: { name: "Operations", description: "Supply chain, inventory, and logistics" } }),
    prisma.department.create({ data: { name: "IT & Engineering", description: "Technology infrastructure and software development" } }),
  ]);

  console.log(`Created ${departments.length} departments`);

  // ==================== ADMIN: USERS ====================
  // Create users in hierarchy order
  const ceo = await prisma.user.create({ data: { firstName: "Richard", lastName: "Sterling", email: "r.sterling@myerp.com", password: "myerp@2026", title: "Chief Executive Officer", roleId: roles[0].id, departmentId: departments[0].id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-30T08:15:00") } });

  const vpFinance = await prisma.user.create({ data: { firstName: "Catherine", lastName: "Wells", email: "c.wells@myerp.com", password: "myerp@2026", title: "VP of Finance", roleId: roles[1].id, departmentId: departments[1].id, reportsToId: ceo.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-30T09:00:00") } });
  const vpSales = await prisma.user.create({ data: { firstName: "Marcus", lastName: "Reed", email: "m.reed@myerp.com", password: "myerp@2026", title: "VP of Sales", roleId: roles[3].id, departmentId: departments[2].id, reportsToId: ceo.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-29T14:30:00") } });
  const vpHR = await prisma.user.create({ data: { firstName: "Diana", lastName: "Shaw", email: "d.shaw@myerp.com", password: "myerp@2026", title: "VP of Human Resources", roleId: roles[5].id, departmentId: departments[3].id, reportsToId: ceo.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-30T07:45:00") } });
  const vpOps = await prisma.user.create({ data: { firstName: "Frank", lastName: "Gomez", email: "f.gomez@myerp.com", password: "myerp@2026", title: "VP of Operations", roleId: roles[7].id, departmentId: departments[4].id, reportsToId: ceo.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-28T16:20:00") } });
  const cto = await prisma.user.create({ data: { firstName: "Elena", lastName: "Vasquez", email: "e.vasquez@myerp.com", password: "myerp@2026", title: "Chief Technology Officer", roleId: roles[0].id, departmentId: departments[5].id, reportsToId: ceo.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-30T10:00:00") } });

  // Finance staff
  await prisma.user.create({ data: { firstName: "Laura", lastName: "Chen", email: "l.chen@myerp.com", password: "myerp@2026", title: "Senior Accountant", roleId: roles[2].id, departmentId: departments[1].id, reportsToId: vpFinance.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-30T08:30:00") } });
  await prisma.user.create({ data: { firstName: "Brian", lastName: "Patel", email: "b.patel@myerp.com", password: "myerp@2026", title: "Financial Analyst", roleId: roles[2].id, departmentId: departments[1].id, reportsToId: vpFinance.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-29T11:00:00") } });
  await prisma.user.create({ data: { firstName: "Jessica", lastName: "Morgan", email: "j.morgan@myerp.com", password: "myerp@2026", title: "Accounts Clerk", roleId: roles[2].id, departmentId: departments[1].id, reportsToId: vpFinance.id, status: UserStatus.INACTIVE, lastLoginAt: new Date("2026-02-15T09:00:00") } });

  // Sales staff
  await prisma.user.create({ data: { firstName: "Alex", lastName: "Rivera", email: "a.rivera@myerp.com", password: "myerp@2026", title: "Sales Manager", roleId: roles[4].id, departmentId: departments[2].id, reportsToId: vpSales.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-30T09:15:00") } });
  await prisma.user.create({ data: { firstName: "Jordan", lastName: "Blake", email: "j.blake@myerp.com", password: "myerp@2026", title: "Account Executive", roleId: roles[4].id, departmentId: departments[2].id, reportsToId: vpSales.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-29T15:45:00") } });
  await prisma.user.create({ data: { firstName: "Sam", lastName: "Ortiz", email: "s.ortiz@myerp.com", password: "myerp@2026", title: "Sales Representative", roleId: roles[4].id, departmentId: departments[2].id, reportsToId: vpSales.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-28T10:30:00") } });

  // HR staff
  await prisma.user.create({ data: { firstName: "Priya", lastName: "Kapoor", email: "p.kapoor@myerp.com", password: "myerp@2026", title: "HR Manager", roleId: roles[6].id, departmentId: departments[3].id, reportsToId: vpHR.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-30T08:00:00") } });
  await prisma.user.create({ data: { firstName: "Tom", lastName: "Harrison", email: "t.harrison@myerp.com", password: "myerp@2026", title: "Recruiter", roleId: roles[6].id, departmentId: departments[3].id, reportsToId: vpHR.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-27T13:00:00") } });

  // Operations staff
  await prisma.user.create({ data: { firstName: "Nina", lastName: "West", email: "n.west@myerp.com", password: "myerp@2026", title: "Warehouse Manager", roleId: roles[8].id, departmentId: departments[4].id, reportsToId: vpOps.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-29T07:00:00") } });
  await prisma.user.create({ data: { firstName: "Derek", lastName: "Simmons", email: "d.simmons@myerp.com", password: "myerp@2026", title: "Logistics Coordinator", roleId: roles[8].id, departmentId: departments[4].id, reportsToId: vpOps.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-28T14:00:00") } });

  // IT staff
  await prisma.user.create({ data: { firstName: "Kevin", lastName: "Zhang", email: "k.zhang@myerp.com", password: "myerp@2026", title: "Lead Developer", roleId: roles[9].id, departmentId: departments[5].id, reportsToId: cto.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-30T09:30:00") } });
  await prisma.user.create({ data: { firstName: "Maya", lastName: "Robinson", email: "m.robinson@myerp.com", password: "myerp@2026", title: "DevOps Engineer", roleId: roles[9].id, departmentId: departments[5].id, reportsToId: cto.id, status: UserStatus.ACTIVE, lastLoginAt: new Date("2026-03-29T16:00:00") } });

  console.log("Created 18 users");

  // Set department heads
  await prisma.department.update({ where: { id: departments[0].id }, data: { headId: ceo.id } });
  await prisma.department.update({ where: { id: departments[1].id }, data: { headId: vpFinance.id } });
  await prisma.department.update({ where: { id: departments[2].id }, data: { headId: vpSales.id } });
  await prisma.department.update({ where: { id: departments[3].id }, data: { headId: vpHR.id } });
  await prisma.department.update({ where: { id: departments[4].id }, data: { headId: vpOps.id } });
  await prisma.department.update({ where: { id: departments[5].id }, data: { headId: cto.id } });

  console.log("Set department heads");
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
