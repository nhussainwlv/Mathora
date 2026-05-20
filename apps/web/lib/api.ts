const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

type DemoSignInResponse = {
  accessToken: string;
  refreshToken: string;
};

type DemoSignUpResponse = {
  verificationTokenForDev: string;
};

function getDemoResponse<T>(path: string): T | null {
  if (path === "/auth/signin") {
    const payload: DemoSignInResponse = {
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
    };
    return payload as T;
  }

  if (path === "/auth/signup") {
    const payload: DemoSignUpResponse = {
      verificationTokenForDev: "demo-verification-token",
    };
    return payload as T;
  }

  if (path === "/auth/password-reset/request") {
    return { message: "Demo reset link sent." } as T;
  }

  if (path === "/auth/verify-email") {
    return { message: "Demo email verified." } as T;
  }

  return null;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || `API request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (DEMO_MODE) {
      const demoData = getDemoResponse<T>(path);
      if (demoData) return demoData;
    }
    throw error;
  }
}
