const {
  computeComfortIndex,
  temperatureScore,
  humidityScore,
  windScore,
  cloudinessScore,
  visibilityScore,
} = require('../src/utils/comfortIndex');

describe('Comfort Index Sub-Scores', () => {
  describe('temperatureScore', () => {
    test('returns 100 for ideal range 20-26°C', () => {
      expect(temperatureScore(20)).toBe(100);
      expect(temperatureScore(23)).toBe(100);
      expect(temperatureScore(26)).toBe(100);
    });

    test('returns 0 at -10°C or below', () => {
      expect(temperatureScore(-10)).toBe(0);
      expect(temperatureScore(-20)).toBe(0);
    });

    test('returns 0 at 45°C or above', () => {
      expect(temperatureScore(45)).toBeCloseTo(0, 0);
      expect(temperatureScore(50)).toBe(0);
    });

    test('returns intermediate values for moderate temps', () => {
      const score = temperatureScore(10);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });

    test('returns intermediate values for warm temps', () => {
      const score = temperatureScore(35);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });
  });

  describe('humidityScore', () => {
    test('returns 100 for ideal range 30-60%', () => {
      expect(humidityScore(30)).toBe(100);
      expect(humidityScore(45)).toBe(100);
      expect(humidityScore(60)).toBe(100);
    });

    test('returns 0 at 0% humidity', () => {
      expect(humidityScore(0)).toBe(0);
    });

    test('returns 0 at 100% humidity', () => {
      expect(humidityScore(100)).toBe(0);
    });

    test('returns intermediate for 15% humidity', () => {
      const score = humidityScore(15);
      expect(score).toBe(50);
    });
  });

  describe('windScore', () => {
    test('returns 100 for calm winds (0-3 m/s)', () => {
      expect(windScore(0)).toBe(100);
      expect(windScore(1.5)).toBe(100);
      expect(windScore(3)).toBe(100);
    });

    test('returns 0 at 20 m/s or above', () => {
      expect(windScore(20)).toBeCloseTo(0, 0);
      expect(windScore(25)).toBe(0);
    });

    test('returns intermediate for moderate wind', () => {
      const score = windScore(10);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });
  });

  describe('cloudinessScore', () => {
    test('returns 100 for clear to partly cloudy (0-40%)', () => {
      expect(cloudinessScore(0)).toBe(100);
      expect(cloudinessScore(40)).toBe(100);
    });

    test('returns 50 at 100% cloudiness', () => {
      expect(cloudinessScore(100)).toBe(50);
    });

    test('never goes below 50', () => {
      expect(cloudinessScore(100)).toBeGreaterThanOrEqual(50);
    });
  });

  describe('visibilityScore', () => {
    test('returns 100 for 10km+ visibility', () => {
      expect(visibilityScore(10000)).toBe(100);
      expect(visibilityScore(15000)).toBe(100);
    });

    test('returns 0 for 0m visibility', () => {
      expect(visibilityScore(0)).toBe(0);
    });

    test('returns 50 for 5km visibility', () => {
      expect(visibilityScore(5000)).toBe(50);
    });
  });
});

describe('computeComfortIndex', () => {
  test('returns a score between 0 and 100', () => {
    const mockWeather = {
      main: { temp: 296.15, feels_like: 296.15, humidity: 50, pressure: 1013 },
      wind: { speed: 2, deg: 180 },
      clouds: { all: 20 },
      visibility: 10000,
    };

    const score = computeComfortIndex(mockWeather);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('perfect conditions produce score near 100', () => {
    // 23°C, 45% humidity, 1 m/s wind, 10% clouds, 10km vis
    const perfectWeather = {
      main: { temp: 296.15, feels_like: 296.15, humidity: 45, pressure: 1013 },
      wind: { speed: 1, deg: 0 },
      clouds: { all: 10 },
      visibility: 10000,
    };

    const score = computeComfortIndex(perfectWeather);
    expect(score).toBeGreaterThan(95);
  });

  test('harsh conditions produce low score', () => {
    // 42°C, 95% humidity, 15 m/s wind, 100% clouds, 1km vis
    const harshWeather = {
      main: { temp: 315.15, feels_like: 320, humidity: 95, pressure: 1005 },
      wind: { speed: 15, deg: 270 },
      clouds: { all: 100 },
      visibility: 1000,
    };

    const score = computeComfortIndex(harshWeather);
    expect(score).toBeLessThan(30);
  });

  test('returns a number with at most 1 decimal place', () => {
    const mockWeather = {
      main: { temp: 293.15, feels_like: 292, humidity: 70, pressure: 1010 },
      wind: { speed: 5, deg: 90 },
      clouds: { all: 60 },
      visibility: 8000,
    };

    const score = computeComfortIndex(mockWeather);
    const decimals = score.toString().split('.')[1];
    expect(!decimals || decimals.length <= 1).toBe(true);
  });

  test('handles missing visibility gracefully (defaults to 10000)', () => {
    const mockWeather = {
      main: { temp: 296.15, feels_like: 296.15, humidity: 50, pressure: 1013 },
      wind: { speed: 2, deg: 180 },
      clouds: { all: 20 },
    };

    const score = computeComfortIndex(mockWeather);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
