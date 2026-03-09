"use client";

import { useUser } from "@auth0/nextjs-auth0";

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <nav className="sticky top-0 z-50 bg-[#111827]/95 backdrop-blur border-b border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a href="/" className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            <span className="text-xl font-bold text-white">
              Weather<span className="text-blue-500">Analytics</span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Dashboard
            </a>
            <a
              href="/debug"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Debug
            </a>
          </div>

          {/* User / Auth */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="skeleton w-24 h-8" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-gray-400">
                  {user.email}
                </span>
                <img
                  src={user.picture || ""}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full border-2 border-blue-500"
                />
                <a
                  href="/auth/logout"
                  className="text-sm px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a
                href="/auth/login"
                className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Login
              </a>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu() {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer p-2 rounded-md hover:bg-[#1e293b] transition">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </summary>
      <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#1e293b] border border-[#334155] shadow-xl py-2 z-50">
        <a
          href="/"
          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#263347] hover:text-white transition"
        >
          Dashboard
        </a>
        <a
          href="/debug"
          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#263347] hover:text-white transition"
        >
          Debug
        </a>
      </div>
    </details>
  );
}
