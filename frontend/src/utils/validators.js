/**
 * Plain-JS validators for React Hook Form's `validate` option.
 * Each validator returns `true` when valid, or an error message string.
 */

// Indian mobile: optional +91 / 0 prefix, then 10 digits starting 6-9
export const INDIAN_MOBILE_REGEX = /^(?:\+91[\s-]?|0)?[6-9]\d{9}$/;

// Pragmatic RFC-5322-ish email check
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const isBlank = (value) =>
  value === undefined || value === null || String(value).trim() === "";

export const required =
  (label = "This field") =>
  (value) =>
    isBlank(value) ? `${label} is required` : true;

export const minLength =
  (min, label = "This field") =>
  (value) =>
    isBlank(value) || String(value).trim().length >= min
      ? true
      : `${label} must be at least ${min} characters`;

export const maxLength =
  (max, label = "This field") =>
  (value) =>
    isBlank(value) || String(value).trim().length <= max
      ? true
      : `${label} must be under ${max} characters`;

export const isIndianMobile = (value) => {
  if (isBlank(value)) return "Mobile number is required";
  const cleaned = String(value).replace(/\s+/g, "");
  return INDIAN_MOBILE_REGEX.test(cleaned)
    ? true
    : "Enter a valid 10-digit Indian mobile number";
};

/** Email is optional — validate only when provided. */
export const isEmail = (value) =>
  isBlank(value) || EMAIL_REGEX.test(String(value).trim())
    ? true
    : "Enter a valid email address";

export const isEmailRequired = (value) => {
  if (isBlank(value)) return "Email is required";
  return isEmail(value);
};

export const isNotPastDate = (value) => {
  if (isBlank(value)) return "Travel date is required";
  const selected = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(selected.getTime())) return "Enter a valid date";
  return selected >= today ? true : "Travel date cannot be in the past";
};

export const isOnOrAfter =
  (otherValue, label = "Return date") =>
  (value) => {
    if (isBlank(value) || isBlank(otherValue)) return true;
    return new Date(value) >= new Date(otherValue)
      ? true
      : `${label} must be on or after the travel date`;
  };

export const isPositiveInt =
  (label = "Value", { min = 1, max = 99 } = {}) =>
  (value) => {
    if (isBlank(value)) return `${label} is required`;
    const n = Number(value);
    if (!Number.isInteger(n)) return `${label} must be a whole number`;
    if (n < min) return `${label} must be at least ${min}`;
    if (n > max) return `${label} cannot exceed ${max}`;
    return true;
  };

/** Compose several validators into one (first failure wins). */
export const compose =
  (...validators) =>
  (value, formValues) => {
    for (const validator of validators) {
      const result = validator(value, formValues);
      if (result !== true) return result;
    }
    return true;
  };

/** Normalise a mobile number to E.164 (+91XXXXXXXXXX) for the API payload. */
export function normalizeMobile(value = "") {
  const digits = String(value).replace(/\D/g, "");
  const last10 = digits.slice(-10);
  return `+91${last10}`;
}
