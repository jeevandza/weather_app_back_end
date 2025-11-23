import Joi from "joi";

/**
 * Weather query validation schema
 */
export const weatherQuerySchema = Joi.object({
  q: Joi.string().trim().required().messages({
    "string.base": `'q' must be a string`,
    "string.empty": `'q' cannot be empty`,
    "any.required": `'q' is required`,
  }),

  type: Joi.string().valid("current", "forecast").default("current").messages({
    "any.only": `'type' must be either 'current' or 'forecast'`,
  }),
});

/**
 * To fetch all weather data
 */
export const fetchAllWeatherSchema = Joi.object({});

