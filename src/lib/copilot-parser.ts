export interface ParsedCommand {
  type:
    | "create_account"
    | "create_journal_entry"
    | "create_bill"
    | "create_company"
    | "create_contact"
    | "create_lead"
    | "create_deal"
    | "query"
    | "unknown";
  data: Record<string, any>;
  queryType?: string;
}

// Extract dollar amounts: $3000, $3,000, $50k, $1.5m, 3000 dollars
function extractAmount(text: string): number | null {
  // $50k, $1.5m patterns
  const shorthand = text.match(/\$\s*([\d,.]+)\s*([km])/i);
  if (shorthand) {
    const num = parseFloat(shorthand[1].replace(/,/g, ""));
    const mult = shorthand[2].toLowerCase() === "k" ? 1000 : 1000000;
    return num * mult;
  }
  // $3,000 or $3000 patterns
  const dollar = text.match(/\$\s*([\d,.]+)/);
  if (dollar) return parseFloat(dollar[1].replace(/,/g, ""));
  // "3000 dollars" pattern
  const dollarWord = text.match(/([\d,.]+)\s*dollars?/i);
  if (dollarWord) return parseFloat(dollarWord[1].replace(/,/g, ""));
  // standalone number after "worth", "value", "amount", "for"
  const valueWord = text.match(/(?:worth|value|amount|for)\s+([\d,.]+)/i);
  if (valueWord) return parseFloat(valueWord[1].replace(/,/g, ""));
  return null;
}

// Extract email
function extractEmail(text: string): string | null {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return match ? match[0] : null;
}

// Extract phone
function extractPhone(text: string): string | null {
  const match = text.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : null;
}

// Extract date patterns: "due April 15", "by 2026-04-15", "due next month"
function extractDate(text: string): string | null {
  // ISO format
  const iso = text.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  // "April 15" or "Apr 15 2026"
  const monthDay = text.match(/(?:due|by|on|for)\s+(\w+\s+\d{1,2}(?:,?\s*\d{4})?)/i);
  if (monthDay) {
    const d = new Date(monthDay[1]);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  }
  return null;
}

// Extract "industry X" or "in X industry"
function extractIndustry(text: string): string | null {
  const match = text.match(/industry\s+(\w+(?:\s+\w+)?)/i) || text.match(/in\s+(\w+)\s+industry/i);
  return match ? match[1] : null;
}

// Extract stage for deals
function extractStage(text: string): string | null {
  const stages: Record<string, string> = {
    "prospecting": "PROSPECTING", "prospect": "PROSPECTING",
    "qualification": "QUALIFICATION", "qualifying": "QUALIFICATION", "qualified": "QUALIFICATION",
    "proposal": "PROPOSAL",
    "negotiation": "NEGOTIATION", "negotiating": "NEGOTIATION",
    "closed won": "CLOSED_WON", "won": "CLOSED_WON",
    "closed lost": "CLOSED_LOST", "lost": "CLOSED_LOST",
  };
  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(stages)) {
    if (lower.includes(key)) return value;
  }
  return null;
}

// Extract lead source
function extractSource(text: string): string | null {
  const sources: Record<string, string> = {
    "website": "WEBSITE", "web": "WEBSITE",
    "referral": "REFERRAL", "referred": "REFERRAL",
    "linkedin": "LINKEDIN",
    "cold call": "COLD_CALL", "cold": "COLD_CALL",
    "trade show": "TRADE_SHOW", "tradeshow": "TRADE_SHOW", "event": "TRADE_SHOW",
  };
  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(sources)) {
    if (lower.includes(key)) return value;
  }
  return null;
}

// Extract lead status
function extractLeadStatus(text: string): string | null {
  const statuses: Record<string, string> = {
    "new": "NEW", "contacted": "CONTACTED", "qualified": "QUALIFIED",
    "proposal": "PROPOSAL", "negotiation": "NEGOTIATION",
    "won": "WON", "lost": "LOST",
  };
  const lower = text.toLowerCase();
  // Check for "status X" pattern first
  const statusMatch = lower.match(/status\s+(\w+)/);
  if (statusMatch && statuses[statusMatch[1]]) return statuses[statusMatch[1]];
  return null;
}

// Extract account type
function extractAccountType(text: string): string | null {
  const types: Record<string, string> = {
    "asset": "ASSET", "liability": "LIABILITY", "equity": "EQUITY",
    "revenue": "REVENUE", "income": "REVENUE",
    "expense": "EXPENSE", "cost": "EXPENSE",
  };
  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(types)) {
    if (lower.includes(key)) return value;
  }
  return null;
}

