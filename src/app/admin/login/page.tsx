"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (data.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(data.error || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl shadow-sm p-8 space-y-5"
      >
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Admin · Mathias Guevara</h1>
          <p className="text-neutral-600 text-sm mt-1">Ingresá tu password para editar el funnel.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-700">Password</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 outline-none focus:border-[#FF9A15] focus:ring-2 focus:ring-[#FF9A15]/20"
          />
        </div>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2.5 rounded-lg bg-[#FF9A15] text-white font-semibold disabled:opacity-50 hover:brightness-110 transition"
        >
          {loading ? "..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
