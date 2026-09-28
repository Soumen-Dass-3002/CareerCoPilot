interface User {
  id: string;
  name: string;
  email: string;
  profile: {
    name: string;
    email: string;
    interests: string[];
    skills: string[];
    location?: string;
  };
}

interface AuthResponse {
  token: string;
  user: User;
}

const tokenKey = "cc-auth-token";
const userKey = "cc-auth-user";

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem(tokenKey);
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Request failed.");
  }
  return body as T;
};

export const authService = {
  signup: async (input: any): Promise<User> => {
    const result = await request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
    localStorage.setItem(tokenKey, result.token);
    localStorage.setItem(userKey, JSON.stringify(result.user));
    return result.user;
  },

  login: async (input: any): Promise<User> => {
    const result = await request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
    localStorage.setItem(tokenKey, result.token);
    localStorage.setItem(userKey, JSON.stringify(result.user));
    return result.user;
  },

  logout: (): void => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  },

  user: (): User | null => {
    try {
      return JSON.parse(localStorage.getItem(userKey) || "null");
    } catch {
      return null;
    }
  },

  updateProfile: async (profile: any): Promise<User> => {
    const result = await request<AuthResponse>("/api/me/profile", {
      method: "PUT",
      body: JSON.stringify({ profile }),
    });
    localStorage.setItem(userKey, JSON.stringify(result.user));
    return result.user;
  },
};
