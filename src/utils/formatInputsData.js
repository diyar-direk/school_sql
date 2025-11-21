export const formatInputsData = (data = {}) => {
  const formatted = {};

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      formatted[key] = value.map((item) => item?.id ?? item?.value ?? item);
    } else {
      formatted[key] = value?.id ?? value?.value ?? value;
    }
  }

  return formatted;
};
