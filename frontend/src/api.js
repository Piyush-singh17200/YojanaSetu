const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${res.status}`);
  }
  return res.json();
}

export function getSchemes(category = "all") {
  const q = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  return fetch(`${API_BASE}/api/schemes${q}`).then(handle);
}

export function getScheme(id) {
  return fetch(`${API_BASE}/api/schemes/${id}`).then(handle);
}

export function getCategories() {
  return fetch(`${API_BASE}/api/schemes/categories`).then(handle);
}

export function matchSchemes(profile) {
  return fetch(`${API_BASE}/api/schemes/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  }).then(handle);
}
