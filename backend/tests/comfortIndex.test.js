const {
  computeComfortIndex,
  temperatureScore,
  humidityScore,
  windScore,
  cloudinessScore,
  visibilityScore,
} = require('../src/utils/comfortIndex');

describe('Comfort Index Sub-Scores', () => {
  describe('temperatureScore (feels_like °C)', () => {
    test('returns 100 for ideal range 18-24°C', () => {
      expect(temperatureScore(18)).toBe(100);
      expect(temperatureScore(21)).toBe(100);
      expect(temperatureScore(24)).toBe(100);
    });

    test('returns 0 at -10°C or below', () => {
      expect(temperatureScore(-10)).toBe(0);
      expect(temperatureScore(-20)).toBe(0);
    });

    test('returns 0 at 40°C or above', () => {
      expect(temperatureScore(40)).toBeCloseTo(0, 0);
      expect(temperatureScore(50)).toBe(0);
    });

    test('cold side: intermediate at 4°C', () => {
      // (4+10)/28 * 100 = 50
      expect(temperatureScore(4)).toBe(50);
    });

    test('hot side: intermediate at 32°C', () => {
      // (40-32)/16 * 100 = 50
      expect(temperatureScore(32)).toBe(50);
    });

    test('hot side penalises harder than cold side', () => {
      // 6 degrees above ideal vs 6 degrees below ideal
      const hotScore = temperatureScore(30); // (40-30)/16*100 = 62.5
      const coldScore = temperatureScore(12); // (12+10)/28*100 = 78.6
      expect(hotScore).toBeLessThan(coldScore);
    });

    test('tropical feels-like (~33°C) scores low', () => {
      // (40-33)/16 * 100 = 43.75
      const score = temperatureScore(33);
      expect(score).toBeLessThan(50);
    });
  });

  describe('humidityScore', () => {
    test('returns 100 for ideal range 30-50%', () => {
      expect(humidityScore(30)).toBe(100);
      expect(humidityScore(40)).toBe(100);
      expect(humidityScore(50)).toBe(100);
    });

    test('returns 0 at 0% humidity', () => {
      expect(humidityScore(0)).toBe(0);
    });

    test('returns 0 at 100% humidity', () => {
      expect(humidityScore(100)).toBe(0);
    });

    test('returns 50 at 15% humidity', () => {
      expect(humidityScore(15)).toBe(50);
    });

    test('penalises high humidity (75%) significantly', () => {
      // (100-75)/50 * 100 = 50
      expect(humidityScore(75)).toBe(50);
    });

    test('60% humidity is no longer perfect', () => {
      // (100-60)/50 * 100 = 80
      expect(humidityScore(60)).toBe(80);
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
      main: { temp: 296.15, feels_like: 296.15, humidity: 40, pressure: 1013 },
      wind: { speed: 2, deg: 180 },
      clouds: { all: 20 },
      visibility: 10000,
    };

    const score = computeComfortIndex(mockWeather);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('perfect conditions produce score near 100', () => {
    // feels_like 21°C, 40% humidity, 1 m/s wind, 10% clouds, 10km vis
    const perfectWeather = {
      main: { temp: 294.15, feels_like: 294.15, humidity: 40, pressure: 1013 },
      wind: { speed: 1, deg: 0 },
      clouds: { all: 10 },
      visibility: 10000,
    };

    const score = computeComfortIndex(perfectWeather);
    expect(score).toBeGreaterThan(95);
  });

  test('harsh conditions produce low score', () => {
    // feels_like 45°C, 95% humidity, 15 m/s wind, 100% clouds, 1km vis
    const harshWeather = {
      main: { temp: 315.15, feels_like: 318.15, humidity: 95, pressure: 1005 },
      wind: { speed: 15, deg: 270 },
      clouds: { all: 100 },
      visibility: 1000,
    };

    const score = computeComfortIndex(harshWeather);
    expect(score).toBeLessThan(20);
  });

  test('hot humid city (Colombo-like) scores moderate-low', () => {
    // Raw 28°C but feels_like ~33°C due to humidity, 80% humidity
    // Heat stress multiplier should kick in (feels_like > 27 AND humidity > 55)
    const colomboWeather = {
      main: { temp: 301.15, feels_like: 306.15, humidity: 80, pressure: 1010 },
      wind: { speed: 2, deg: 200 },
      clouds: { all: 50 },
      visibility: 8000,
    };

    const score = computeComfortIndex(colomboWeather);
    expect(score).toBeLessThan(60);
    expect(score).toBeGreaterThan(25);
  });

  test('mild European city scores higher than tropical city', () => {
    const parisWeather = {
      main: { temp: 291.15, feels_like: 291.15, humidity: 55, pressure: 1015 },
      wind: { speed: 3, deg: 180 },
      clouds: { all: 30 },
      visibility: 10000,
    };

    const colomboWeather = {
      main: { temp: 301.15, feels_like: 306.15, humidity: 80, pressure: 1010 },
      wind: { speed: 2, deg: 200 },
      clouds: { all: 50 },
      visibility: 8000,
    };

    const parisScore = computeComfortIndex(parisWeather);
    const colomboScore = computeComfortIndex(colomboWeather);
    expect(parisScore).toBeGreaterThan(colomboScore);
  });

  test('ideal temp city (20°C) beats hot humid city', () => {
    // Sydney-like: 20°C, moderate conditions
    const sydneyWeather = {
      main: { temp: 293.15, feels_like: 293.15, humidity: 60, pressure: 1015 },
      wind: { speed: 5, deg: 180 },
      clouds: { all: 40 },
      visibility: 10000,
    };

    // Colombo-like: hot + humid
    const colomboWeather = {
      main: { temp: 301.15, feels_like: 306.15, humidity: 80, pressure: 1010 },
      wind: { speed: 2, deg: 200 },
      clouds: { all: 50 },
      visibility: 8000,
    };

    const sydneyScore = computeComfortIndex(sydneyWeather);
    const colomboScore = computeComfortIndex(colomboWeather);
    expect(sydneyScore).toBeGreaterThan(colomboScore);
  });

  test('cold windy conditions get extra penalty', () => {
    // Cold but calm
    const coldCalm = {
      main: { temp: 275.15, feels_like: 275.15, humidity: 40, pressure: 1020 },
      wind: { speed: 2, deg: 0 },
      clouds: { all: 20 },
      visibility: 10000,
    };

    // Cold AND windy — should score lower due to cold-wind multiplier
    const coldWindy = {
      main: { temp: 275.15, feels_like: 271.15, humidity: 40, pressure: 1020 },
      wind: { speed: 10, deg: 0 },
      clouds: { all: 20 },
      visibility: 10000,
    };

    const calmScore = computeComfortIndex(coldCalm);
    const windyScore = computeComfortIndex(coldWindy);
    expect(calmScore).toBeGreaterThan(windyScore);
  });

  test('returns a number with at most 1 decimal place', () => {
    const mockWeather = {
      main: { temp: 293.15, feels_like: 292.15, humidity: 70, pressure: 1010 },
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
      main: { temp: 296.15, feels_like: 296.15, humidity: 40, pressure: 1013 },
      wind: { speed: 2, deg: 180 },
      clouds: { all: 20 },
    };

    const score = computeComfortIndex(mockWeather);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
