/**
 * =====================================================================
 *  DATA SERVICE LAYER
 * =====================================================================
 *  Components never touch mock data directly — they call the functions
 *  exported at the bottom of this file. Today those functions resolve
 *  against an in-memory mock (with simulated latency); tomorrow they hit
 *  a real REST backend. Swap by setting VITE_USE_MOCK_API=false (or
 *  flipping the constant) — every call already goes through `request()`.
 *
 *  Expected backend envelope:
 *    { success: boolean, data: any, meta?: object, message?: string }
 * =====================================================================
 */
import { db } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";
const MOCK_LATENCY_MS = 350;

/* ------------------------------------------------------------------ */
/*  Errors                                                             */
/* ------------------------------------------------------------------ */
export class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value)); // never leak mock refs
const active = (rows) => rows.filter((r) => r.status === undefined || r.status === "active");
const envelope = (data, meta = {}) => ({
  success: true,
  data,
  meta: { timestamp: new Date().toISOString(), ...meta },
});
const applyLimit = (rows, limit) =>
  limit ? rows.slice(0, Number(limit)) : rows;

/* ------------------------------------------------------------------ */
/*  Admin mock token helpers                                           */
/* ------------------------------------------------------------------ */
const MOCK_ADMIN_TOKEN = "mock-jwt-token";
const ADMIN_TOKEN_KEY = "pmc_admin_token";

function getStoredToken() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

function isValidMockToken(token) {
  return token === MOCK_ADMIN_TOKEN;
}

function requireMockAuth(token) {
  if (!isValidMockToken(token)) {
    throw new ApiError("Unauthorized — valid admin token required", 401);
  }
}

