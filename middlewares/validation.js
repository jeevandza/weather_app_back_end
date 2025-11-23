/**
 * Generic Joi validator middleware
 * Usage: validate(schema) for query, validate(schema, { body: true }) for body
 */
export function validate(schema, options = {}) {
  return (req, res, next) => {
    const data = options.body ? req.body : req.query;

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

    // Only overwrite safely for body; avoid query overwrite issues
    if (options.body) req.body = value;

    // Attach value for query usage
    req.queryValue = value;

    next();
  };
}
