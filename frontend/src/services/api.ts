import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Create an axios instance that talks to our Next.js API routes
 * (which proxy to the backend with the JWT token).
 */
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export async function fetchWeatherData() {
  const { data } = await api.get("/weather");
  return data;
}

export async function fetchCacheStatus() {
  const { data } = await api.get("/cache-status");
  return data;
}

export { API_BASE_URL };
export default api;
