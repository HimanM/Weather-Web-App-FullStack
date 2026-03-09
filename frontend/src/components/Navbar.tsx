"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useTheme } from "@/components/ThemeProvider";
import { CloudSun, Menu, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur border-b theme-transition"
      style={{ background: "var(--nav-bg)", borderColor: "var(--border-color)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a href="/" className="flex items-center gap-2.5">
            <CloudSun className="w-7 h-7 text-blue-500" />
            <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Weather<span className="text-blue-500">Analytics</span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-sm transition hover:text-blue-500"
              style={{ color: "var(--text-secondary)" }}
            >
              Dashboard
            </a>
            <a
              href="/debug"
              className="text-sm transition hover:text-blue-500"
              style={{ color: "var(--text-secondary)" }}
            >
              Debug
            </a>
          </div>

          {/* Right side: theme toggle + auth */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition hover:bg-blue-500/10"
              style={{ color: "var(--text-secondary)" }}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isLoading ? (
              <div className="skeleton w-24 h-8" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm" style={{ color: "var(--text-muted)" }}>
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
      <summary className="list-none cursor-pointer p-2 rounded-md transition hover:bg-blue-500/10">
        <Menu className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
      </summary>
      <div className="absolute right-0 mt-2 w-48 rounded-lg border shadow-xl py-2 z-50 theme-transition"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
        <a
          href="/"
          className="block px-4 py-2 text-sm transition hover:text-blue-500"
          style={{ color: "var(--text-secondary)" }}
        >
          Dashboard
        </a>
        <a
          href="/debug"
          className="block px-4 py-2 text-sm transition hover:text-blue-500"
          style={{ color: "var(--text-secondary)" }}
        >
          Debug
        </a>
      </div>
    </details>
  );
}
