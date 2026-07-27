// Auth helper functions for storing/reading JWT login data

/** Store login response for a given role (admin | mentor | student) */
export function saveAuth(role, data) {
  localStorage.setItem(`${role}Auth`, JSON.stringify(data));
}

/** Get auth data for a role */
export function getAuth(role) {
  const raw = localStorage.getItem(`${role}Auth`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Check if a role is currently logged in */
export function isLoggedIn(role) {
  const auth = getAuth(role);
  return !!(auth && auth.token);
}

/** Clear auth for a role (logout) */
export function logout(role) {
  localStorage.removeItem(`${role}Auth`);
}

/** Get current user name for any logged-in role */
export function getCurrentName() {
  const roles = ["admin", "mentor", "student"];
  for (const r of roles) {
    const auth = getAuth(r);
    if (auth && auth.name) return auth.name;
  }
  return "User";
}
