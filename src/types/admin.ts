export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ModuleName = "finance" | "crm" | "hr" | "inventory" | "admin";

export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export type PermissionsMap = Record<ModuleName, ModulePermissions>;

export interface Department {
  id: string;
  name: string;
  description: string | null;
  headId: string | null;
  createdAt: string;
  updatedAt: string;
  head?: AdminUser;
  _count?: { users: number };
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: PermissionsMap;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { users: number };
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  roleId: string | null;
  departmentId: string | null;
  reportsToId: string | null;
  title: string | null;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  role?: Role;
  department?: Department;
  reportsTo?: AdminUser;
  directReports?: AdminUser[];
}
