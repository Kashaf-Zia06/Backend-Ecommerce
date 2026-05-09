const isEmpty = (value) => {
  return !value || value.trim() === "";
};

const validateFullName = (fullName) => {
  if (isEmpty(fullName)) {
    return "Full name is required.";
  }

  const trimmedName = fullName.trim();

  if (trimmedName.length < 2) {
    return "Full name must be at least 2 characters.";
  }

  if (trimmedName.length > 50) {
    return "Full name cannot exceed 50 characters.";
  }

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(trimmedName)) {
    return "Full name can only contain letters and spaces.";
  }

  return null;
};

const validateEmail = (email) => {
  if (isEmpty(email)) {
    return "Email is required.";
  }

  const trimmedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email address.";
  }

  return null;
};

const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (password.length > 30) {
    return "Password cannot exceed 30 characters.";
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return "Password must contain at least one letter and one number.";
  }

  return null;
};

const validatePhoneNumber = (phoneNumber) => {
  if (isEmpty(phoneNumber)) {
    return "Phone number is required.";
  }

  const trimmedPhone = phoneNumber.trim();

  const phoneRegex = /^[0-9]+$/;

  if (!phoneRegex.test(trimmedPhone)) {
    return "Phone number can only contain digits.";
  }

  if (trimmedPhone.length !== 11) {
    return "Phone number must be exactly 11 digits.";
  }

  return null;
};

const validateSignupInput = ({ fullName, email, password, phoneNumber }) => {
  const errors = [];

  const nameError = validateFullName(fullName);
  if (nameError) errors.push(nameError);

  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);

  const phoneError = validatePhoneNumber(phoneNumber);
  if (phoneError) errors.push(phoneError);

  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);

  return errors;
};

const validateLoginInput = ({ email, password }) => {
  const errors = [];

  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);

  if (!password) {
    errors.push("Password is required.");
  }

  return errors;
};

export {
  validateFullName,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateSignupInput,
  validateLoginInput,
};