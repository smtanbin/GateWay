"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Add your login logic here (placeholder)
      console.log("Login attempt:", { email, password });
      // navigate to dashboard even without real auth
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--secondary)] text-[var(--text-color)]">
      {/* top primary band */}
      <div className="w-full h-8 bg-[var(--primary)]" />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-[var(--secondary)]/90 ">
          {/* Brand Icon */}
      
          <h1 className="text-4xl font-semibold text-center mb-2 text-[var(--primary)] font-Poiret-One">JONUS</h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-color)] mb-1">
                Username
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-[var(--secondary)] border border-gray-600 placeholder-gray-400 rounded-md focus:ring-2 focus:ring-[var(--primary)] outline-none transition"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-color)] mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-[var(--secondary)] border border-gray-600 placeholder-gray-400 rounded-md focus:ring-2 focus:ring-[var(--primary)] outline-none transition"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
     
              <a href="#" className="text-[var(--primary)] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--primary)] hover:bg-[#7a1e1e] disabled:bg-[#c18686] text-white font-semibold py-2 rounded-md transition duration-200"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>


        </div>
      </div>
      <div className="w-full h-8 bg-[var(--secondary)]" />
    </div>
  );
}

