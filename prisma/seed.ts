import { PrismaClient, AccountType, JournalEntryStatus, BillStatus, InvoiceStatus, ContactStatus, LeadSource, LeadStatus, DealStage, UserStatus, EmployeeStatus, AttendanceStatus, LeaveType, LeaveStatus, PayrollStatus, ProductStatus, POStatus, MovementType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.stockMovement.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.payrollRecord.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.employee.deleteMany();
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
    prisma.role.create({ data: { name: "Finance Admin", description: "Full finance access only", isSystem: true, permissions: { finance: allPerms, crm: noAccess, hr: noAccess, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "Finance User", description: "View and create in finance only", isSystem: true, permissions: { finance: viewCreate, crm: noAccess, hr: noAccess, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "CRM Admin", description: "Full CRM access only", isSystem: true, permissions: { finance: noAccess, crm: allPerms, hr: noAccess, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "CRM User", description: "View and create in CRM only", isSystem: true, permissions: { finance: noAccess, crm: viewCreate, hr: noAccess, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "HR Admin", description: "Full HR access only", isSystem: true, permissions: { finance: noAccess, crm: noAccess, hr: allPerms, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "HR User", description: "View and create in HR only", isSystem: true, permissions: { finance: noAccess, crm: noAccess, hr: viewCreate, inventory: noAccess, admin: noAccess } } }),
    prisma.role.create({ data: { name: "Inventory Admin", description: "Full inventory access only", isSystem: true, permissions: { finance: noAccess, crm: noAccess, hr: noAccess, inventory: allPerms, admin: noAccess } } }),
    prisma.role.create({ data: { name: "Inventory User", description: "View and create in inventory only", isSystem: true, permissions: { finance: noAccess, crm: noAccess, hr: noAccess, inventory: viewCreate, admin: noAccess } } }),
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

  // ==================== HR: EMPLOYEES ====================
  const employees = await Promise.all([
    prisma.employee.create({ data: { employeeCode: "EMP-001", firstName: "Richard", lastName: "Sterling", email: "emp.sterling@myerp.com", phone: "+1-555-3001", position: "Chief Executive Officer", departmentId: departments[0].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2020-01-15"), salary: 250000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-002", firstName: "Catherine", lastName: "Wells", email: "emp.wells@myerp.com", phone: "+1-555-3002", position: "VP of Finance", departmentId: departments[1].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2020-03-01"), salary: 180000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-003", firstName: "Marcus", lastName: "Reed", email: "emp.reed@myerp.com", phone: "+1-555-3003", position: "VP of Sales", departmentId: departments[2].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2020-06-15"), salary: 175000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-004", firstName: "Diana", lastName: "Shaw", email: "emp.shaw@myerp.com", phone: "+1-555-3004", position: "VP of Human Resources", departmentId: departments[3].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2021-01-10"), salary: 165000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-005", firstName: "Frank", lastName: "Gomez", email: "emp.gomez@myerp.com", phone: "+1-555-3005", position: "VP of Operations", departmentId: departments[4].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2020-09-01"), salary: 170000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-006", firstName: "Elena", lastName: "Vasquez", email: "emp.vasquez@myerp.com", phone: "+1-555-3006", position: "CTO", departmentId: departments[5].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2020-02-01"), salary: 220000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-007", firstName: "Laura", lastName: "Chen", email: "emp.chen@myerp.com", phone: "+1-555-3007", position: "Senior Accountant", departmentId: departments[1].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2022-04-15"), salary: 95000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-008", firstName: "Brian", lastName: "Patel", email: "emp.patel@myerp.com", phone: "+1-555-3008", position: "Financial Analyst", departmentId: departments[1].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2023-01-20"), salary: 85000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-009", firstName: "Alex", lastName: "Rivera", email: "emp.rivera@myerp.com", phone: "+1-555-3009", position: "Sales Manager", departmentId: departments[2].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2022-07-01"), salary: 110000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-010", firstName: "Jordan", lastName: "Blake", email: "emp.blake@myerp.com", phone: "+1-555-3010", position: "Account Executive", departmentId: departments[2].id, status: EmployeeStatus.ON_LEAVE, joinDate: new Date("2023-03-15"), salary: 80000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-011", firstName: "Priya", lastName: "Kapoor", email: "emp.kapoor@myerp.com", phone: "+1-555-3011", position: "HR Manager", departmentId: departments[3].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2022-09-01"), salary: 95000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-012", firstName: "Nina", lastName: "West", email: "emp.west@myerp.com", phone: "+1-555-3012", position: "Warehouse Manager", departmentId: departments[4].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2021-11-15"), salary: 88000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-013", firstName: "Kevin", lastName: "Zhang", email: "emp.zhang@myerp.com", phone: "+1-555-3013", position: "Lead Developer", departmentId: departments[5].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2022-01-10"), salary: 130000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-014", firstName: "Jessica", lastName: "Morgan", email: "emp.morgan@myerp.com", phone: "+1-555-3014", position: "Accounts Clerk", departmentId: departments[1].id, status: EmployeeStatus.TERMINATED, joinDate: new Date("2023-06-01"), salary: 55000 } }),
    prisma.employee.create({ data: { employeeCode: "EMP-015", firstName: "Derek", lastName: "Simmons", email: "emp.simmons@myerp.com", phone: "+1-555-3015", position: "Logistics Coordinator", departmentId: departments[4].id, status: EmployeeStatus.ACTIVE, joinDate: new Date("2023-08-15"), salary: 72000 } }),
  ]);

  // Set managers
  for (const emp of employees.slice(1, 6)) {
    await prisma.employee.update({ where: { id: emp.id }, data: { managerId: employees[0].id } });
  }
  await prisma.employee.update({ where: { id: employees[6].id }, data: { managerId: employees[1].id } });
  await prisma.employee.update({ where: { id: employees[7].id }, data: { managerId: employees[1].id } });
  await prisma.employee.update({ where: { id: employees[8].id }, data: { managerId: employees[2].id } });
  await prisma.employee.update({ where: { id: employees[9].id }, data: { managerId: employees[2].id } });
  await prisma.employee.update({ where: { id: employees[10].id }, data: { managerId: employees[3].id } });
  await prisma.employee.update({ where: { id: employees[11].id }, data: { managerId: employees[4].id } });
  await prisma.employee.update({ where: { id: employees[12].id }, data: { managerId: employees[5].id } });
  await prisma.employee.update({ where: { id: employees[14].id }, data: { managerId: employees[4].id } });

  console.log(`Created ${employees.length} employees`);

  // ==================== HR: ATTENDANCE ====================
  const activeEmps = employees.filter(e => e.status !== "TERMINATED");
  for (const emp of activeEmps) {
    for (let d = 16; d <= 29; d++) {
      const date = new Date(`2026-03-${String(d).padStart(2, "0")}`);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      const isLate = Math.random() < 0.1;
      const isAbsent = Math.random() < 0.05;
      const checkIn = new Date(date); checkIn.setHours(isLate ? 9 + Math.floor(Math.random() * 2) : 8, Math.floor(Math.random() * 30), 0);
      const checkOut = new Date(date); checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 30), 0);
      const hours = isAbsent ? 0 : (checkOut.getTime() - checkIn.getTime()) / 3600000;
      await prisma.attendance.create({
        data: {
          employeeId: emp.id, date,
          checkIn: isAbsent ? null : checkIn,
          checkOut: isAbsent ? null : checkOut,
          hoursWorked: isAbsent ? 0 : Math.round(hours * 100) / 100,
          status: isAbsent ? AttendanceStatus.ABSENT : isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
        },
      });
    }
  }
  console.log("Created attendance records");

  // ==================== HR: LEAVE REQUESTS ====================
  const leaveRequests = [
    { empIdx: 9, type: LeaveType.ANNUAL, start: "2026-03-25", end: "2026-04-05", days: 8, reason: "Family vacation", status: LeaveStatus.APPROVED },
    { empIdx: 6, type: LeaveType.SICK, start: "2026-03-20", end: "2026-03-21", days: 2, reason: "Flu", status: LeaveStatus.APPROVED },
    { empIdx: 8, type: LeaveType.PERSONAL, start: "2026-04-10", end: "2026-04-11", days: 2, reason: "Personal appointment", status: LeaveStatus.PENDING },
    { empIdx: 12, type: LeaveType.ANNUAL, start: "2026-04-15", end: "2026-04-22", days: 5, reason: "Travel plans", status: LeaveStatus.PENDING },
    { empIdx: 10, type: LeaveType.SICK, start: "2026-03-10", end: "2026-03-11", days: 2, reason: "Medical checkup", status: LeaveStatus.APPROVED },
    { empIdx: 7, type: LeaveType.ANNUAL, start: "2026-05-01", end: "2026-05-09", days: 7, reason: "Summer break", status: LeaveStatus.PENDING },
    { empIdx: 11, type: LeaveType.UNPAID, start: "2026-04-20", end: "2026-04-21", days: 2, reason: "Personal matter", status: LeaveStatus.REJECTED },
    { empIdx: 14, type: LeaveType.ANNUAL, start: "2026-04-01", end: "2026-04-04", days: 4, reason: "Conference attendance", status: LeaveStatus.APPROVED },
  ];
  for (const lr of leaveRequests) {
    await prisma.leaveRequest.create({
      data: { employeeId: employees[lr.empIdx].id, leaveType: lr.type, startDate: new Date(lr.start), endDate: new Date(lr.end), days: lr.days, reason: lr.reason, status: lr.status },
    });
  }
  console.log(`Created ${leaveRequests.length} leave requests`);

  // ==================== HR: PAYROLL ====================
  for (const emp of activeEmps) {
    for (const month of ["2026-02", "2026-03"]) {
      const basic = Number(emp.salary) / 12;
      const allowances = basic * 0.15;
      const deductions = basic * 0.08;
      const net = basic + allowances - deductions;
      await prisma.payrollRecord.create({
        data: { employeeId: emp.id, month, basicSalary: Math.round(basic), allowances: Math.round(allowances), deductions: Math.round(deductions), netPay: Math.round(net), status: month === "2026-02" ? PayrollStatus.PAID : PayrollStatus.PROCESSED },
      });
    }
  }
  console.log("Created payroll records");

  // ==================== INVENTORY: WAREHOUSES ====================
  const warehouses = await Promise.all([
    prisma.warehouse.create({ data: { name: "Main Warehouse", location: "Chicago, IL", capacity: 5000, description: "Primary storage facility" } }),
    prisma.warehouse.create({ data: { name: "East Coast Hub", location: "Newark, NJ", capacity: 3000, description: "East coast distribution center" } }),
    prisma.warehouse.create({ data: { name: "West Coast Hub", location: "Los Angeles, CA", capacity: 3500, description: "West coast distribution center" } }),
    prisma.warehouse.create({ data: { name: "Returns Center", location: "Dallas, TX", capacity: 1500, description: "Returns processing facility" } }),
  ]);
  console.log(`Created ${warehouses.length} warehouses`);

  // ==================== INVENTORY: PRODUCTS ====================
  const products = await Promise.all([
    prisma.product.create({ data: { sku: "ELEC-001", name: "Business Laptop Pro", category: "Electronics", quantity: 45, unitPrice: 1299.99, reorderLevel: 20, warehouseId: warehouses[0].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "ELEC-002", name: "Wireless Monitor 27\"", category: "Electronics", quantity: 30, unitPrice: 449.99, reorderLevel: 15, warehouseId: warehouses[0].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "ELEC-003", name: "Docking Station USB-C", category: "Electronics", quantity: 8, unitPrice: 189.99, reorderLevel: 10, warehouseId: warehouses[0].id, status: ProductStatus.LOW_STOCK } }),
    prisma.product.create({ data: { sku: "ELEC-004", name: "Wireless Keyboard & Mouse", category: "Electronics", quantity: 60, unitPrice: 79.99, reorderLevel: 25, warehouseId: warehouses[1].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "OFF-001", name: "A4 Paper (Box of 10 reams)", category: "Office Supplies", quantity: 120, unitPrice: 42.99, reorderLevel: 50, warehouseId: warehouses[0].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "OFF-002", name: "Printer Ink Cartridge Set", category: "Office Supplies", quantity: 5, unitPrice: 64.99, reorderLevel: 15, warehouseId: warehouses[0].id, status: ProductStatus.LOW_STOCK } }),
    prisma.product.create({ data: { sku: "OFF-003", name: "Ergonomic Office Chair", category: "Office Supplies", quantity: 18, unitPrice: 399.99, reorderLevel: 10, warehouseId: warehouses[1].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "OFF-004", name: "Standing Desk Frame", category: "Office Supplies", quantity: 0, unitPrice: 549.99, reorderLevel: 5, warehouseId: warehouses[1].id, status: ProductStatus.OUT_OF_STOCK } }),
    prisma.product.create({ data: { sku: "RAW-001", name: "Steel Sheets (per ton)", category: "Raw Materials", quantity: 25, unitPrice: 850.00, reorderLevel: 10, warehouseId: warehouses[2].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "RAW-002", name: "Copper Wire (500m roll)", category: "Raw Materials", quantity: 12, unitPrice: 320.00, reorderLevel: 8, warehouseId: warehouses[2].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "RAW-003", name: "Aluminum Ingots (per kg)", category: "Raw Materials", quantity: 3, unitPrice: 45.00, reorderLevel: 20, warehouseId: warehouses[2].id, status: ProductStatus.LOW_STOCK } }),
    prisma.product.create({ data: { sku: "RAW-004", name: "Industrial Adhesive (20L)", category: "Raw Materials", quantity: 40, unitPrice: 125.00, reorderLevel: 15, warehouseId: warehouses[2].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "PKG-001", name: "Cardboard Boxes (Large)", category: "Packaging", quantity: 500, unitPrice: 2.50, reorderLevel: 200, warehouseId: warehouses[0].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "PKG-002", name: "Bubble Wrap (100m roll)", category: "Packaging", quantity: 35, unitPrice: 28.99, reorderLevel: 20, warehouseId: warehouses[0].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "PKG-003", name: "Packing Tape (48 rolls)", category: "Packaging", quantity: 0, unitPrice: 36.99, reorderLevel: 10, warehouseId: warehouses[1].id, status: ProductStatus.OUT_OF_STOCK } }),
    prisma.product.create({ data: { sku: "ELEC-005", name: "Server Rack 42U", category: "Electronics", quantity: 4, unitPrice: 2899.99, reorderLevel: 2, warehouseId: warehouses[0].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "ELEC-006", name: "Network Switch 48-Port", category: "Electronics", quantity: 7, unitPrice: 1199.99, reorderLevel: 5, warehouseId: warehouses[0].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "OFF-005", name: "Whiteboard 6ft x 4ft", category: "Office Supplies", quantity: 12, unitPrice: 189.99, reorderLevel: 5, warehouseId: warehouses[1].id, status: ProductStatus.IN_STOCK } }),
    prisma.product.create({ data: { sku: "RAW-005", name: "PVC Pipes (bundle of 20)", category: "Raw Materials", quantity: 0, unitPrice: 210.00, reorderLevel: 10, warehouseId: warehouses[2].id, status: ProductStatus.OUT_OF_STOCK } }),
    prisma.product.create({ data: { sku: "PKG-004", name: "Shipping Labels (1000 pcs)", category: "Packaging", quantity: 80, unitPrice: 18.99, reorderLevel: 30, warehouseId: warehouses[0].id, status: ProductStatus.IN_STOCK } }),
  ]);
  console.log(`Created ${products.length} products`);

  // ==================== INVENTORY: PURCHASE ORDERS ====================
  const pos = [
    { poNum: "PO-2026-001", vendorIdx: 0, date: "2026-01-15", total: 4299, status: POStatus.RECEIVED, items: [{ prodIdx: 4, qty: 100, price: 42.99 }] },
    { poNum: "PO-2026-002", vendorIdx: 1, date: "2026-02-01", total: 12999, status: POStatus.RECEIVED, items: [{ prodIdx: 0, qty: 10, price: 1299.99 }] },
    { poNum: "PO-2026-003", vendorIdx: 1, date: "2026-02-20", total: 3799, status: POStatus.RECEIVED, items: [{ prodIdx: 2, qty: 20, price: 189.99 }] },
    { poNum: "PO-2026-004", vendorIdx: 0, date: "2026-03-05", total: 649, status: POStatus.ORDERED, items: [{ prodIdx: 5, qty: 10, price: 64.99 }] },
    { poNum: "PO-2026-005", vendorIdx: 1, date: "2026-03-10", total: 5499, status: POStatus.ORDERED, items: [{ prodIdx: 7, qty: 10, price: 549.99 }] },
    { poNum: "PO-2026-006", vendorIdx: 2, date: "2026-03-15", total: 8500, status: POStatus.DRAFT, items: [{ prodIdx: 8, qty: 10, price: 850.00 }] },
    { poNum: "PO-2026-007", vendorIdx: 0, date: "2026-03-20", total: 3699, status: POStatus.DRAFT, items: [{ prodIdx: 14, qty: 100, price: 36.99 }] },
    { poNum: "PO-2026-008", vendorIdx: 1, date: "2026-02-10", total: 7999, status: POStatus.CANCELLED, items: [{ prodIdx: 6, qty: 20, price: 399.99 }] },
  ];
  for (const po of pos) {
    await prisma.purchaseOrder.create({
      data: {
        poNumber: po.poNum, supplierId: vendors[po.vendorIdx].id, date: new Date(po.date), totalAmount: po.total, status: po.status,
        items: { create: po.items.map(i => ({ productId: products[i.prodIdx].id, quantity: i.qty, unitPrice: i.price, totalPrice: i.qty * i.price })) },
      },
    });
  }
  console.log(`Created ${pos.length} purchase orders`);

  // ==================== INVENTORY: STOCK MOVEMENTS ====================
  const movements = [
    { prodIdx: 0, whIdx: 0, type: MovementType.IN, qty: 50, ref: "PO-2026-002", date: "2026-02-05" },
    { prodIdx: 0, whIdx: 0, type: MovementType.OUT, qty: 5, ref: "SHIP-001", date: "2026-02-20" },
    { prodIdx: 4, whIdx: 0, type: MovementType.IN, qty: 100, ref: "PO-2026-001", date: "2026-01-20" },
    { prodIdx: 2, whIdx: 0, type: MovementType.IN, qty: 20, ref: "PO-2026-003", date: "2026-02-25" },
    { prodIdx: 2, whIdx: 0, type: MovementType.OUT, qty: 12, ref: "SHIP-005", date: "2026-03-10" },
    { prodIdx: 1, whIdx: 0, type: MovementType.IN, qty: 40, ref: "PO-INIT", date: "2026-01-05" },
    { prodIdx: 1, whIdx: 0, type: MovementType.OUT, qty: 10, ref: "SHIP-003", date: "2026-03-01" },
    { prodIdx: 3, whIdx: 1, type: MovementType.IN, qty: 80, ref: "PO-INIT", date: "2026-01-05" },
    { prodIdx: 3, whIdx: 1, type: MovementType.OUT, qty: 20, ref: "SHIP-004", date: "2026-02-15" },
    { prodIdx: 8, whIdx: 2, type: MovementType.IN, qty: 30, ref: "PO-INIT", date: "2026-01-10" },
    { prodIdx: 8, whIdx: 2, type: MovementType.OUT, qty: 5, ref: "PROD-001", date: "2026-03-05" },
    { prodIdx: 12, whIdx: 0, type: MovementType.IN, qty: 600, ref: "PO-INIT", date: "2026-01-05" },
    { prodIdx: 12, whIdx: 0, type: MovementType.OUT, qty: 100, ref: "SHIP-010", date: "2026-03-15" },
    { prodIdx: 5, whIdx: 0, type: MovementType.IN, qty: 15, ref: "PO-INIT", date: "2026-01-05" },
    { prodIdx: 5, whIdx: 0, type: MovementType.OUT, qty: 10, ref: "USE-002", date: "2026-03-01" },
    { prodIdx: 9, whIdx: 2, type: MovementType.IN, qty: 20, ref: "PO-INIT", date: "2026-01-10" },
    { prodIdx: 9, whIdx: 2, type: MovementType.OUT, qty: 8, ref: "PROD-003", date: "2026-02-28" },
    { prodIdx: 6, whIdx: 1, type: MovementType.IN, qty: 25, ref: "PO-INIT", date: "2026-01-10" },
    { prodIdx: 6, whIdx: 1, type: MovementType.OUT, qty: 7, ref: "SHIP-008", date: "2026-03-12" },
    { prodIdx: 15, whIdx: 0, type: MovementType.IN, qty: 6, ref: "PO-INIT", date: "2026-01-15" },
    { prodIdx: 15, whIdx: 0, type: MovementType.OUT, qty: 2, ref: "INSTALL-001", date: "2026-03-20" },
    { prodIdx: 13, whIdx: 0, type: MovementType.IN, qty: 50, ref: "PO-INIT", date: "2026-01-05" },
    { prodIdx: 13, whIdx: 0, type: MovementType.OUT, qty: 15, ref: "SHIP-012", date: "2026-03-10" },
    { prodIdx: 10, whIdx: 2, type: MovementType.IN, qty: 15, ref: "PO-INIT", date: "2026-01-10" },
    { prodIdx: 10, whIdx: 2, type: MovementType.OUT, qty: 12, ref: "PROD-005", date: "2026-03-18" },
  ];
  for (const m of movements) {
    await prisma.stockMovement.create({
      data: { productId: products[m.prodIdx].id, warehouseId: warehouses[m.whIdx].id, type: m.type, quantity: m.qty, reference: m.ref, date: new Date(m.date) },
    });
  }
  console.log(`Created ${movements.length} stock movements`);

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
