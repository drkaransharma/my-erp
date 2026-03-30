"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AdminUser, ModuleName, PermissionsMap } from "@/types/admin";

interface UserContextType {
  currentUser: AdminUser | null;
  allUsers: AdminUser[];
  setCurrentUser: (user: AdminUser) => void;
  logout: () => void;
  loading: boolean;
  hasPermission: (module: ModuleName, action?: "view" | "create" | "edit" | "delete") => boolean;
  getPermissions: () => PermissionsMap | null;
}

const defaultPerms: PermissionsMap = {
  finance: { view: false, create: false, edit: false, delete: false },
  crm: { view: false, create: false, edit: false, delete: false },
  hr: { view: false, create: false, edit: false, delete: false },
  inventory: { view: false, create: false, edit: false, delete: false },
  admin: { view: false, create: false, edit: false, delete: false },
};

const UserContext = createContext<UserContextType>({
  currentUser: null,
  allUsers: [],
  setCurrentUser: () => {},
  logout: () => {},
  loading: true,
  hasPermission: () => false,
  getPermissions: () => null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState<AdminUser | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = typeof window !== "undefined" && localStorage.getItem("erp-auth") === "true";
    if (!isAuth) {
      router.push("/login");
      return;
    }

    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((users: AdminUser[]) => {
        setAllUsers(users);
        const savedId = localStorage.getItem("erp-current-user");
        const savedUser = savedId ? users.find((u: AdminUser) => u.id === savedId) : null;
        if (!savedUser) {
          localStorage.removeItem("erp-auth");
          router.push("/login");
          return;
        }
        setCurrentUserState(savedUser);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const setCurrentUser = useCallback((user: AdminUser) => {
    setCurrentUserState(user);
    localStorage.setItem("erp-current-user", user.id);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("erp-auth");
    localStorage.removeItem("erp-current-user");
    router.push("/login");
  }, [router]);

  const getPermissions = useCallback((): PermissionsMap | null => {
    if (!currentUser?.role?.permissions) return null;
    return { ...defaultPerms, ...(currentUser.role.permissions as PermissionsMap) };
  }, [currentUser]);

  const hasPermission = useCallback((module: ModuleName, action: "view" | "create" | "edit" | "delete" = "view"): boolean => {
    const perms = getPermissions();
    if (!perms) return false;
    return perms[module]?.[action] ?? false;
  }, [getPermissions]);

  return (
    <UserContext.Provider value={{ currentUser, allUsers, setCurrentUser, logout, loading, hasPermission, getPermissions }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
