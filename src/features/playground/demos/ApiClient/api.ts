export const api = {
  async request(url: string, options: RequestInit = {}): Promise<unknown> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      }
    });

    if (!response.ok) {
      throw new Error(`Requeset failed: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  },

  get(url: string, options: RequestInit = {}) {
    return this.request(url, {
      method: "GET",
      ...options,
    });
  },

  post(url: string, body: unknown, options: RequestInit = {}) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  },

  patch(url: string, body: unknown, options: RequestInit = {}) {
    return this.request(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    });
  },

  put(url: string, body: unknown, options: RequestInit = {}) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  },

  delete(url: string, options: RequestInit = {}) {
    return this.request(url, {
      method: "DELETE",
      ...options,
    });
  },
}