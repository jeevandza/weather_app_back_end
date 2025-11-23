import logger from "../utils/logger.js";

/**
 * Generic async wrapper
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error(err);
    next(err);
  });
};