/* ------------------------------------------------------------------ */
/*  Mock transport — a tiny router that mimics the REST backend        */
/* ------------------------------------------------------------------ */
async function mockRequest(method, path, { params = {}, body, headers = {} } = {}) {
  await delay(MOCK_LATENCY_MS);

  // ============================================================
  // PUBLIC ROUTES
  // ============================================================

  // GET /vehicles
  if (method === "GET" && path === "/vehicles") {
    const rows = applyLimit(active(db.vehicles), params.limit);
    return envelope(clone(rows), { total: rows.length });
  }

  // GET /vehicles/:slug
  let match = path.match(/^\/vehicles\/([\w-]+)$/);
  if (method === "GET" && match) {
    const row = active(db.vehicles).find((v) => v.slug === match[1]);
    if (!row) throw new ApiError(`Vehicle "${match[1]}" not found`, 404);
    return envelope(clone(row));
  }

  // GET /routes
  if (method === "GET" && path === "/routes") {
    const rows = active(db.routes);
    return envelope(clone(rows), { total: rows.length });
  }

  // GET /routes/:slug
  match = path.match(/^\/routes\/([\w-]+)$/);
  if (method === "GET" && match) {
    const row = active(db.routes).find((r) => r.slug === match[1]);
    if (!row) throw new ApiError(`Route "${match[1]}" not found`, 404);
    return envelope(clone(row));
  }

  // GET /faqs?routeSlug=general|<slug>&limit=n
  if (method === "GET" && path === "/faqs") {
    let rows = db.faqs;
    if (params.routeSlug === "general") rows = rows.filter((f) => f.routeSlug === null);
    else if (params.routeSlug) rows = rows.filter((f) => f.routeSlug === params.routeSlug);
    rows = applyLimit(rows, params.limit);
    return envelope(clone(rows), { total: rows.length });
  }

  // GET /testimonials?limit=n
  if (method === "GET" && path === "/testimonials") {
    const rows = applyLimit(db.testimonials, params.limit);
    return envelope(clone(rows), { total: rows.length });
  }

  // GET /services
  if (method === "GET" && path === "/services") {
    return envelope(clone(db.services), { total: db.services.length });
  }

  // GET /stats
  if (method === "GET" && path === "/stats") {
    return envelope(clone(db.companyStats));
  }

  // POST /bookings
  if (method === "POST" && path === "/bookings") {
    if (!body?.name || !body?.mobile) {
      throw new ApiError("Name and mobile are required", 422, {
        fields: { name: !body?.name, mobile: !body?.mobile },
      });
    }
    // Test hook: use mobile 9999999999 to exercise the error UI.
    if (String(body.mobile).endsWith("9999999999")) {
      throw new ApiError("Our booking server is temporarily unavailable. Please call or WhatsApp us.", 503);
    }
    const reference = `PMC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    return envelope(
      { reference, status: "received", ...clone(body), createdAt: new Date().toISOString() },
      { message: "Booking request received" }
    );
  }

  // ============================================================
  // ADMIN ROUTES
  // ============================================================

  // POST /admin/login
  if (method === "POST" && path === "/admin/login") {
    if (!body?.username || !body?.password) {
      throw new ApiError("Username and password are required", 422);
    }
    if (body.username !== db.adminUser.username || body.password !== db.adminUser.password) {
      throw new ApiError("Invalid username or password", 401);
    }
    return envelope({
      token: MOCK_ADMIN_TOKEN,
      user: { username: db.adminUser.username, role: db.adminUser.role },
    });
  }

  // All /admin/* routes below require auth
  const token = headers.Authorization?.replace("Bearer ", "");
  requireMockAuth(token);

  // GET /admin/vehicles (all, including inactive)
  if (method === "GET" && path === "/admin/vehicles") {
    return envelope(clone(db.vehicles), { total: db.vehicles.length });
  }

  // POST /admin/vehicles
  if (method === "POST" && path === "/admin/vehicles") {
    const newId = Math.max(...db.vehicles.map((v) => v.id), 0) + 1;
    const vehicle = { id: newId, status: "active", isPopular: false, currency: "INR", ...clone(body) };
    db.vehicles.push(vehicle);
    return envelope(clone(vehicle));
  }

  // PUT /admin/vehicles/:id
  match = path.match(/^\/admin\/vehicles\/(\d+)$/);
  if (method === "PUT" && match) {
    const idx = db.vehicles.findIndex((v) => v.id === Number(match[1]));
    if (idx === -1) throw new ApiError(`Vehicle #${match[1]} not found`, 404);
    db.vehicles[idx] = { ...db.vehicles[idx], ...clone(body) };
    return envelope(clone(db.vehicles[idx]));
  }

  // DELETE /admin/vehicles/:id (soft delete)
  if (method === "DELETE" && path.match(/^\/admin\/vehicles\/(\d+)$/)) {
    const id = Number(path.match(/^\/admin\/vehicles\/(\d+)$/)[1]);
    const idx = db.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new ApiError(`Vehicle #${id} not found`, 404);
    db.vehicles[idx].status = "inactive";
    return envelope({ id, status: "inactive" });
  }

  // GET /admin/routes (all)
  if (method === "GET" && path === "/admin/routes") {
    return envelope(clone(db.routes), { total: db.routes.length });
  }

  // POST /admin/routes
  if (method === "POST" && path === "/admin/routes") {
    const newId = Math.max(...db.routes.map((r) => r.id), 0) + 1;
    const route = { id: newId, status: "active", currency: "INR", ...clone(body) };
    db.routes.push(route);
    return envelope(clone(route));
  }

  // PUT /admin/routes/:id
  match = path.match(/^\/admin\/routes\/(\d+)$/);
  if (method === "PUT" && match) {
    const idx = db.routes.findIndex((r) => r.id === Number(match[1]));
    if (idx === -1) throw new ApiError(`Route #${match[1]} not found`, 404);
    db.routes[idx] = { ...db.routes[idx], ...clone(body) };
    return envelope(clone(db.routes[idx]));
  }

  // DELETE /admin/routes/:id (soft delete)
  if (method === "DELETE" && path.match(/^\/admin\/routes\/(\d+)$/)) {
    const id = Number(path.match(/^\/admin\/routes\/(\d+)$/)[1]);
    const idx = db.routes.findIndex((r) => r.id === id);
    if (idx === -1) throw new ApiError(`Route #${id} not found`, 404);
    db.routes[idx].status = "inactive";
    return envelope({ id, status: "inactive" });
  }

  // GET /admin/enquiries?status=xxx
  if (method === "GET" && path === "/admin/enquiries") {
    let rows = clone(db.enquiries);
    if (params.status) {
      rows = rows.filter((e) => e.status === params.status);
    }
    rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return envelope(rows, { total: rows.length });
  }

  // PUT /admin/enquiries/:id/status
  match = path.match(/^\/admin\/enquiries\/(\d+)\/status$/);
  if (method === "PUT" && match) {
    const idx = db.enquiries.findIndex((e) => e.id === Number(match[1]));
    if (idx === -1) throw new ApiError(`Enquiry #${match[1]} not found`, 404);
    if (!body?.status) throw new ApiError("Status is required", 422);
    db.enquiries[idx].status = body.status;
    return envelope(clone(db.enquiries[idx]));
  }

  throw new ApiError(`No mock handler for ${method} ${path}`, 404);
}

