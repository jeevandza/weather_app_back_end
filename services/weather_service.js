import Models from "../models/index.js"
/**
 * Create/save weather based on type
 */
async function saveWeatherToDB(weatherData, type = "current") {
  await Models.weatherModel.create({
    location_name: weatherData.location.name,
    region: weatherData.location.region,
    country: weatherData.location.country,
    lat: weatherData.location.lat,
    lon: weatherData.location.lon,
    localtime: weatherData.location.localtime,
    temp_c: weatherData.current.temp_c,
    temp_f: weatherData.current.temp_f,
    is_day: weatherData.current.is_day,
    condition_text: weatherData.current.condition.text,
    condition_code: weatherData.current.condition.code,
    condition_icon: weatherData.current.condition.icon,
    wind_mph: weatherData.current.wind_mph,
    wind_kph: weatherData.current.wind_kph,
    wind_degree: weatherData.current.wind_degree,
    wind_dir: weatherData.current.wind_dir,
    pressure_mb: weatherData.current.pressure_mb,
    precip_mm: weatherData.current.precip_mm,
    humidity: weatherData.current.humidity,
    cloud: weatherData.current.cloud,
    feelslike_c: weatherData.current.feelslike_c,
    dewpoint_c: weatherData.current.dewpoint_c,
    vis_km: weatherData.current.vis_km,
    uv: weatherData.current.uv,
    gust_kph: weatherData.current.gust_kph,
    data_type: type,
    updated_at: new Date(),
  });
}


/**
 * Get all the data from collection
 */
export const getAllWeatherData = async()=>{
    return await Models.weatherModel.findAll()
}


/**
 * Get weather based location and type
 */
export const getLatestWeather = async (location_name, type = "current") => {
  return await Models.weatherModel.findOne({
    where: { location_name, data_type: type },
    order: [["updated_at", "DESC"]],
  });
};

/**
 * Save to database  
 */
export const saveWeather = async (data) => {
  return await Models.weatherModel.create(data);
};



/**
 * Update to database
 */
export const updateWeather = async (location_name, type, updates) => {
  return await Models.weatherModel.update(updates, {
    where: { location_name, data_type: type },
  });
};

export { saveWeatherToDB };
