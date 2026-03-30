"use client";

import type { PermissionsMap, ModuleName } from "@/types/admin";

const modules: { key: ModuleName; label: string }[] = [
  { key: "finance", label: "Finance" },
  { key: "crm", label: "CRM" },
  { key: "hr", label: "HR" },
  { key: "inventory", label: "Inventory" },
  { key: "admin", label: "Admin" },
];

const actions = ["view", "create", "edit", "delete"] as const;

interface PermissionsMatrixProps {
  value: PermissionsMap;
  onChange: (permissions: PermissionsMap) => void;
  disabled?: boolean;
}

const defaultPerms: PermissionsMap = {
  finance: { view: false, create: false, edit: false, delete: false },
  crm: { view: false, create: false, edit: false, delete: false },
  hr: { view: false, create: false, edit: false, delete: false },
  inventory: { view: false, create: false, edit: false, delete: false },
  admin: { view: false, create: false, edit: false, delete: false },
};

export function PermissionsMatrix({ value, onChange, disabled }: PermissionsMatrixProps) {
  const perms = { ...defaultPerms, ...value };

  const toggle = (module: ModuleName, action: string) => {
    if (disabled) return;
    const updated = { ...perms };
    updated[module] = { ...updated[module], [action]: !updated[module][action as keyof typeof updated[typeof module]] };
    onChange(updated);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left px-3 py-2 font-medium">Module</th>
            {actions.map((a) => (
              <th key={a} className="text-center px-3 py-2 font-medium capitalize">{a}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map((mod) => (
            <tr key={mod.key} className="border-t">
              <td className="px-3 py-2 font-medium">{mod.label}</td>
              {actions.map((action) => (
                <td key={action} className="text-center px-3 py-2">
                  <input
                    type="checkbox"
                    checked={perms[mod.key]?.[action] ?? false}
                    onChange={() => toggle(mod.key, action)}
                    disabled={disabled}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
