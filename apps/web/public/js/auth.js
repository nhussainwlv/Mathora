function bindAuthForm(formId, handler) {
  const form = document.getElementById(formId);
  const messageEl = document.querySelector("[data-auth-message]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await handler(new FormData(form), messageEl);
    } catch (error) {
      messageEl.textContent = error instanceof Error ? error.message : "Request failed";
    }
  });
}

function initSignIn() {
  bindAuthForm("signin-form", async (formData, messageEl) => {
    const data = await apiFetch("/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      }),
    });
    window.MathoraSession.setTokens(data.accessToken, data.refreshToken);
    messageEl.textContent = "Signed in successfully. Redirecting to student dashboard...";
    setTimeout(() => {
      window.location.href = "/student/";
    }, 400);
  });
}

function initSignUp() {
  bindAuthForm("signup-form", async (formData, messageEl) => {
    const result = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        displayName: String(formData.get("displayName")),
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        role: String(formData.get("role")),
      }),
    });
    messageEl.textContent = `Account created. Dev verification token: ${result.verificationTokenForDev}`;
    setTimeout(() => {
      window.location.href = "/auth/verify.html";
    }, 500);
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

document.addEventListener("DOMContentLoaded", () => {
  initSignIn();
  initSignUp();
  initVerify();
  initReset();
});
