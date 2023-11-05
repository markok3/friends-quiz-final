export const setItem = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const getItem = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
};

export const removeItem = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
