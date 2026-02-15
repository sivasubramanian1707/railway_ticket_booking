/**
 * Validates email format
 */
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength (minimum 6 characters)
 */
exports.validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validates phone number (10-15 digits)
 */
exports.validatePhoneNo = (phoneNo) => {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phoneNo);
};

/**
 * Validates that a value is not empty
 */
exports.validateRequired = (value) => {
  return value && value.toString().trim() !== "";
};

/**
 * Validates positive number
 */
exports.validatePositiveNumber = (num) => {
  return num && !isNaN(num) && Number(num) > 0;
};
