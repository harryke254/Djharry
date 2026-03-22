// Simple localStorage admin auth
const AUTH_KEY = "dj_admin_auth";

export const isAdmin = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === "true";
};

export const loginAdmin = (password: string): boolean => {
  if (password === "djharry2024") {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
