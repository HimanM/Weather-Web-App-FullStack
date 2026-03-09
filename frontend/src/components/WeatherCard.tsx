import { CityWeather } from "@/types";

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-lime-400";
  if (score >= 40) return "text-yellow-400";
  if (score >= 20) return "text-orange-400";
  return "text-red-400";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Poor";
  return "Harsh";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-green-500/10 border-green-500/30";
  if (score >= 60) return "bg-lime-500/10 border-lime-500/30";
  if (score >= 40) return "bg-yellow-500/10 border-yellow-500/30";
  if (score >= 20) return "bg-orange-500/10 border-orange-500/30";
  return "bg-red-500/10 border-red-500/30";
}

function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function getRankBadge(rank: number): string {
  if (rank === 1) return "bg-yellow-500 text-black";
  if (rank === 2) return "bg-gray-300 text-black";
  if (rank === 3) return "bg-amber-700 text-white";
  return "bg-[#334155] text-gray-300";
}

interface WeatherCardProps {
  city: CityWeather;
}

export default function WeatherCard({ city }: WeatherCardProps) {
  return (
    <div className="weather-card bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${getRankBadge(city.rank)}`}
          >
            #{city.rank}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {city.cityName}
            </h3>
            <p className="text-xs text-gray-400">{city.country}</p>
          </div>
        </div>
        {city.weatherIcon && (
          <img
            src={getWeatherIconUrl(city.weatherIcon)}
            alt={city.weatherDescription}
            className="w-14 h-14 -mt-2 -mr-1"
          />
        )}
      </div>

      {/* Main Stats */}
      <div className="px-4 pb-3">
        <div className="flex items-end gap-1 mb-1">
          <span className="text-4xl font-light text-white">
            {Math.round(city.temperature)}°
          </span>
          <span className="text-sm text-gray-400 pb-1.5">C</span>
        </div>
        <p className="text-sm text-gray-400 capitalize">
          {city.weatherDescription}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Feels like {Math.round(city.feelsLike)}° • H:{Math.round(city.tempMax)}° L:{Math.round(city.tempMin)}°
        </p>
      </div>

      {/* Comfort Score */}
      <div className={`mx-4 mb-3 p-3 rounded-lg border ${getScoreBg(city.comfortScore)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
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
            <div className="w-full bg-[#0b1120] rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  city.comfortScore >= 80
                    ? "bg-green-500"
                    : city.comfortScore >= 60
                      ? "bg-lime-500"
                      : city.comfortScore >= 40
                        ? "bg-yellow-500"
                        : city.comfortScore >= 20
                          ? "bg-orange-500"
                          : "bg-red-500"
                }`}
                style={{ width: `${city.comfortScore}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-2 text-sm">
        <DetailItem label="Humidity" value={`${city.humidity}%`} icon="💧" />
        <DetailItem label="Wind" value={`${city.windSpeed} m/s`} icon="💨" />
        <DetailItem label="Pressure" value={`${city.pressure} hPa`} icon="📊" />
        <DetailItem label="Visibility" value={`${(city.visibility / 1000).toFixed(1)} km`} icon="👁" />
        <DetailItem label="Cloudiness" value={`${city.cloudiness}%`} icon="☁️" />
        <DetailItem label="Wind Dir" value={`${city.windDeg}°`} icon="🧭" />
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#0f172a] rounded-lg px-2.5 py-1.5">
      <span className="text-xs">{icon}</span>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xs text-gray-300 font-medium">{value}</p>
      </div>
    </div>
  );
}
