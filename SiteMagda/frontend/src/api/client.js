const BASE = "/api";

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}

export function getProperties(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return request(`/properties/${query ? `?${query}` : ""}`);
}

export function getProperty(id) {
  return request(`/properties/${id}/`);
}

export function getStats() {
  return request(`/stats/`);
}

export function createLead(data) {
  return request(`/leads/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
