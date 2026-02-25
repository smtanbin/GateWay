"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--charcoal)] text-white">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-4">Dashboard</h1>
      <p className="mb-6">Welcome to the Janus dashboard.</p>
      <Link href="/" className="text-[var(--primary)] underline">
        Back to login
      </Link>
    </div>
  );
}
