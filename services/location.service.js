import Models from "../models/index.js";
import axios from "axios";

/**
 * Countries
 */
export const createCountry = async (data) => {
  return await Models.countryModel.create(data);
};

export const getAllCountries = async () => {
  return await Models.countryModel.findAll({ order: [["name", "ASC"]] });
};

export const getCountry = async (identifier) => {
  return await Models.countryModel.findOne({
    where: identifier.code ? { code: identifier.code } : { id: identifier.id },
    include: { model: Models.cityModel, as: "cities" },
  });
};

export const updateCountry = async (id, updates) => {
  return await Models.countryModel.update(updates, { where: { id } });
};

/**
 * Cities
 */
export const createCity = async (data) => {
  return await Models.cityModel.create(data);
};

export const getAllCities = async (countryId = null) => {
  const query = countryId ? { where: { countryId } } : {};
  return await Models.cityModel.findAll({
    ...query,
    order: [["name", "ASC"]],
    include: { model: Models.countryModel, as: "country" },
  });
};

export const getCity = async (id) => {
  return await Models.cityModel.findByPk(id, {
    include: { model: Models.countryModel, as: "country" },
  });
};

export const updateCity = async (id, updates) => {
  return await Models.cityModel.update(updates, { where: { id } });
};

/**
 * Seed countries & cities from free API
 */
export const seedCountriesAndCities = async () => {
  try {
    const { data } = await axios.get(
      "https://countriesnow.space/api/v0.1/countries"
    );

    if (!data?.data) {
      console.warn("No country data received from API.");
      return;
    }

    for (const item of data.data) {
      const countryCode = item.iso2 || item.iso3 || item.country.slice(0, 3);

      let country;
      try {
        country = await createCountry({
          name: item.country,
          code: countryCode,
        });
      } catch (err) {
        // Skip if country already exists or validation fails
        console.warn(`Skipping country "${item.country}": ${err.message}`);
        continue;
      }

      for (const cityName of item.cities) {
        try {
          await createCity({
            name: cityName,
            countryId: country.id,
          });
        } catch (err) {
          console.warn(`Skipping city "${cityName}" in "${item.country}": ${err.message}`);
          continue;
        }
      }
    }

    return { success: true, message: "Countries and cities seeded successfully" };
  } catch (err) {
    console.error("Seeding countries and cities failed:", err.message);
    throw err;
  }
};
