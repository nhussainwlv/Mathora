function bindAuthForm(formId, handler) {
  const form = document.getElementById(formId);
  const messageEl = document.querySelector("[data-auth-message]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageEl.className = "message auth-message";
    try {
      const ok = await checkApiHealth();
      if (!ok) {
        messageEl.className = "message auth-message auth-message--error";
        messageEl.textContent =
          "API is offline. Run npm run dev:api in a terminal (project folder), wait for “Mathora API running on port 4000”, then try again.";
        return;
      }
      await handler(new FormData(form), messageEl);
    } catch (error) {
      messageEl.className = "message auth-message auth-message--error";
      messageEl.textContent = error instanceof Error ? error.message : "Request failed";
    }
  });
}

async function afterAuth(data, messageEl, redirect) {
  if (!data.accessToken || !data.user) {
    throw new Error("Sign in response was invalid. Is the API running?");
  }
  window.MathoraSession.setTokens(data.accessToken, data.refreshToken, data.user);
  await window.MathoraProgress.load();
  try {
    sessionStorage.setItem("mathora-prompt-install", "1");
  } catch {
    /* ignore */
  }
  messageEl.className = "message auth-message auth-message--ok";
  messageEl.textContent = "Signed in successfully. Redirecting…";
  setTimeout(() => {
    window.location.href = redirect;
  }, 400);
}

function initSignIn() {
  bindAuthForm("signin-form", async (formData, messageEl) => {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    if (!email.includes("@")) {
      throw new Error("Please enter a valid email address (e.g. you@school.com).");
    }
    const data = await apiFetch("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await afterAuth(data, messageEl, "/student/");
  });
}

function initSignUp() {
  bindAuthForm("signup-form", async (formData, messageEl) => {
    const email = String(formData.get("email") || "").trim();
    if (!email.includes("@")) {
      throw new Error("Please use a valid email address to create your account.");
    }
    const result = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        displayName: String(formData.get("displayName")),
        email,
        password: String(formData.get("password")),
      }),
    });
    messageEl.className = "message auth-message auth-message--ok";
    messageEl.textContent = "Account created. You can sign in now.";
    setTimeout(() => {
      window.location.href = "/auth/signin.html";
    }, 900);
  });
}

function initVerify() {
  bindAuthForm("verify-form", async (formData, messageEl) => {
    const result = await apiFetch("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token: String(formData.get("token")) }),
    });
    messageEl.textContent = result.message;
  });
}

function initReset() {
  bindAuthForm("reset-form", async (formData, messageEl) => {
    const result = await apiFetch("/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email: String(formData.get("email")) }),
    });
    messageEl.textContent = result.message;
  });
}

async function showApiBanner() {
  const banner = document.querySelector("[data-api-banner]");
  if (!banner) return;
  const ok = await checkApiHealth();
  if (ok) {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  banner.className = "api-banner api-banner--error";
  banner.innerHTML =
    "<strong>API not running.</strong> Sign-in needs the backend. In VS Code terminal run: <code>npm run dev:api</code> (keep it open), then refresh this page.";
}

document.addEventListener("DOMContentLoaded", () => {
  initSignIn();
  initSignUp();
  initVerify();
  initReset();
  showApiBanner();
});
