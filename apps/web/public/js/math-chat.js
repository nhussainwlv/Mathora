/**
 * Maths AI chat — visible only when signed in.
 */
(function () {
  const HISTORY_KEY = "mathora-chat-history";

  function isSignedIn() {
    return Boolean(window.MathoraSession?.accessToken);
  }

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveHistory(messages) {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-20)));
  }

  function esc(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatReply(text) {
    return esc(text).replace(/\n/g, "<br>");
  }

  function mountChat() {
    if (document.getElementById("mathora-chat-root")) return;

    const root = document.createElement("div");
    root.id = "mathora-chat-root";
    root.hidden = true;
    root.innerHTML = `
      <button type="button" class="math-chat-fab" id="math-chat-toggle" aria-expanded="false" aria-controls="math-chat-panel" aria-haspopup="dialog">
        <span class="math-chat-fab-icon" aria-hidden="true">✦</span>
        <span class="math-chat-fab-label">Maths tutor</span>
      </button>
      <div class="math-chat-panel" id="math-chat-panel" hidden aria-hidden="true">
        <header class="math-chat-header">
          <div>
            <strong>Mathora tutor</strong>
            <p class="message" style="margin:0.25rem 0 0;font-size:0.8rem;">Built-in solver — algebra, %, geometry, trig & more</p>
          </div>
          <button type="button" class="math-chat-close" id="math-chat-close" aria-label="Close chat">×</button>
        </header>
        <div class="math-chat-messages" id="math-chat-messages" role="log" aria-live="polite"></div>
        <form class="math-chat-form" id="math-chat-form">
          <textarea id="math-chat-input" rows="2" placeholder="e.g. x2+5x+6=0 (x²) · (2x-2)(3x2-2)=100 · 2x+y=23" maxlength="2000" required></textarea>
          <button type="submit" class="btn btn-primary btn-sm" id="math-chat-send">Send</button>
        </form>
      </div>
    `;
    document.body.appendChild(root);

    const toggle = root.querySelector("#math-chat-toggle");
    const panel = root.querySelector("#math-chat-panel");
    const closeBtn = root.querySelector("#math-chat-close");
    const form = root.querySelector("#math-chat-form");
    const input = root.querySelector("#math-chat-input");
    const messagesEl = root.querySelector("#math-chat-messages");
    const sendBtn = root.querySelector("#math-chat-send");

    let history = loadHistory();
    let chatOpen = false;

    function renderMessages() {
      if (!history.length) {
        messagesEl.innerHTML = `<p class="math-chat-welcome">Hi! Ask any UK maths question — equations, percentages, geometry, ratios, or word problems. I will show full working and the answer.</p>`;
        return;
      }
      messagesEl.innerHTML = history
        .map(
          (m) =>
            `<div class="math-chat-bubble math-chat-bubble-${m.role}">${formatReply(m.content)}</div>`,
        )
        .join("");
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function setOpen(open) {
      chatOpen = open;
      panel.hidden = !open;
      panel.setAttribute("aria-hidden", String(!open));
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        renderMessages();
        input.focus();
      }
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!chatOpen);
    });
    closeBtn.addEventListener("click", () => setOpen(false));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && chatOpen) setOpen(false);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      history.push({ role: "user", content: text });
      saveHistory(history);
      input.value = "";
      renderMessages();
      sendBtn.disabled = true;
      sendBtn.textContent = "Thinking…";

      try {
        const data = await apiFetch("/ai/chat", {
          method: "POST",
          body: JSON.stringify({
            message: text,
            history: history.slice(0, -1),
          }),
        });
        const reply =
          data?.reply?.trim() ||
          "I could not generate an answer. Please try again.";
        history.push({ role: "assistant", content: reply });
        saveHistory(history);
        renderMessages();
      } catch (err) {
        history.pop();
        saveHistory(history);
        let msg = err.message || "Could not reach the tutor.";
        if (msg === "Something went wrong") {
          msg =
            "The maths server had a problem. Restart it with: npm run dev:api (or npm run dev:all), then try again.";
        }
        history.push({ role: "assistant", content: msg });
        saveHistory(history);
        renderMessages();
      } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";
      }
    });

    setOpen(false);
    return root;
  }

  function updateVisibility() {
    const root = document.getElementById("mathora-chat-root") || mountChat();
    const signedIn = isSignedIn();
    root.hidden = !signedIn;
    if (!signedIn) {
      const panel = root.querySelector("#math-chat-panel");
      panel?.classList.remove("is-open");
      if (panel) panel.hidden = true;
    }
  }

  window.MathoraMathChat = { init: updateVisibility, isSignedIn };

  document.addEventListener("DOMContentLoaded", () => {
    mountChat();
    updateVisibility();
    document.addEventListener("mathora:session-changed", updateVisibility);
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "mathora-session") updateVisibility();
  });
})();
