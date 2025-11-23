import axios from "axios";


/**
 * fetch weather details based on the type 
 */
export async function getWeatherData(q, type = "current") {
  console.log("i called")
  const endpoint =
    type === "current"
      ? "https://api.weatherapi.com/v1/current.json"
      : "https://api.weatherapi.com/v1/forecast.json";

  const { data } = await axios.get(endpoint, {
    params: {
      key: process.env.WEATHER_KEY,
      q,
      days: type === "forecast" ? 7 : undefined, 
    },
  });

  return data;
}
