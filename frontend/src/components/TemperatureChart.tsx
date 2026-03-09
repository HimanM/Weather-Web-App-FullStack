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

  function getTempColor(temp: number): string {
    if (temp >= 35) return "bg-red-500";
    if (temp >= 28) return "bg-orange-500";
    if (temp >= 20) return "bg-green-500";
    if (temp >= 10) return "bg-blue-400";
    return "bg-blue-600";
  }

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
        Temperature Overview
      </h3>
      <div className="space-y-2">
        {cities.map((city) => {
          const percentage = ((city.temperature - minTemp) / range) * 100;
          return (
            <div key={city.cityCode} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-24 truncate text-right">
                {city.cityName}
              </span>
              <div className="flex-1 bg-[#0f172a] rounded-full h-4 relative overflow-hidden">
                <div
                  className={`h-full rounded-full ${getTempColor(city.temperature)} transition-all duration-700 ease-out`}
                  style={{ width: `${Math.max(percentage, 3)}%` }}
                />
              </div>
              <span className="text-xs text-gray-300 font-medium w-12 text-right">
                {Math.round(city.temperature)}°C
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
