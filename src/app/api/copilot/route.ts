import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCommand } from "@/lib/copilot-parser";

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const parsed = parseCommand(message);

  try {
    switch (parsed.type) {
      // ===== FINANCE: CREATE ACCOUNT =====
      case "create_account": {
        const { code, name, type } = parsed.data;
        if (!code) return NextResponse.json({ reply: "I need an account code (e.g., 6000). Try: 'Add account 6000 Travel Expense'", action: null });
        const existing = await prisma.account.findUnique({ where: { code } });
        if (existing) return NextResponse.json({ reply: `Account ${code} already exists as "${existing.name}".`, action: null });
        const account = await prisma.account.create({ data: { code, name, type } });
        return NextResponse.json({
          reply: `Created account **${account.code} - ${account.name}** (${account.type}).`,
          action: "created",
          entity: "account",
          data: account,
        });
      }

      // ===== FINANCE: JOURNAL ENTRY =====
      case "create_journal_entry": {
        const { description, amount, debitAccount, creditAccount, date } = parsed.data;
        if (!amount) return NextResponse.json({ reply: "I need an amount. Try: 'Create journal entry for rent $3000'", action: null });

        let debitAcct = debitAccount ? await prisma.account.findUnique({ where: { code: debitAccount } }) : null;
        let creditAcct = creditAccount ? await prisma.account.findUnique({ where: { code: creditAccount } }) : null;

        if (!debitAcct || !creditAcct) {
          return NextResponse.json({
            reply: `I recognized this as "${description}" for $${amount.toLocaleString()}, but I need matching accounts in the chart. Try being more specific about the expense type (rent, salary, utilities, marketing, etc.)`,
            action: null,
          });
        }

        const count = await prisma.journalEntry.count();
        const entryNumber = `JE-2026-${String(count + 1).padStart(4, "0")}`;

        const entry = await prisma.journalEntry.create({
          data: {
            entryNumber,
            date: new Date(date),
            description,
            status: "POSTED",
            totalDebit: amount,
            totalCredit: amount,
            lines: {
              create: [
                { accountId: debitAcct.id, debit: amount, credit: 0, description: `${debitAcct.name}` },
                { accountId: creditAcct.id, debit: 0, credit: amount, description: `${creditAcct.name}` },
              ],
            },
          },
          include: { lines: { include: { account: true } } },
        });

        return NextResponse.json({
          reply: `Created journal entry **${entry.entryNumber}** - "${description}" for **$${amount.toLocaleString()}**\n\nDebit: ${debitAcct.code} ${debitAcct.name} → $${amount.toLocaleString()}\nCredit: ${creditAcct.code} ${creditAcct.name} → $${amount.toLocaleString()}`,
          action: "created",
          entity: "journal_entry",
          data: entry,
        });
      }

      // ===== FINANCE: BILL =====
      case "create_bill": {
        const { vendor, amount: billAmount, dueDate, description } = parsed.data;
        if (!billAmount) return NextResponse.json({ reply: "I need an amount for the bill. Try: 'Record bill from Vendor for $1400 due April 15'", action: null });

        let vendorRecord = vendor ? await prisma.vendor.findFirst({ where: { name: { contains: vendor, mode: "insensitive" } } }) : null;

        if (!vendorRecord && vendor) {
          vendorRecord = await prisma.vendor.create({ data: { name: vendor } });
        }

        const billCount = await prisma.bill.count();
        const bill = await prisma.bill.create({
          data: {
            billNumber: `BILL-${String(billCount + 1).padStart(3, "0")}`,
            vendorId: vendorRecord!.id,
            date: new Date(),
            dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 86400000),
            amount: billAmount,
            status: "PENDING",
            description,
          },
          include: { vendor: true },
        });

        return NextResponse.json({
          reply: `Created bill **${bill.billNumber}** from **${bill.vendor.name}** for **$${billAmount.toLocaleString()}**. Due: ${bill.dueDate.toLocaleDateString()}.`,
          action: "created",
          entity: "bill",
          data: bill,
        });
      }

      // ===== CRM: COMPANY =====
      case "create_company": {
        const { name, industry, phone: compPhone } = parsed.data;
        const company = await prisma.crmCompany.create({
          data: { name, industry, phone: compPhone },
        });
        return NextResponse.json({
          reply: `Created company **${company.name}**${industry ? ` in the **${industry}** industry` : ""}.`,
          action: "created",
          entity: "company",
          data: company,
        });
      }

      // ===== CRM: CONTACT =====
      case "create_contact": {
        const { firstName, lastName, email, phone: contactPhone, companyName } = parsed.data;
        let companyId: string | null = null;
        if (companyName) {
          const company = await prisma.crmCompany.findFirst({ where: { name: { contains: companyName, mode: "insensitive" } } });
          companyId = company?.id || null;
          if (!company) {
            const newCompany = await prisma.crmCompany.create({ data: { name: companyName } });
            companyId = newCompany.id;
          }
        }
        const contact = await prisma.crmContact.create({
          data: { firstName, lastName, email, phone: contactPhone, companyId, status: "ACTIVE" },
          include: { company: true },
        });
        return NextResponse.json({
          reply: `Created contact **${contact.firstName} ${contact.lastName}**${contact.company ? ` at **${contact.company.name}**` : ""}${email ? ` (${email})` : ""}.`,
          action: "created",
          entity: "contact",
          data: contact,
        });
      }

      // ===== CRM: LEAD =====
      case "create_lead": {
        const { title, companyName, value, source, status } = parsed.data;
        let companyId: string | null = null;
        if (companyName) {
          const company = await prisma.crmCompany.findFirst({ where: { name: { contains: companyName, mode: "insensitive" } } });
          companyId = company?.id || null;
        }
        const lead = await prisma.crmLead.create({
          data: { title, companyId, value, source, status },
          include: { company: true },
        });
        return NextResponse.json({
          reply: `Created lead **"${lead.title}"**${lead.company ? ` for **${lead.company.name}**` : ""} worth **$${Number(lead.value).toLocaleString()}**. Source: ${lead.source}. Status: ${lead.status}.`,
          action: "created",
          entity: "lead",
          data: lead,
        });
      }

      // ===== CRM: DEAL =====
      case "create_deal": {
        const { title, companyName, value, stage, expectedCloseDate } = parsed.data;
        let companyId: string | null = null;
        if (companyName) {
          const company = await prisma.crmCompany.findFirst({ where: { name: { contains: companyName, mode: "insensitive" } } });
          companyId = company?.id || null;
        }
        const probMap: Record<string, number> = {
          PROSPECTING: 10, QUALIFICATION: 25, PROPOSAL: 50,
          NEGOTIATION: 75, CLOSED_WON: 100, CLOSED_LOST: 0,
        };
        const deal = await prisma.crmDeal.create({
          data: {
            title, companyId, value, stage,
            probability: probMap[stage] || 10,
            expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
          },
          include: { company: true },
        });
        return NextResponse.json({
          reply: `Created deal **"${deal.title}"**${deal.company ? ` with **${deal.company.name}**` : ""} worth **$${Number(deal.value).toLocaleString()}**. Stage: ${deal.stage}. Probability: ${deal.probability}%.`,
          action: "created",
          entity: "deal",
          data: deal,
        });
      }

      // ===== QUERIES =====
      case "query": {
        return await handleQuery(parsed.queryType || "general");
      }

      // ===== UNKNOWN =====
      default:
        return NextResponse.json({
          reply: "I'm not sure what you'd like to do. Here are some things I can help with:\n\n**Finance:**\n- \"Create journal entry for rent $3000\"\n- \"Add account 6000 Travel Expense\"\n- \"Record bill from Acme for $1400\"\n\n**CRM:**\n- \"Add company Tesla industry Technology\"\n- \"New contact John Smith at Tesla\"\n- \"Create lead SAP Migration for Tesla worth $150k\"\n- \"Add deal Oracle Upgrade for Tesla $200k in proposal stage\"\n\n**Queries:**\n- \"Show total revenue\"\n- \"How many overdue invoices?\"\n- \"List active deals\"",
          action: null,
        });
    }
  } catch (err: any) {
    return NextResponse.json({
      reply: `Something went wrong: ${err.message}. Please try again with a different phrasing.`,
      action: null,
    });
  }
}

