export const api = {
  async request<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  },

  get<T = unknown>(url: string, options: RequestInit = {}) {
    return this.request<T>(url, {
      method: "GET",
      ...options,
    });
  },

  post<T = unknown, B = unknown>(url: string, body: B, options: RequestInit = {}) {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  },

  patch<T = unknown>(url: string, body: unknown, options: RequestInit = {}) {
    return this.request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    });
  },

  put<T = unknown>(url: string, body: unknown, options: RequestInit = {}) {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  },

  delete<T = unknown>(url: string, options: RequestInit = {}) {
    return this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  },
}