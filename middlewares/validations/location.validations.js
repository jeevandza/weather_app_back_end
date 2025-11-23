import Joi from "joi";

/** ------------------ Countries ------------------ */
export const getCountriesSchema = Joi.object({});

export const getCountryByIdSchema = Joi.object({
  id: Joi.number()
    .required()
    .messages({
      "number.base": `'id' must be a number`,
      "any.required": `'id' is required`,
    }),
});

export const createCountrySchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": `'name' must be a string`,
      "string.empty": `'name' cannot be empty`,
      "any.required": `'name' is required`,
    }),
  code: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": `'code' must be a string`,
      "string.empty": `'code' cannot be empty`,
      "any.required": `'code' is required`,
    }),
});

export const updateCountrySchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.base": `'name' must be a string`,
    "string.empty": `'name' cannot be empty`,
  }),
  code: Joi.string().trim().messages({
    "string.base": `'code' must be a string`,
    "string.empty": `'code' cannot be empty`,
  }),
});

/** ------------------ Cities ------------------ */
export const getCitiesSchema = Joi.object({
  countryId: Joi.number().optional().messages({
    "number.base": `'countryId' must be a number`,
  }),
});

export const getCityByIdSchema = Joi.object({
  id: Joi.number()
    .required()
    .messages({
      "number.base": `'id' must be a number`,
      "any.required": `'id' is required`,
    }),
});

export const createCitySchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": `'name' must be a string`,
      "string.empty": `'name' cannot be empty`,
      "any.required": `'name' is required`,
    }),
  countryId: Joi.number()
    .required()
    .messages({
      "number.base": `'countryId' must be a number`,
      "any.required": `'countryId' is required`,
    }),
});

export const updateCitySchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.base": `'name' must be a string`,
    "string.empty": `'name' cannot be empty`,
  }),
  countryId: Joi.number().messages({
    "number.base": `'countryId' must be a number`,
  }),
});
