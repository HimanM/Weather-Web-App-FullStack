/**
 * Comfort Index Algorithm
 * =======================
 * Score range: 0–100 (higher = more comfortable)
 *
 * Uses the "feels like" temperature (accounts for humidity + wind chill)
 * rather than raw temperature, so hot‑humid cities like Colombo are
 * properly penalised.
 *
 * Aggregation: **Weighted geometric mean** instead of arithmetic mean.
 * This ensures that a single bad parameter (e.g. 95% humidity) drags
 * the overall score down much more than in an additive model, producing
 * wider and more realistic score spreads.
 *
 * Formula uses 5 weather parameters:
 *   1. Feels‑like Temperature (°C) — weight 35%
 *   2. Humidity (%)                — weight 25%
 *   3. Wind Speed (m/s)            — weight 20%
 *   4. Cloudiness (%)              — weight 10%
 *   5. Visibility (m)              — weight 10%
 *
 * Post‑aggregation multipliers:
 *   • Heat‑stress: exponential penalty when feels_like > 26 °C AND humidity > 50 %
 *   • Cold‑wind:   exponential penalty when feels_like < 5 °C AND wind > 5 m/s
 *
 * Ideal ranges (ASHRAE Standard 55 + bioclimatic research):
 *   • Feels‑like temp: 18‑24 °C (full score)
 *   • Humidity:        30‑50 %  (full score)
 *   • Wind:            0‑3 m/s  (full score, degrades above 10 m/s)
 *   • Cloudiness:      0‑40 %   (slight penalty for overcast)
 *   • Visibility:      ≥10 km   (full score, penalty below 5 km)
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
 * Temperature sub‑score (input: feels_like in °C).
 * Perfect: 18–24 °C → 100
 * Cold side: linear to 0 at −10 °C  (28‑degree span)
 * Hot side:  linear to 0 at  40 °C  (16‑degree span — heat penalised harder)
 */
function temperatureScore(feelsLikeC) {
  if (feelsLikeC >= 18 && feelsLikeC <= 24) return 100;
  if (feelsLikeC < 18) return clamp(((feelsLikeC + 10) / 28) * 100, 0, 100);
  // feelsLikeC > 24
  return clamp(((40 - feelsLikeC) / 16) * 100, 0, 100);
}

/**
 * Humidity sub‑score (input in %).
 * Perfect: 30–50 % → 100
 * Below 30 %: linear to 0 at 0 %.
 * Above 50 %: linear to 0 at 100 %.
 */
function humidityScore(humidity) {
  if (humidity >= 30 && humidity <= 50) return 100;
  if (humidity < 30) return clamp((humidity / 30) * 100, 0, 100);
  // humidity > 50
  return clamp(((100 - humidity) / 50) * 100, 0, 100);
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
  const feelsLikeC = weatherData.main.feels_like - 273.15; // Kelvin → Celsius
  const humidity = weatherData.main.humidity;
  const wind = weatherData.wind.speed;
  const clouds = weatherData.clouds.all;
  const visibility = weatherData.visibility || 10000;

  // Floor sub-scores at 1 to avoid ln(0) in geometric mean
  const tScore = Math.max(temperatureScore(feelsLikeC), 1);
  const hScore = Math.max(humidityScore(humidity), 1);
  const wScore = Math.max(windScore(wind), 1);
  const cScore = Math.max(cloudinessScore(clouds), 1);
  const vScore = Math.max(visibilityScore(visibility), 1);

  // Weighted geometric mean — a single bad dimension drags the total
  // down much harder than an arithmetic average would
  let total = Math.exp(
    WEIGHTS.temperature * Math.log(tScore) +
    WEIGHTS.humidity * Math.log(hScore) +
    WEIGHTS.wind * Math.log(wScore) +
    WEIGHTS.cloudiness * Math.log(cScore) +
    WEIGHTS.visibility * Math.log(vScore)
  );

  // Heat-stress multiplier: hot + humid compounds discomfort exponentially
  // Kicks in when feels_like > 26°C AND humidity > 50%
  if (feelsLikeC > 26 && humidity > 50) {
    const heatFactor = clamp((feelsLikeC - 26) / 14, 0, 1);
    const humidFactor = clamp((humidity - 50) / 50, 0, 1);
    total *= Math.exp(-2 * heatFactor * humidFactor);
  }

  // Cold-wind multiplier: cold + windy compounds discomfort
  // Kicks in when feels_like < 5°C AND wind > 5 m/s
  if (feelsLikeC < 5 && wind > 5) {
    const coldFactor = clamp((5 - feelsLikeC) / 15, 0, 1);
    const windFactor = clamp((wind - 5) / 15, 0, 1);
    total *= Math.exp(-1.5 * coldFactor * windFactor);
  }

  return Math.round(clamp(total, 0, 100) * 10) / 10; // 1 decimal place
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
