"use client";

import { CityWeather } from "@/types";

interface TemperatureChartProps {
  cities: CityWeather[];
}

export default function TemperatureChart({ cities }: TemperatureChartProps) {
  if (cities.length === 0) return null;

  const maxTemp = Math.max(...cities.map((c) => c.temperature));
  const minTemp = Math.min(...cities.map((c) => c.temperature));
  const range = maxTemp - minTemp || 1;

  function getTempGradient(temp: number): string {
    if (temp >= 35) return "from-red-500 to-red-400";
    if (temp >= 28) return "from-orange-500 to-orange-400";
    if (temp >= 20) return "from-emerald-500 to-emerald-400";
    if (temp >= 10) return "from-sky-400 to-sky-300";
    return "from-blue-500 to-blue-400";
  }

  return (
    <div className="rounded-2xl border p-5 theme-transition"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
      <h3 className="text-sm font-medium mb-4 uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}>
        Temperature Overview
      </h3>
      <div className="space-y-2.5">
        {cities.map((city) => {
          const percentage = ((city.temperature - minTemp) / range) * 100;
          return (
            <div key={city.cityCode} className="flex items-center gap-3">
              <span className="text-xs w-24 truncate text-right"
                style={{ color: "var(--text-secondary)" }}>
                {city.cityName}
              </span>
              <div className="flex-1 rounded-full h-4 relative overflow-hidden"
                style={{ background: "var(--bar-track)" }}>
                <div
                  className={`h-full rounded-full bg-linear-to-r ${getTempGradient(city.temperature)} transition-all duration-700 ease-out`}
                  style={{ width: `${Math.max(percentage, 3)}%` }}
                />
              </div>
              <span className="text-xs font-medium w-12 text-right"
                style={{ color: "var(--text-secondary)" }}>
                {Math.round(city.temperature)}°C
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
