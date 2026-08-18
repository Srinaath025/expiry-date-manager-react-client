const API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${API_URL}/auth`;

export async function loginUser({ email, password }) {
  let response;
  try {
    response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('Backend server is unreachable. Please ensure the Express server is running on port 5001.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.map((e) => e.msg).join(', ') : null);
    throw new Error(errorMsg || `Server error (${response.status}).`);
  }

  return data;
}

export async function registerUser({ name, email, password }) {
  let response;
  try {
    response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
  } catch {
    throw new Error('Backend server is unreachable. Please ensure the Express server is running on port 5001.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.map((e) => e.msg).join(', ') : null);
    throw new Error(errorMsg || `Server error (${response.status}).`);
  }

  return data;
}

/**
 * Calls POST /auth/logout to clear the server-side JWT cookie.
 */
export async function logoutUser() {
  try {
    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Swallow network errors – we still want the client to clear state
  }
}

/**
 * Calls GET /auth/me to restore session from the existing JWT cookie.
 * Returns the user object on success, or null if not authenticated.
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) return null;

    const data = await response.json().catch(() => null);
    return data?.user || null;
  } catch {
    return null;
  }
}

// ─── Product API Functions ───────────────────────────────────────────────

const PRODUCTS_BASE = `${API_URL}/products`;

export async function getProducts({ page = 1, limit = 20, search = '', category = 'all', status = 'all' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    category,
    status
  });

  try {
    const response = await fetch(`${PRODUCTS_BASE}?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || `Server error (${response.status}) while loading products.`);
    }
    return data; // { products, total, page, limit, stats }
  } catch (err) {
    throw new Error(err.message || 'Network error fetching products.');
  }
}

export async function createProduct(productData) {
  try {
    const response = await fetch(PRODUCTS_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productData),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const errorMsg = data?.message || (Array.isArray(data?.errors) ? data.errors.map((e) => e.msg).join(', ') : null);
      throw new Error(errorMsg || `Server error (${response.status}) adding product.`);
    }
    return data;
  } catch (err) {
    throw new Error(err.message || 'Network error creating product.');
  }
}

export async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${PRODUCTS_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productData),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const errorMsg = data?.message || (Array.isArray(data?.errors) ? data.errors.map((e) => e.msg).join(', ') : null);
      throw new Error(errorMsg || `Server error (${response.status}) updating product.`);
    }
    return data;
  } catch (err) {
    throw new Error(err.message || 'Network error updating product.');
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${PRODUCTS_BASE}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || `Server error (${response.status}) deleting product.`);
    }
    return data;
  } catch (err) {
    throw new Error(err.message || 'Network error deleting product.');
  }
}
