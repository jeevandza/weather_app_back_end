import { LocationService } from "../services/index.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

/**
 * Countries Controllers
 */
export const getCountries = asyncHandler(async (req, res) => {
  const countries = await LocationService.getAllCountries();
  return res.status(200).json({ success: true, data: countries });
});

export const getCountryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const country = await LocationService.getCountry({ id });
  if (!country)
    return res
      .status(404)
      .json({ success: false, message: "Country not found" });

  return res.status(200).json({ success: true, data: country });
});

export const createCountry = asyncHandler(async (req, res) => {
  const country = await LocationService.createCountry(req.body);
  return res.status(201).json({ success: true, data: country });
});

export const updateCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await LocationService.updateCountry(id, req.body);
  const updated = await LocationService.getCountry({ id });
  return res.status(200).json({ success: true, data: updated });
});

/**
 * Cities Controllers
 */
export const getCities = asyncHandler(async (req, res) => {
  const { countryId } = req.query;
  const cities = await LocationService.getAllCities(countryId);
  return res.status(200).json({ success: true, data: cities });
});

export const getCityById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const city = await LocationService.getCity(id);
  if (!city)
    return res.status(404).json({ success: false, message: "City not found" });

  return res.status(200).json({ success: true, data: city });
});

export const createCity = asyncHandler(async (req, res) => {
  const city = await LocationService.createCity(req.body);
  return res.status(201).json({ success: true, data: city });
});

export const updateCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await LocationService.updateCity(id, req.body);
  const updated = await LocationService.getCity(id);
  return res.status(200).json({ success: true, data: updated });
});

/**
 * Seed Countries and Cities
 */
export const seedLocations = asyncHandler(async (req, res) => {
  const result = await LocationService.seedCountriesAndCities();
  return res.status(200).json({ success: true, message: result.message });
});
