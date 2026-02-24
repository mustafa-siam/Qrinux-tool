"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { toast } from "react-toastify";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signup successful! Please check your email.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-4 p-8 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Sign Up</h2>

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
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm text-gray-400 mt-2">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#D670FF] cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}