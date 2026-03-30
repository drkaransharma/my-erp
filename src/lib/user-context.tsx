"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AdminUser } from "@/types/admin";

interface UserContextType {
  currentUser: AdminUser | null;
  allUsers: AdminUser[];
  setCurrentUser: (user: AdminUser) => void;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  allUsers: [],
  setCurrentUser: () => {},
  logout: () => {},
  loading: true,
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

  return (
    <UserContext.Provider value={{ currentUser, allUsers, setCurrentUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
