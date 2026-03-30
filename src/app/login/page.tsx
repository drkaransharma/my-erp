"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react";

const personas = [
  { email: "r.sterling@myerp.com" }, { email: "e.vasquez@myerp.com" },
  { email: "c.wells@myerp.com" }, { email: "l.chen@myerp.com" },
  { email: "m.reed@myerp.com" }, { email: "a.rivera@myerp.com" },
  { email: "d.shaw@myerp.com" }, { email: "p.kapoor@myerp.com" },
  { email: "f.gomez@myerp.com" }, { email: "n.west@myerp.com" },
  { email: "k.zhang@myerp.com" }, { email: "m.robinson@myerp.com" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store authenticated user
      localStorage.setItem("erp-current-user", data.id);
      localStorage.setItem("erp-auth", "true");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function quickLogin(email: string, password: string) {
    setEmail(email);
    setPassword(password);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MyERP</h1>
              <p className="text-xs text-muted-foreground">AI-Augmented Platform</p>
            </div>
          </div>

          {/* Welcome */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@myerp.com"
                required
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full h-11 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </button>
          </form>

          {/* Persona Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Login as Persona</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const persona = personas.find((p) => p.email === e.target.value);
                  if (persona) quickLogin(persona.email, "myerp@2026");
                }
              }}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              defaultValue=""
            >
              <option value="" disabled>Select a persona to auto-fill...</option>
              <optgroup label="Executive">
                <option value="r.sterling@myerp.com">Richard Sterling — CEO (Super Admin)</option>
                <option value="e.vasquez@myerp.com">Elena Vasquez — CTO (Super Admin)</option>
              </optgroup>
              <optgroup label="Finance">
                <option value="c.wells@myerp.com">Catherine Wells — VP Finance (Finance Admin)</option>
                <option value="l.chen@myerp.com">Laura Chen — Senior Accountant (Finance User)</option>
              </optgroup>
              <optgroup label="Sales & CRM">
                <option value="m.reed@myerp.com">Marcus Reed — VP Sales (CRM Admin)</option>
                <option value="a.rivera@myerp.com">Alex Rivera — Sales Manager (CRM User)</option>
              </optgroup>
              <optgroup label="Human Resources">
                <option value="d.shaw@myerp.com">Diana Shaw — VP HR (HR Admin)</option>
                <option value="p.kapoor@myerp.com">Priya Kapoor — HR Manager (HR User)</option>
              </optgroup>
              <optgroup label="Operations">
                <option value="f.gomez@myerp.com">Frank Gomez — VP Operations (Inventory Admin)</option>
                <option value="n.west@myerp.com">Nina West — Warehouse Manager (Inventory User)</option>
              </optgroup>
              <optgroup label="IT & Engineering">
                <option value="k.zhang@myerp.com">Kevin Zhang — Lead Developer (Viewer)</option>
                <option value="m.robinson@myerp.com">Maya Robinson — DevOps Engineer (Viewer)</option>
              </optgroup>
            </select>
            <p className="text-[10px] text-muted-foreground text-center">Password for all: myerp@2026</p>
          </div>
        </div>
      </div>

      {/* Right - Branding Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-indigo-700 text-white p-12">
        <div className="max-w-md space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            AI-Powered ERP for Modern Enterprises
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Augment your SAP and Oracle systems with intelligent automation,
            real-time insights, and a conversational AI copilot.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { num: "5", label: "Modules" },
              { num: "18", label: "Users" },
              { num: "10", label: "Roles" },
              { num: "6", label: "Departments" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3">
                <p className="text-2xl font-bold">{s.num}</p>
                <p className="text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
