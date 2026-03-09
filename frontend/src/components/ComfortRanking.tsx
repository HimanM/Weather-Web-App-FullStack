"use client";

import { CityWeather } from "@/types";

interface ComfortRankingProps {
  cities: CityWeather[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-lime-400";
  if (score >= 40) return "text-yellow-400";
  if (score >= 20) return "text-orange-400";
  return "text-red-400";
}

function getBarColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-lime-500";
  if (score >= 40) return "bg-yellow-500";
  if (score >= 20) return "bg-orange-500";
  return "bg-red-500";
}

export default function ComfortRanking({ cities }: ComfortRankingProps) {
  const sorted = [...cities].sort((a, b) => b.comfortScore - a.comfortScore);

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
        Comfort Score Ranking
      </h3>
      <div className="space-y-2">
        {sorted.map((city, idx) => (
          <div key={city.cityCode} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-5 text-right font-mono">
              {idx + 1}
            </span>
            <span className="text-xs text-gray-300 w-24 truncate">
              {city.cityName}
            </span>
            <div className="flex-1 bg-[#0f172a] rounded-full h-3 relative overflow-hidden">
              <div
                className={`h-full rounded-full ${getBarColor(city.comfortScore)} transition-all duration-700 ease-out`}
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