/* ------------------------------------------------------------------ */
/*  Real transport — plain fetch() against the REST backend            */
/* ------------------------------------------------------------------ */
async function httpRequest(method, path, { params = {}, body, signal, headers: extraHeaders } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const headers = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
  };

  // Attach admin JWT token when hitting admin endpoints
  if (path.startsWith("/admin/") && path !== "/admin/login") {
    const token = getStoredToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Merge any extra headers
  if (extraHeaders) {
    Object.assign(headers, extraHeaders);
  }

  const response = await fetch(url.toString(), {
    method,
    signal,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = null;
  try {
    json = await response.json();
  } catch {
    /* non-JSON body */
  }

  if (!response.ok || json?.success === false) {
    throw new ApiError(json?.message || response.statusText || "Request failed", response.status, json);
  }
  return json;
}

/* ------------------------------------------------------------------ */
/*  Unified request → returns the unwrapped `data`                     */
/* ------------------------------------------------------------------ */
async function request(method, path, options = {}) {
  const transport = USE_MOCK_API ? mockRequest : httpRequest;
  const response = await transport(method, path, options);
  return response.data;
}

/* ------------------------------------------------------------------ */
/*  Public API — the only thing components should import               */
/* ------------------------------------------------------------------ */
export const getVehicles = (params = {}) => request("GET", "/vehicles", { params });
export const getVehicleBySlug = (slug) => request("GET", `/vehicles/${slug}`);

export const getRoutes = () => request("GET", "/routes");
export const getRouteBySlug = (slug) => request("GET", `/routes/${slug}`);

/** `routeSlug` defaults to "general" (site-wide FAQs). Pass a route slug for route-specific FAQs. */
export const getFAQs = ({ routeSlug = "general", limit } = {}) =>
  request("GET", "/faqs", { params: { routeSlug, limit } });

export const getTestimonials = ({ limit } = {}) =>
  request("GET", "/testimonials", { params: { limit } });

export const getServices = () => request("GET", "/services");
export const getCompanyStats = () => request("GET", "/stats");

export const submitBooking = (payload) => request("POST", "/bookings", { body: payload });

/* ------------------------------------------------------------------ */
/*  Admin API — authentication, vehicle/route/enquiry management       */
/* ------------------------------------------------------------------ */

/** Admin login — stores JWT token in localStorage on success */
export const adminLogin = async (username, password) => {
  const data = await request("POST", "/admin/login", { body: { username, password } });
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  } catch { /* storage full or private mode */ }
  return data;
};

/** Admin logout — clears stored token */
export const adminLogout = () => {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch { /* ignore */ }
};

/** Check if admin is authenticated */
export const isAdminAuthenticated = () => {
  const token = getStoredToken();
  return USE_MOCK_API ? isValidMockToken(token) : !!token;
};

/* -- Vehicle admin ops -- */
export const getAdminVehicles = () => request("GET", "/admin/vehicles");
export const createVehicle = (payload) => request("POST", "/admin/vehicles", { body: payload });
export const updateVehicle = (id, payload) => request("PUT", `/admin/vehicles/${id}`, { body: payload });
export const deleteVehicle = (id) => request("DELETE", `/admin/vehicles/${id}`);

/* -- Route admin ops -- */
export const getAdminRoutes = () => request("GET", "/admin/routes");
export const createRoute = (payload) => request("POST", "/admin/routes", { body: payload });
export const updateRoute = (id, payload) => request("PUT", `/admin/routes/${id}`, { body: payload });
export const deleteRoute = (id) => request("DELETE", `/admin/routes/${id}`);

/* -- Enquiry admin ops -- */
export const getEnquiries = (status) =>
  request("GET", "/admin/enquiries", { params: status ? { status } : {} });
export const updateEnquiryStatus = (id, status) =>
  request("PUT", `/admin/enquiries/${id}/status`, { body: { status } });

export const api = {
  getVehicles,
  getVehicleBySlug,
  getRoutes,
  getRouteBySlug,
  getFAQs,
  getTestimonials,
  getServices,
  getCompanyStats,
  submitBooking,
  adminLogin,
  adminLogout,
  isAdminAuthenticated,
  getAdminVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAdminRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getEnquiries,
  updateEnquiryStatus,
};

export default api;
