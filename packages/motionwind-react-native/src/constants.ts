/**
 * Properties that require degree string values in RN transforms.
 * In web motion, rotate is a number (degrees). In RN, it must be "45deg".
 */
export const DEGREE_PROPERTIES = new Set([
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
]);