// Common journal entry templates
const journalTemplates: Record<string, { debitAccount: string; creditAccount: string; description: string }> = {
  "rent": { debitAccount: "5100", creditAccount: "1000", description: "Rent payment" },
  "salary": { debitAccount: "5000", creditAccount: "1000", description: "Salary payment" },
  "salaries": { debitAccount: "5000", creditAccount: "1000", description: "Salary payment" },
  "payroll": { debitAccount: "5000", creditAccount: "1000", description: "Payroll" },
  "utilities": { debitAccount: "5200", creditAccount: "1000", description: "Utility payment" },
  "utility": { debitAccount: "5200", creditAccount: "1000", description: "Utility payment" },
  "insurance": { debitAccount: "5600", creditAccount: "1000", description: "Insurance payment" },
  "marketing": { debitAccount: "5500", creditAccount: "1000", description: "Marketing expense" },
  "office supplies": { debitAccount: "5300", creditAccount: "2000", description: "Office supplies purchase" },
  "supplies": { debitAccount: "5300", creditAccount: "2000", description: "Office supplies" },
  "software": { debitAccount: "5900", creditAccount: "1000", description: "Software subscription" },
  "subscription": { debitAccount: "5900", creditAccount: "1000", description: "Subscription payment" },
  "equipment": { debitAccount: "1500", creditAccount: "1000", description: "Equipment purchase" },
  "travel": { debitAccount: "5800", creditAccount: "1000", description: "Travel expense" },
  "legal": { debitAccount: "5700", creditAccount: "2000", description: "Legal fees" },
  "professional": { debitAccount: "5700", creditAccount: "2000", description: "Professional fees" },
  "service revenue": { debitAccount: "1200", creditAccount: "4000", description: "Service revenue" },
  "revenue": { debitAccount: "1200", creditAccount: "4000", description: "Revenue earned" },
  "sales": { debitAccount: "1200", creditAccount: "4100", description: "Product sales" },
  "payment received": { debitAccount: "1000", creditAccount: "1200", description: "Customer payment received" },
  "depreciation": { debitAccount: "5400", creditAccount: "1600", description: "Depreciation expense" },
};

// Remove common action words to get the "name" part
function extractName(text: string, removeWords: string[]): string {
  let cleaned = text;
  for (const word of removeWords) {
    cleaned = cleaned.replace(new RegExp(word, "gi"), "");
  }
  // Remove amounts, emails, known patterns
  cleaned = cleaned.replace(/\$[\d,.]+[km]?/gi, "");
  cleaned = cleaned.replace(/[\w.-]+@[\w.-]+\.\w+/g, "");
  cleaned = cleaned.replace(/(?:industry|email|phone|worth|value|stage|source|status|due|at|for|from|in|the|a|an)\s+\S+/gi, "");
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  // Remove leading/trailing commas and whitespace
  cleaned = cleaned.replace(/^[,\s]+|[,\s]+$/g, "").trim();
  return cleaned;
}

