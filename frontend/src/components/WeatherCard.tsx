import { CityWeather } from "@/types";
import { Droplets, Wind, Gauge, Eye, Cloud, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-lime-500";
  if (score >= 40) return "text-yellow-500";
  if (score >= 20) return "text-orange-500";
  return "text-red-500";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Poor";
  return "Harsh";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/25";
  if (score >= 60) return "bg-lime-500/10 border-lime-500/25";
  if (score >= 40) return "bg-yellow-500/10 border-yellow-500/25";
  if (score >= 20) return "bg-orange-500/10 border-orange-500/25";
  return "bg-red-500/10 border-red-500/25";
}

function getBarGradient(score: number): string {
  if (score >= 80) return "from-emerald-500 to-emerald-400";
  if (score >= 60) return "from-lime-500 to-lime-400";
  if (score >= 40) return "from-yellow-500 to-yellow-400";
  if (score >= 20) return "from-orange-500 to-orange-400";
  return "from-red-500 to-red-400";
}

function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function getRankBadge(rank: number): string {
  if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/20";
  if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-400 text-black";
  if (rank === 3) return "bg-gradient-to-br from-amber-600 to-amber-700 text-white";
  return "text-[var(--text-muted)]";
}

interface WeatherCardProps {
  city: CityWeather;
}

export default function WeatherCard({ city }: WeatherCardProps) {
  return (
    <div className="weather-card rounded-2xl border overflow-hidden theme-transition"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${getRankBadge(city.rank)}`}
            style={city.rank > 3 ? { background: "var(--bg-inset)", border: "1px solid var(--border-color)" } : undefined}
          >
            #{city.rank}
          </span>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {city.cityName}
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{city.country}</p>
          </div>
        </div>
        {city.weatherIcon && (
          <img
            src={getWeatherIconUrl(city.weatherIcon)}
            alt={city.weatherDescription}
            className="w-14 h-14 -mt-2 -mr-1 drop-shadow-lg"
          />
        )}
      </div>

      {/* Main Stats */}
      <div className="px-5 pb-3">
        <div className="flex items-end gap-1 mb-1">
          <span className="text-4xl font-light" style={{ color: "var(--text-primary)" }}>
            {Math.round(city.temperature)}°
          </span>
          <span className="text-sm pb-1.5" style={{ color: "var(--text-muted)" }}>C</span>
        </div>
        <p className="text-sm capitalize" style={{ color: "var(--text-secondary)" }}>
          {city.weatherDescription}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Feels like {Math.round(city.feelsLike)}° • H:{Math.round(city.tempMax)}° L:{Math.round(city.tempMin)}°
        </p>
      </div>

      {/* Comfort Score */}
      <div className={`mx-5 mb-3 p-3 rounded-xl border ${getScoreBg(city.comfortScore)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}>
            Comfort Index
          </span>
          <span className={`text-xs font-semibold ${getScoreColor(city.comfortScore)}`}>
            {getScoreLabel(city.comfortScore)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${getScoreColor(city.comfortScore)}`}>
            {city.comfortScore}
          </span>
          <div className="flex-1">
            <div className="w-full rounded-full h-2" style={{ background: "var(--bar-track)" }}>
              <div
                className={`h-2 rounded-full bg-linear-to-r ${getBarGradient(city.comfortScore)} transition-all duration-500`}
                style={{ width: `${city.comfortScore}%` }}
              />
            </div>
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>/100</span>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-2 text-sm">
        <DetailItem label="Humidity" value={`${city.humidity}%`} icon={Droplets} />
        <DetailItem label="Wind" value={`${city.windSpeed} m/s`} icon={Wind} />
        <DetailItem label="Pressure" value={`${city.pressure} hPa`} icon={Gauge} />
        <DetailItem label="Visibility" value={`${(city.visibility / 1000).toFixed(1)} km`} icon={Eye} />
        <DetailItem label="Cloudiness" value={`${city.cloudiness}%`} icon={Cloud} />
        <DetailItem label="Wind Dir" value={`${city.windDeg}°`} icon={Compass} />
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-3 py-2"
      style={{ background: "var(--bg-inset)" }}>
      <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
      <div>
        <p className="text-[10px] uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p className="text-xs font-medium"
          style={{ color: "var(--text-secondary)" }}>{value}</p>
      </div>
    </div>
  );
}
