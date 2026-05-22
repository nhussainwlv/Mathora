function getDemoResponse(path) {
  if (path === "/auth/signin") {
    return {
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
    };
  }

  if (path === "/auth/signup") {
    return { verificationTokenForDev: "demo-verification-token" };
  }

  if (path === "/auth/password-reset/request") {
    return { message: "Demo reset link sent." };
  }

  if (path === "/auth/verify-email") {
    return { message: "Demo email verified." };
  }

  return null;
}

async function apiFetch(path, init) {
  const { API_URL, DEMO_MODE } = window.MATHORA_CONFIG;

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

    return await response.json();
  } catch (error) {
    if (DEMO_MODE) {
      const demoData = getDemoResponse(path);
      if (demoData) return demoData;
    }
    throw error;
  }
}

window.apiFetch = apiFetch;
