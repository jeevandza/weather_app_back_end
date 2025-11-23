export async function getWeatherData(lon, lat) {
  const weatherData = await fetch(
    `https://api.weatherapi.com/v1/current.json?q=${lon},${lat}&key=${process.env.WEATHER_KEY}
    `
  ).then((res) => res.json());
  return weatherData;
}


// https://api.weatherapi.com/v1/current.json?q=22&lang=30&key=6f0f4ea1dbf8402983f71150252211