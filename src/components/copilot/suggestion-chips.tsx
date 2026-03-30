"use client";

import { DollarSign, Users, FileText, Building2, Target, Handshake, HelpCircle, BarChart3 } from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const categories = [
  {
    title: "Query Data",
    items: [
      { label: "Show total revenue", icon: DollarSign },
      { label: "Show cash balance", icon: BarChart3 },
      { label: "List active deals", icon: Handshake },
      { label: "How many overdue invoices?", icon: HelpCircle },
    ],
  },
  {
    title: "Create Entries",
    items: [
      { label: "Create journal entry for rent $3000", icon: FileText },
      { label: "Add company Acme Corp industry Technology", icon: Building2 },
      { label: "New lead ERP Migration for Acme worth $100k", icon: Target },
      { label: "Add contact Sarah Lee at Acme email sarah@acme.com", icon: Users },
    ],
  },
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {categories.map((cat) => (
        <div key={cat.title}>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">{cat.title}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cat.items.map((item) => (
              <button
                key={item.label}
                onClick={() => onSelect(item.label)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-card text-left text-sm hover:bg-accent hover:border-primary/20 transition-all group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
