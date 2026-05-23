async function bootstrapMathora() {
  if (!window.MathoraSession?.accessToken) return;
  try {
    const me = await apiFetch("/auth/me");
    window.MathoraSession.user = me;
    window.MathoraSession.save();
    await window.MathoraProgress.load();
    document.dispatchEvent(new CustomEvent("mathora:session-changed"));
  } catch {
    window.MathoraSession.clear();
    document.dispatchEvent(new CustomEvent("mathora:session-changed"));
  }
}

document.addEventListener("DOMContentLoaded", bootstrapMathora);
