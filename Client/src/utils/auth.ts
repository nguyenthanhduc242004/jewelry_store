// Simple auth util for demo: checks if a user is logged in by looking for a token in localStorage
export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}
