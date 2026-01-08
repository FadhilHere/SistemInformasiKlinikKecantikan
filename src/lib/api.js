const ENV_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

const FALLBACK_API_BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : "http://localhost:8000";

const normalizeApiBaseUrl = (rawUrl) => {
  if (!rawUrl || typeof window === "undefined") return rawUrl;
  try {
    const url = new URL(rawUrl);
    const currentHost = window.location.hostname;
    const isLoopbackMismatch =
      (url.hostname === "127.0.0.1" && currentHost === "localhost") ||
      (url.hostname === "localhost" && currentHost === "127.0.0.1");

    if (isLoopbackMismatch) {
      url.hostname = currentHost;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return rawUrl;
  }
};

export const API_BASE_URL = normalizeApiBaseUrl(
  ENV_API_BASE_URL || FALLBACK_API_BASE_URL
);

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const defaultHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Accept: "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const status = response.status
      const message = data?.message || 'Something went wrong'
      const method = (options.method || 'GET').toUpperCase()
      const isAuthError = status === 401 || status === 403
      const shouldNotify =
        status >= 500 || (isAuthError && method === 'GET')

      if (
        typeof window !== 'undefined' &&
        shouldNotify &&
        endpoint !== '/api/login'
      ) {
        window.dispatchEvent(
          new CustomEvent('api:error', {
            detail: { status, message, endpoint }
          })
        )
      }

      // Create an error object that contains the response data
      const error = new Error(message)
      error.data = data
      error.status = status
      throw error
    }

    return data;
  } catch (error) {
    // Re-throw the error so the calling component can handle it
    throw error;
  }
};
