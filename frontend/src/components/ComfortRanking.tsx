"use client";

import { CityWeather } from "@/types";

interface ComfortRankingProps {
  cities: CityWeather[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-lime-500";
  if (score >= 40) return "text-yellow-500";
  if (score >= 20) return "text-orange-500";
  return "text-red-500";
}

function getBarGradient(score: number): string {
  if (score >= 80) return "from-emerald-500 to-emerald-400";
  if (score >= 60) return "from-lime-500 to-lime-400";
  if (score >= 40) return "from-yellow-500 to-yellow-400";
  if (score >= 20) return "from-orange-500 to-orange-400";
  return "from-red-500 to-red-400";
}

export default function ComfortRanking({ cities }: ComfortRankingProps) {
  const sorted = [...cities].sort((a, b) => b.comfortScore - a.comfortScore);

  return (
    <div className="rounded-2xl border p-5 theme-transition"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
      <h3 className="text-sm font-medium mb-4 uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}>
        Comfort Score Ranking
      </h3>
      <div className="space-y-2.5">
        {sorted.map((city, idx) => (
          <div key={city.cityCode} className="flex items-center gap-3">
            <span className="text-xs w-5 text-right font-mono"
              style={{ color: "var(--text-muted)" }}>
              {idx + 1}
            </span>
            <span className="text-xs w-24 truncate"
              style={{ color: "var(--text-secondary)" }}>
              {city.cityName}
            </span>
            <div className="flex-1 rounded-full h-3 relative overflow-hidden"
              style={{ background: "var(--bar-track)" }}>
              <div
                className={`h-full rounded-full bg-linear-to-r ${getBarGradient(city.comfortScore)} transition-all duration-700 ease-out`}
                style={{ width: `${city.comfortScore}%` }}
              />
            </div>
            <span
              className={`text-sm font-bold w-10 text-right ${getScoreColor(city.comfortScore)}`}
            >
              {city.comfortScore}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
