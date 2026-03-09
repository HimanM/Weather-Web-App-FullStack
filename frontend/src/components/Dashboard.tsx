"use client";

import { useState, useEffect, useMemo } from "react";
import { CityWeather } from "@/types";
import WeatherCard from "@/components/WeatherCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import FilterBar, { SortField, SortDirection } from "@/components/FilterBar";
import TemperatureChart from "@/components/TemperatureChart";
import ComfortRanking from "@/components/ComfortRanking";

export default function Dashboard() {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showCharts, setShowCharts] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/weather");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        throw new Error("Failed to fetch weather data");
      }
      const json = await res.json();
      if (json.success) {
        setCities(json.data);
      } else {
        setError(json.error || "Unknown error");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const filteredAndSorted = useMemo(() => {
    let result = cities.filter((city) =>
      city.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "rank":
          cmp = a.rank - b.rank;
          break;
        case "comfortScore":
          cmp = a.comfortScore - b.comfortScore;
          break;
        case "temperature":
          cmp = a.temperature - b.temperature;
          break;
        case "cityName":
          cmp = a.cityName.localeCompare(b.cityName);
          break;
        case "humidity":
          cmp = a.humidity - b.humidity;
          break;
        case "windSpeed":
          cmp = a.windSpeed - b.windSpeed;
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [cities, searchTerm, sortField, sortDirection]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 text-lg font-semibold mb-2">Error</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Weather Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time weather analytics with Comfort Index rankings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              showCharts
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-[#1e293b] text-gray-400 border border-[#334155]"
            }`}
          >
            {showCharts ? "Hide Charts" : "Show Charts"}
          </button>
          <button
            onClick={fetchData}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1e293b] text-gray-400 border border-[#334155] hover:border-blue-500 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Charts */}
      {showCharts && cities.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ComfortRanking cities={cities} />
          <TemperatureChart cities={cities} />
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        cityCount={filteredAndSorted.length}
      />

      {/* City Cards */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No cities match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((city) => (
            <WeatherCard key={city.cityCode} city={city} />
          ))}
        </div>
      )}
    </div>
  );
}
