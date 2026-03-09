"use client";

import { useState, useEffect } from "react";
import { CacheEntry } from "@/types";
import { RefreshCw } from "lucide-react";

export default function DebugDashboard() {
  const [cacheData, setCacheData] = useState<CacheEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    fetchCacheStatus();
  }, []);

  async function fetchCacheStatus() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/cache-status");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        throw new Error("Failed to fetch cache status");
      }
      const json = await res.json();
      if (json.success) {
        setCacheData(json.data);
        setLastRefresh(new Date());
      } else {
        setError(json.error || "Unknown error");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load cache status");
    } finally {
      setLoading(false);
    }
  }

  const hitCount = cacheData.filter((e) => e.status === "HIT").length;
  const missCount = cacheData.filter((e) => e.status === "MISS").length;
  const hitRate = cacheData.length > 0
    ? Math.round((hitCount / cacheData.length) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}>
            Developer Debug Panel
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Cache status, diagnostics, and system health
          </p>
        </div>
        <button
          onClick={fetchCacheStatus}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Cache Entries"
          value={cacheData.length.toString()}
          color="text-blue-500"
          bg="bg-blue-500/10 border-blue-500/25"
        />
        <StatCard
          title="Cache Hits"
          value={hitCount.toString()}
          color="text-emerald-500"
          bg="bg-emerald-500/10 border-emerald-500/25"
        />
        <StatCard
          title="Cache Misses"
          value={missCount.toString()}
          color="text-red-500"
          bg="bg-red-500/10 border-red-500/25"
        />
        <StatCard
          title="Hit Rate"
          value={`${hitRate}%`}
          color={hitRate >= 50 ? "text-emerald-500" : "text-orange-500"}
          bg={hitRate >= 50 ? "bg-emerald-500/10 border-emerald-500/25" : "bg-orange-500/10 border-orange-500/25"}
        />
      </div>

      {/* Last Refresh */}
      {lastRefresh && (
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          Last refreshed: {lastRefresh.toLocaleTimeString()}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Cache Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden theme-transition"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ background: "var(--bg-inset)", borderBottom: "1px solid var(--border-color)" }}>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>
                    Cache Key
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>
                    TTL (seconds)
                  </th>
                </tr>
              </thead>
              <tbody>
                {cacheData.map((entry, idx) => (
                  <tr
                    key={entry.key}
                    style={{
                      background: idx % 2 === 0 ? "var(--bg-card)" : "var(--bg-inset)",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <td className="px-4 py-3 font-mono text-xs"
                      style={{ color: "var(--text-secondary)" }}>
                      {entry.key}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.status === "HIT"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}>
                      {entry.ttl > 0 ? `${entry.ttl}s` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 rounded-2xl border p-5 theme-transition"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
        <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
          Cache Configuration
        </h3>
        <ul className="text-xs space-y-1" style={{ color: "var(--text-muted)" }}>
          <li>• Weather data cached for <span style={{ color: "var(--text-secondary)" }}>5 minutes</span> (300s TTL)</li>
          <li>• Processed rankings cached separately with same TTL</li>
          <li>• Cache backend: <span style={{ color: "var(--text-secondary)" }}>Redis</span></li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
  bg,
}: {
  title: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${bg}`}>
      <p className="text-xs uppercase tracking-wider mb-1"
        style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
