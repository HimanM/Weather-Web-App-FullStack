"use client";

import { CityWeather } from "@/types";

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
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full sm:w-auto">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap">
            Sort by
          </label>
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
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
            className="p-2 bg-[#0f172a] border border-[#334155] rounded-lg hover:border-blue-500 transition"
            title={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
          >
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                sortDirection === "desc" ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>

        {/* Count badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-1.5">
          <span className="text-xs text-blue-400 font-medium">
            {cityCount} cities
          </span>
        </div>
      </div>
    </div>
  );
}

export type { SortField, SortDirection };
