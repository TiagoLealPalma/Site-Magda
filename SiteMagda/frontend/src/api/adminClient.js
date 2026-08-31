const BASE = "/api";

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

async function ensureCsrfCookie() {
  if (!getCookie("csrftoken")) {
    await fetch(`${BASE}/auth/csrf/`, { credentials: "include" });
  }
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const isUnsafe = method !== "GET" && method !== "HEAD";
  const headers = { ...(options.headers || {}) };

  if (isUnsafe) {
    await ensureCsrfCookie();
    headers["X-CSRFToken"] = getCookie("csrftoken");
  }

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const error = new Error(body?.detail || `${res.status} ${res.statusText}`);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}

function jsonRequest(path, method, data) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export const auth = {
  me: () => request("/auth/me/"),
  login: (username, password) => jsonRequest("/auth/login/", "POST", { username, password }),
  logout: () => request("/auth/logout/", { method: "POST" }),
};

export const adminApi = {
  summary: () => request("/admin/summary/"),

  listProperties: () => request("/admin/properties/"),
  getProperty: (id) => request(`/admin/properties/${id}/`),
  createProperty: (data) => jsonRequest("/admin/properties/", "POST", data),
  updateProperty: (id, data) => jsonRequest(`/admin/properties/${id}/`, "PATCH", data),
  deleteProperty: (id) => request(`/admin/properties/${id}/`, { method: "DELETE" }),

  uploadImage: async (propertyId, file) => {
    await ensureCsrfCookie();
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE}/admin/properties/${propertyId}/images/`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: formData,
    });
    if (!res.ok) throw new Error(`Falha ao enviar imagem (${res.status})`);
    return res.json();
  },
  deleteImage: (imageId) => request(`/admin/images/${imageId}/`, { method: "DELETE" }),

  listLeads: () => request("/admin/leads/"),
  deleteLead: (id) => request(`/admin/leads/${id}/`, { method: "DELETE" }),
};
