"use client";

import { CityWeather } from "@/types";
import { Search, ChevronUp } from "lucide-react";

type SortField = "rank" | "temperature" | "comfortScore" | "cityName" | "humidity" | "windSpeed";
type SortDirection = "asc" | "desc";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (dir: SortDirection) => void;
  cityCount: number;
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange,
  cityCount,
}: FilterBarProps) {
  return (
    <div className="rounded-2xl border p-4 mb-6 theme-transition"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm placeholder-(--text-muted) focus:outline-none focus:border-blue-500 transition"
            style={{
              background: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label className="text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
            Sort by
          </label>
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            style={{
              background: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <option value="rank">Rank</option>
            <option value="comfortScore">Comfort Score</option>
            <option value="temperature">Temperature</option>
            <option value="cityName">City Name</option>
            <option value="humidity">Humidity</option>
            <option value="windSpeed">Wind Speed</option>
          </select>
          <button
            onClick={() =>
              onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")
            }
            className="p-2 border rounded-lg transition hover:border-blue-500"
            style={{ background: "var(--input-bg)", borderColor: "var(--border-color)" }}
            title={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
          >
            <ChevronUp
              className={`w-4 h-4 transition-transform ${
                sortDirection === "desc" ? "rotate-180" : ""
              }`}
              style={{ color: "var(--text-muted)" }}
            />
          </button>
        </div>

        {/* Count badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-1.5">
          <span className="text-xs text-blue-500 font-medium">
            {cityCount} cities
          </span>
        </div>
      </div>
    </div>
  );
}

export type { SortField, SortDirection };
