export interface CityWeather {
  cityCode: string;
  cityName: string;
  country: string;
  weatherDescription: string;
  weatherIcon: string;
  weatherMain: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  cloudiness: number;
  visibility: number;
  comfortScore: number;
  rank: number;
  dt: number;
  timezone: number;
  coord: { lon: number; lat: number };
}

export interface WeatherResponse {
  success: boolean;
  count: number;
  data: CityWeather[];
}

export interface CacheEntry {
  key: string;
  status: "HIT" | "MISS";
  ttl: number;
}

export interface CacheStatusResponse {
  success: boolean;
  data: CacheEntry[];
}