async function handleQuery(queryType: string) {
  switch (queryType) {
    case "total_revenue": {
      const accounts = await prisma.account.findMany({ where: { type: "REVENUE" } });
      const total = accounts.reduce((s, a) => s + Number(a.balance), 0);
      const lines = accounts.map((a) => `- ${a.code} ${a.name}: $${Number(a.balance).toLocaleString()}`).join("\n");
      return NextResponse.json({ reply: `**Total Revenue: $${total.toLocaleString()}**\n\n${lines}`, action: null });
    }
    case "total_expenses": {
      const accounts = await prisma.account.findMany({ where: { type: "EXPENSE" } });
      const total = accounts.reduce((s, a) => s + Number(a.balance), 0);
      return NextResponse.json({ reply: `**Total Expenses: $${total.toLocaleString()}**\n\n${accounts.map((a) => `- ${a.name}: $${Number(a.balance).toLocaleString()}`).join("\n")}`, action: null });
    }
    case "net_income": {
      const rev = (await prisma.account.findMany({ where: { type: "REVENUE" } })).reduce((s, a) => s + Number(a.balance), 0);
      const exp = (await prisma.account.findMany({ where: { type: "EXPENSE" } })).reduce((s, a) => s + Number(a.balance), 0);
      return NextResponse.json({ reply: `**Net Income: $${(rev - exp).toLocaleString()}**\n\nRevenue: $${rev.toLocaleString()}\nExpenses: $${exp.toLocaleString()}`, action: null });
    }
    case "cash_balance": {
      const cash = await prisma.account.findUnique({ where: { code: "1000" } });
      return NextResponse.json({ reply: `**Cash Balance: $${Number(cash?.balance || 0).toLocaleString()}**`, action: null });
    }
    case "overdue_bills": {
      const bills = await prisma.bill.findMany({ where: { status: "OVERDUE" }, include: { vendor: true } });
      const total = bills.reduce((s, b) => s + Number(b.amount) - Number(b.amountPaid), 0);
      return NextResponse.json({ reply: `**${bills.length} overdue bill(s)** totaling **$${total.toLocaleString()}**\n\n${bills.map((b) => `- ${b.billNumber}: ${b.vendor.name} — $${(Number(b.amount) - Number(b.amountPaid)).toLocaleString()}`).join("\n")}`, action: null });
    }
    case "overdue_invoices": {
      const invoices = await prisma.invoice.findMany({ where: { status: "OVERDUE" }, include: { customer: true } });
      const total = invoices.reduce((s, i) => s + Number(i.amount) - Number(i.amountPaid), 0);
      return NextResponse.json({ reply: `**${invoices.length} overdue invoice(s)** totaling **$${total.toLocaleString()}**\n\n${invoices.map((i) => `- ${i.invoiceNumber}: ${i.customer.name} — $${(Number(i.amount) - Number(i.amountPaid)).toLocaleString()}`).join("\n")}`, action: null });
    }
    case "active_deals": {
      const deals = await prisma.crmDeal.findMany({ where: { stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } }, include: { company: true }, orderBy: { value: "desc" } });
      const total = deals.reduce((s, d) => s + Number(d.value), 0);
      return NextResponse.json({ reply: `**${deals.length} active deal(s)** worth **$${total.toLocaleString()}**\n\n${deals.map((d) => `- ${d.title}${d.company ? ` (${d.company.name})` : ""}: $${Number(d.value).toLocaleString()} — ${d.stage}`).join("\n")}`, action: null });
    }
    case "leads_summary": {
      const leads = await prisma.crmLead.groupBy({ by: ["status"], _count: true });
      const total = await prisma.crmLead.count();
      return NextResponse.json({ reply: `**${total} total lead(s)**\n\n${leads.map((l) => `- ${l.status}: ${l._count}`).join("\n")}`, action: null });
    }
    case "deals_summary": {
      const deals = await prisma.crmDeal.groupBy({ by: ["stage"], _count: true, _sum: { value: true } });
      return NextResponse.json({ reply: `**Deal Pipeline Summary:**\n\n${deals.map((d) => `- ${d.stage}: ${d._count} deal(s), $${Number(d._sum.value || 0).toLocaleString()}`).join("\n")}`, action: null });
    }
    case "companies_summary": {
      const count = await prisma.crmCompany.count();
      const companies = await prisma.crmCompany.findMany({ take: 10, orderBy: { name: "asc" } });
      return NextResponse.json({ reply: `**${count} companies** in CRM\n\n${companies.map((c) => `- ${c.name}${c.industry ? ` (${c.industry})` : ""}`).join("\n")}`, action: null });
    }
    case "contacts_summary": {
      const count = await prisma.crmContact.count();
      const active = await prisma.crmContact.count({ where: { status: "ACTIVE" } });
      return NextResponse.json({ reply: `**${count} contacts** total (${active} active, ${count - active} inactive)`, action: null });
    }
    default:
      return NextResponse.json({ reply: "What would you like to know? I can tell you about revenue, expenses, cash balance, overdue items, deals, leads, companies, and contacts.", action: null });
  }
}
