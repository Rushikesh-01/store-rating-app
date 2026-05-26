export const validators = {
  name: (v) => {
    if (!v || v.trim().length < 20) return 'Name must be at least 20 characters';
    if (v.trim().length > 60) return 'Name must not exceed 60 characters';
    return null;
  },
  email: (v) => {
    if (!v || !v.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email address';
    return null;
  },
  password: (v) => {
    if (!v) return 'Password is required';
    if (v.length < 8 || v.length > 16) return 'Password must be 8–16 characters';
    if (!/[A-Z]/.test(v)) return 'Password must contain at least one uppercase letter';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(v)) return 'Password must contain at least one special character';
    return null;
  },
  address: (v) => {
    if (v && v.length > 400) return 'Address must not exceed 400 characters';
    return null;
  },
  rating: (v) => {
    const n = parseInt(v);
    if (isNaN(n) || n < 1 || n > 5) return 'Rating must be between 1 and 5';
    return null;
  },
};

export const validateForm = (data, schema) => {
  const errors = {};
  for (const [field, validate] of Object.entries(schema)) {
    const error = validate(data[field]);
    if (error) errors[field] = error;
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const getApiError = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors?.length)
    return error.response.data.errors.map((e) => e.message).join(', ');
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};
