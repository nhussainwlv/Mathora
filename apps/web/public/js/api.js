function getDemoResponse(path) {
  if (path === "/auth/signin") {
    return {
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      user: {
        id: "demo",
        email: "demo@mathora.academy",
        role: "STUDENT",
        profile: { displayName: "Demo Student", xp: 0, coins: 0, level: 1 },
      },
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
  if (path === "/auth/me") {
    return window.MathoraSession.user ?? { message: "Not signed in" };
  }
  if (path.startsWith("/games/")) {
    return { solvedKeys: [], profile: { xp: 0, coins: 0, level: 1 }, stats: {} };
  }
  if (path === "/ai/chat") {
    const body = init?.body ? JSON.parse(init.body) : {};
    const q = String(body.message ?? "").trim();
    const solve3x = /3\s*\*?\s*x\s*=\s*20/i.test(q);
    const solve35 = /3\s*\*?\s*x\s*\+\s*5\s*=\s*20/i.test(q);
    if (solve35) {
      return {
        reply:
          "Linear equation\n\n1. Start with: 3x + 5 = 20\n2. Subtract 5: 3x = 15\n3. Divide by 3: x = 5",
        provider: "builtin",
      };
    }
    if (solve3x) {
      return {
        reply:
          "Linear equation\n\n1. Start with: 3x = 20\n2. Divide both sides by 3: x = 6.666667 (or 6⅔)",
        provider: "builtin",
      };
    }
    return {
      reply: `Demo mode: I received "${q.slice(0, 120)}". Run npm run dev:api for the full maths tutor.`,
      provider: "builtin",
    };
  }
  return null;
}

function parseApiError(body, status) {
  try {
    const json = JSON.parse(body);
    if (json.message) return json.message;
    if (json.issues?.[0]?.message) return json.issues[0].message;
  } catch {
    /* plain text */
  }
  return body || `Request failed (${status})`;
}

function networkErrorMessage() {
  const url = window.MATHORA_CONFIG?.API_URL ?? "http://localhost:4000/api";
  return (
    `Cannot reach the Mathora API at ${url}. ` +
    "Open a second terminal in the project folder and run: npm run dev:api — then try again."
  );
}

async function apiFetch(path, init = {}) {
  const { API_URL, DEMO_MODE } = window.MATHORA_CONFIG;
  const headers = {
    "Content-Type": "application/json",
    ...(init.headers ?? {}),
  };

  const token = window.MathoraSession?.getAccessToken?.();
  if (token) headers.Authorization = `Bearer ${token}`;

  const doFetch = async () =>
    fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });

  let response;

  try {
    response = await doFetch();
  } catch (error) {
    if (DEMO_MODE) {
      const demoData = getDemoResponse(path);
      if (demoData) return demoData;
    }
    throw new Error(networkErrorMessage());
  }

  if (response.status === 401 && window.MathoraSession?.refreshToken) {
    try {
      const refreshed = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: window.MathoraSession.refreshToken }),
      });
      if (refreshed.ok) {
        const tokens = await refreshed.json();
        window.MathoraSession.setTokens(tokens.accessToken, tokens.refreshToken);
        headers.Authorization = `Bearer ${tokens.accessToken}`;
        response = await doFetch();
      }
    } catch {
      /* continue with original 401 */
    }
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(parseApiError(body, response.status));
  }

  return response.json();
}

async function checkApiHealth() {
  const base = window.MATHORA_CONFIG.API_URL.replace(/\/api\/?$/, "");
  try {
    const res = await fetch(`${base}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

window.apiFetch = apiFetch;
window.checkApiHealth = checkApiHealth;
