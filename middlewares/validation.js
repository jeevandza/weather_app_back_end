/**
 * Generic Joi validator middleware
 * Usage: validate(schema) for query, validate(schema, { body: true }) for body
 */
export function validate(schema, options = {}) {
  return (req, res, next) => {
    const data = options.body ? req.body : req.query;

    if (!schema || typeof schema.validate !== "function") {
      return res.status(500).json({
        success: false,
        message: "Validation schema is invalid or undefined",
      });
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      ...options.joiOptions,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    // Save validated data safely
    if (options.body) req.validatedBody = value;
    else req.validatedQuery = value;

    next();
  };
}




