"use client";

import { useState, useEffect } from "react";
import { CacheEntry } from "@/types";

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Developer Debug Panel
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Cache status, diagnostics, and system health
          </p>
        </div>
        <button
          onClick={fetchCacheStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Cache Entries"
          value={cacheData.length.toString()}
          color="text-blue-400"
          bg="bg-blue-500/10 border-blue-500/30"
        />
        <StatCard
          title="Cache Hits"
          value={hitCount.toString()}
          color="text-green-400"
          bg="bg-green-500/10 border-green-500/30"
        />
        <StatCard
          title="Cache Misses"
          value={missCount.toString()}
          color="text-red-400"
          bg="bg-red-500/10 border-red-500/30"
        />
        <StatCard
          title="Hit Rate"
          value={`${hitRate}%`}
          color={hitRate >= 50 ? "text-green-400" : "text-orange-400"}
          bg={hitRate >= 50 ? "bg-green-500/10 border-green-500/30" : "bg-orange-500/10 border-orange-500/30"}
        />
      </div>

      {/* Last Refresh */}
      {lastRefresh && (
        <p className="text-xs text-gray-500 mb-4">
          Last refreshed: {lastRefresh.toLocaleTimeString()}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-center">
          <p className="text-red-400">{error}</p>
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
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#334155] bg-[#0f172a]">
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cache Key
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    TTL (seconds)
                  </th>
                </tr>
              </thead>
              <tbody>
                {cacheData.map((entry, idx) => (
                  <tr
                    key={entry.key}
                    className={`border-b border-[#334155]/50 ${
                      idx % 2 === 0 ? "bg-[#1e293b]" : "bg-[#1a2332]"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">
                      {entry.key}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.status === "HIT"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                      {entry.ttl > 0 ? `${entry.ttl}s` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 bg-[#1e293b] rounded-xl border border-[#334155] p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Cache Configuration</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Weather data cached for <span className="text-gray-300">5 minutes</span> (300s TTL)</li>
          <li>• Processed rankings cached separately with same TTL</li>
          <li>• Cache backend: <span className="text-gray-300">Redis</span></li>
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
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
