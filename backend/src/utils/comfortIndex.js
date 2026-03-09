/**
 * Comfort Index Algorithm
 * =======================
 * Score range: 0–100 (higher = more comfortable)
 *
 * Formula uses 5 weather parameters:
 *   1. Temperature (°C) — weight 35%
 *   2. Humidity (%)     — weight 25%
 *   3. Wind Speed (m/s) — weight 20%
 *   4. Cloudiness (%)   — weight 10%
 *   5. Visibility (m)   — weight 10%
 *
 * Each sub‑score is normalised to 0–100 using piecewise‑linear curves
 * centred around "ideal" human‑comfort values derived from
 * ASHRAE Standard 55 and common bioclimatic research.
 *
 * Ideal ranges:
 *   • Temperature: 20‑26 °C  (full score)
 *   • Humidity:    30‑60 %   (full score)
 *   • Wind:        0‑3  m/s  (full score, degrades above 10 m/s)
 *   • Cloudiness:  0‑40 %    (full score, slight penalty for overcast)
 *   • Visibility:  ≥10 km    (full score, penalty below 5 km)
 */

const WEIGHTS = {
  temperature: 0.35,
  humidity: 0.25,
  wind: 0.20,
  cloudiness: 0.10,
  visibility: 0.10,
};

/**
 * Clamp a value between min and max.
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Temperature sub‑score (input in °C).
 * Perfect: 20–26 °C → 100
 * Falls off linearly to 0 at ≤ −10 °C and ≥ 45 °C.
 */
function temperatureScore(tempC) {
  if (tempC >= 20 && tempC <= 26) return 100;
  if (tempC < 20) return clamp(((tempC + 10) / 30) * 100, 0, 100);
  // tempC > 26
  return clamp(((45 - tempC) / 19) * 100, 0, 100);
}

/**
 * Humidity sub‑score (input in %).
 * Perfect: 30–60 % → 100
 * Falls off linearly to 0 at 0 % and 100 %.
 */
function humidityScore(humidity) {
  if (humidity >= 30 && humidity <= 60) return 100;
  if (humidity < 30) return clamp((humidity / 30) * 100, 0, 100);
  // humidity > 60
  return clamp(((100 - humidity) / 40) * 100, 0, 100);
}

/**
 * Wind speed sub‑score (input in m/s).
 * Perfect: 0–3 m/s → 100
 * Falls off to 0 at 20 m/s.
 */
function windScore(speed) {
  if (speed <= 3) return 100;
  return clamp(((20 - speed) / 17) * 100, 0, 100);
}

/**
 * Cloudiness sub‑score (input in %).
 * 0–40 % → 100, falls to 50 at 100 % (overcast is mildly uncomfortable).
 */
function cloudinessScore(clouds) {
  if (clouds <= 40) return 100;
  return clamp(100 - ((clouds - 40) / 60) * 50, 50, 100);
}

/**
 * Visibility sub‑score (input in metres).
 * ≥10 000 m → 100, falls linearly to 0 at 0 m.
 */
function visibilityScore(visMetres) {
  return clamp((visMetres / 10000) * 100, 0, 100);
}

/**
 * Compute the overall Comfort Index for a city.
 *
 * @param {object} weatherData – raw OpenWeatherMap response
 * @returns {number} score 0–100 rounded to 1 decimal
 */
function computeComfortIndex(weatherData) {
  const tempC = weatherData.main.temp - 273.15; // Kelvin → Celsius
  const humidity = weatherData.main.humidity;
  const wind = weatherData.wind.speed;
  const clouds = weatherData.clouds.all;
  const visibility = weatherData.visibility || 10000;

  const tScore = temperatureScore(tempC);
  const hScore = humidityScore(humidity);
  const wScore = windScore(wind);
  const cScore = cloudinessScore(clouds);
  const vScore = visibilityScore(visibility);

  const total =
    tScore * WEIGHTS.temperature +
    hScore * WEIGHTS.humidity +
    wScore * WEIGHTS.wind +
    cScore * WEIGHTS.cloudiness +
    vScore * WEIGHTS.visibility;

  return Math.round(total * 10) / 10; // 1 decimal place
}

module.exports = {
  computeComfortIndex,
  temperatureScore,
  humidityScore,
  windScore,
  cloudinessScore,
  visibilityScore,
  WEIGHTS,
};
