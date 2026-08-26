const STORAGE_KEY = "my-data";

export function getProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(STORAGE_KEY);
}
