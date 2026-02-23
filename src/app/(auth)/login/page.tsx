"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("✅ Logged in successfully!");
    router.push("/"); // Redirect to homepage after login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-8 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 outline-none"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="p-3 rounded-lg bg-[#00F0FF] font-bold text-black hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-400 mt-2">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-[#D670FF] cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}