export function parseCommand(message: string): ParsedCommand {
  const lower = message.toLowerCase().trim();
  const amount = extractAmount(message);
  const email = extractEmail(message);
  const phone = extractPhone(message);
  const date = extractDate(message);

  // ===== QUERIES =====
  if (lower.match(/^(show|list|how many|what|get|display|tell me|count)/)) {
    if (lower.match(/revenue|income/)) return { type: "query", data: {}, queryType: "total_revenue" };
    if (lower.match(/expense/)) return { type: "query", data: {}, queryType: "total_expenses" };
    if (lower.match(/overdue.*(bill|payable)/)) return { type: "query", data: {}, queryType: "overdue_bills" };
    if (lower.match(/overdue.*(invoice|receivable)/)) return { type: "query", data: {}, queryType: "overdue_invoices" };
    if (lower.match(/active.*deal/)) return { type: "query", data: {}, queryType: "active_deals" };
    if (lower.match(/lead/)) return { type: "query", data: {}, queryType: "leads_summary" };
    if (lower.match(/deal/)) return { type: "query", data: {}, queryType: "deals_summary" };
    if (lower.match(/cash|balance/)) return { type: "query", data: {}, queryType: "cash_balance" };
    if (lower.match(/net income|profit/)) return { type: "query", data: {}, queryType: "net_income" };
    if (lower.match(/compan/)) return { type: "query", data: {}, queryType: "companies_summary" };
    if (lower.match(/contact/)) return { type: "query", data: {}, queryType: "contacts_summary" };
    return { type: "query", data: {}, queryType: "general" };
  }

  // ===== CREATE ACTIONS =====
  const isCreate = lower.match(/^(create|add|new|record|make|enter|log|book)/);
  if (!isCreate) {
    // Also match "journal entry for...", "bill from...", etc. without explicit action word
    if (!lower.match(/(journal|entry|bill|invoice|account|company|contact|lead|deal)/)) {
      return { type: "unknown", data: {} };
    }
  }

  // --- Journal Entry ---
  if (lower.match(/journal|entry|je\b/) || lower.match(/^(record|log|book)\s/)) {
    let template = null;
    for (const [key, val] of Object.entries(journalTemplates)) {
      if (lower.includes(key)) { template = val; break; }
    }

    if (template && amount) {
      const desc = extractName(message, ["create", "add", "new", "record", "make", "enter", "log", "book", "journal", "entry", "for", "of"]);
      return {
        type: "create_journal_entry",
        data: {
          description: desc || template.description,
          amount,
          debitAccount: template.debitAccount,
          creditAccount: template.creditAccount,
          date: date || new Date().toISOString().split("T")[0],
        },
      };
    }

    if (amount) {
      return {
        type: "create_journal_entry",
        data: {
          description: extractName(message, ["create", "add", "new", "record", "make", "journal", "entry", "for"]) || "Manual entry",
          amount,
          date: date || new Date().toISOString().split("T")[0],
        },
      };
    }
  }

  // --- Account ---
  if (lower.match(/account/)) {
    const codeMatch = message.match(/\b(\d{4})\b/);
    const accountType = extractAccountType(message);
    const name = extractName(message, ["create", "add", "new", "account", "code", codeMatch?.[1] || "", accountType || ""]);
    return {
      type: "create_account",
      data: {
        code: codeMatch?.[1] || "",
        name: name || "New Account",
        type: accountType || "EXPENSE",
      },
    };
  }

  // --- Bill ---
  if (lower.match(/bill/)) {
    const vendorMatch = message.match(/(?:from|vendor|to)\s+([A-Z][\w\s]+?)(?:\s+(?:for|due|worth|\$)|$)/i);
    return {
      type: "create_bill",
      data: {
        vendor: vendorMatch?.[1]?.trim() || "",
        amount: amount || 0,
        dueDate: date || null,
        description: extractName(message, ["create", "add", "new", "record", "bill", "from", vendorMatch?.[1] || ""]) || "Bill",
      },
    };
  }

  // --- CRM Company ---
  if (lower.match(/company|organization|org\b/)) {
    const industry = extractIndustry(message);
    const name = extractName(message, ["create", "add", "new", "company", "organization", "org", "industry", industry || ""]);
    return {
      type: "create_company",
      data: {
        name: name || "New Company",
        industry,
        website: null,
        phone: phone,
      },
    };
  }

  // --- CRM Contact ---
  if (lower.match(/contact|person/)) {
    // Try to extract "FirstName LastName at Company"
    const atCompany = message.match(/(?:at|from|@)\s+([A-Z][\w\s]+?)(?:\s*,|$)/i);
    const name = extractName(message, ["create", "add", "new", "contact", "person", "at", atCompany?.[1] || ""]);
    const parts = name.split(/\s+/);
    return {
      type: "create_contact",
      data: {
        firstName: parts[0] || "New",
        lastName: parts.slice(1).join(" ") || "Contact",
        email,
        phone,
        companyName: atCompany?.[1]?.trim() || null,
      },
    };
  }

  // --- CRM Lead ---
  if (lower.match(/lead/)) {
    const source = extractSource(message);
    const status = extractLeadStatus(message);
    // "lead X for Company worth $Y"
    const forCompany = message.match(/(?:for|at|from)\s+([A-Z][\w\s]+?)(?:\s+(?:worth|\$|value|status|source)|,|$)/i);
    const title = extractName(message, ["create", "add", "new", "lead", "for", forCompany?.[1] || "", "worth", "from", "source", source || "", "status", status || ""]);
    return {
      type: "create_lead",
      data: {
        title: title || "New Lead",
        companyName: forCompany?.[1]?.trim() || null,
        value: amount || 0,
        source: source || "OTHER",
        status: status || "NEW",
      },
    };
  }

  // --- CRM Deal ---
  if (lower.match(/deal|opportunity/)) {
    const stage = extractStage(message);
    const forCompany = message.match(/(?:for|at|with|from)\s+([A-Z][\w\s]+?)(?:\s+(?:worth|\$|value|stage|in)|,|$)/i);
    const title = extractName(message, ["create", "add", "new", "deal", "opportunity", "for", forCompany?.[1] || "", "worth", "stage", "in", stage || ""]);
    return {
      type: "create_deal",
      data: {
        title: title || "New Deal",
        companyName: forCompany?.[1]?.trim() || null,
        value: amount || 0,
        stage: stage || "PROSPECTING",
        expectedCloseDate: date || null,
      },
    };
  }

  return { type: "unknown", data: {} };
}
