const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type LoginDto = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

function buildUrl(path: string): string {
  if (API_BASE_URL) {
    return new URL(path, API_BASE_URL).toString();
  }
  return path;
}

async function login(dto: LoginDto, options?: { signal?: AbortSignal }): Promise<void> {
  const response = await fetch(buildUrl("/api/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      email: dto.email,
      password: dto.password,
      rememberMe: !!dto.rememberMe
    }),
    signal: options?.signal
  });
  if (!response.ok) {
    let message = "Login failed";
    try {
      const data = await response.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        message = data.error;
      }
    } catch {
      // ignore parse errors
    }
    if (response.status === 401) {
      message = "Email or password is incorrect.";
    } else if (response.status === 404) {
      message = "Login service not found. Please restart the backend.";
    }
    throw new Error(message);
  }
}

async function logout(options?: { signal?: AbortSignal }): Promise<void> {
  const response = await fetch(buildUrl("/api/auth/logout"), {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    credentials: "include",
    signal: options?.signal
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Logout failed: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`
    );
  }
}

async function changePassword(
  dto: { currentPassword: string; newPassword: string },
  options?: { signal?: AbortSignal }
): Promise<void> {
  const response = await fetch(buildUrl("/api/auth/change-password"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(dto),
    signal: options?.signal
  });

  if (!response.ok) {
    let message = "Failed to change password";
    try {
      const data = await response.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        message = data.error;
      }
      if (Array.isArray(data?.details) && data.details.length > 0) {
        const first = data.details[0];
        if (typeof first?.Description === "string" && first.Description.trim().length > 0) {
          message = first.Description;
        } else if (typeof first?.description === "string" && first.description.trim().length > 0) {
          message = first.description;
        }
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
}

export type MeResponse = {
  authenticated: boolean;
  name?: string;
  fullName?: string;
  userId?: number;
  claims?: Array<{ Type: string; Value: string }>;
};

async function me(options?: { signal?: AbortSignal }): Promise<MeResponse> {
  const response = await fetch(buildUrl("/api/auth/me"), {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });
  if (!response.ok) {
    // treat as unauthenticated on failure
    return { authenticated: false };
  }
  return (await response.json()) as MeResponse;
}

export const AuthService = { login, logout, me };
export const PasswordService = { changePassword };
