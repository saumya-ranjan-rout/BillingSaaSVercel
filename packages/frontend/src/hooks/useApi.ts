import { useState, useCallback } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  get: (url: string) => Promise<T>;
  post: (url: string, body: any) => Promise<T>;
  put: (url: string, body: any) => Promise<T>;
  patch: (url: string, body: any) => Promise<T>;
  del: (url: string) => Promise<T>;
  getBlob: (url: string) => Promise<Blob>;
}

export const useApi = <T>(): UseApiReturn<T> => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.17:3001";

  // console.log("API_BASE", API_BASE);

  const request = useCallback(async (url: string, options?: RequestInit) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE}${url}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (Array.isArray(errorData.errors)) errorMessage = errorData.errors.join(", ");
          else if (errorData.error) errorMessage = errorData.error;
          else if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(errorMessage);
      }

      let data: any = null;
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      setState({ data, loading: false, error: null });
      return data as T;
    } catch (err: any) {
      const errorMessage = err?.message || (typeof err === "string" ? err : "An unknown error occurred");
      setState({ data: null, loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  const get = useCallback((url: string) => request(url, { method: "GET" }), [request]);
  const post = useCallback((url: string, body: any) => request(url, { method: "POST", body: JSON.stringify(body) }), [request]);
  const put = useCallback((url: string, body: any) => request(url, { method: "PUT", body: JSON.stringify(body) }), [request]);
  const patch = useCallback((url: string, body: any) => request(url, { method: "PATCH", body: JSON.stringify(body) }), [request]);
  const del = useCallback((url: string) => request(url, { method: "DELETE" }), [request]);

  const getBlob = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("authToken");
    const tenantStr = localStorage.getItem("currentTenant");
    let tenant: string | null = null;

    try {
      if (tenantStr) {
        const parsed = JSON.parse(tenantStr);
        tenant = parsed.subdomain || parsed.id || null;
      }
    } catch (e) {
      console.error("Failed to parse tenant:", e);
    }

    const response = await fetch(`${API_BASE}${url}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(tenant ? { "X-Tenant-Subdomain": tenant } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
        else if (errorData.message) errorMessage = errorData.message;
      } catch {}
      throw new Error(errorMessage);
    }

    return await response.blob();
  };

  return {
    ...state,
    get,
    post,
    put,
    patch, // ✅ Added patch here
    del,
    getBlob,
  };
};
