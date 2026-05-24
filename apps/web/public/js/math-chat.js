/**
 * Maths tutor chat — signed-in students. Supports typed questions and camera/OCR.
 */
(function () {
  const HISTORY_KEY = "mathora-chat-history";
  const TESSERACT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";

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

  function normalizeOcrText(text) {
    return String(text)
      .replace(/[−–—]/g, "-")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/²/g, "^2")
      .replace(/³/g, "^3")
      .replace(/√/g, "sqrt")
      .replace(/(\d)\s*[xX]\s*(\d)/g, "$1*$2")
      .replace(/(\d)\s*\(\s*/g, "$1(")
      .replace(/\s+/g, " ")
      .trim();
  }

  let tesseractPromise = null;

  function loadTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (!tesseractPromise) {
      tesseractPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = TESSERACT_URL;
        script.async = true;
        script.onload = () => {
          if (window.Tesseract) resolve(window.Tesseract);
          else reject(new Error("OCR library failed to load."));
        };
        script.onerror = () => reject(new Error("Could not load OCR. Check your connection."));
        document.head.appendChild(script);
      });
    }
    return tesseractPromise;
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
            <p class="message" style="margin:0.25rem 0 0;font-size:0.8rem;">Type or snap a photo of any maths question</p>
          </div>
          <button type="button" class="math-chat-close" id="math-chat-close" aria-label="Close chat">×</button>
        </header>
        <div class="math-chat-messages" id="math-chat-messages" role="log" aria-live="polite"></div>
        <form class="math-chat-form" id="math-chat-form">
          <div class="math-chat-preview" id="math-chat-preview" hidden>
            <img id="math-chat-preview-img" alt="Photo of your maths question" />
            <button type="button" class="math-chat-preview-clear" id="math-chat-preview-clear" aria-label="Remove photo">×</button>
          </div>
          <p class="math-chat-ocr-status" id="math-chat-ocr-status" hidden role="status"></p>
          <div class="math-chat-toolbar">
            <button type="button" class="btn btn-outline btn-sm math-chat-camera-btn" id="math-chat-camera-btn">
              <span aria-hidden="true">📷</span> Photo
            </button>
            <button type="button" class="btn btn-outline btn-sm math-chat-upload-btn" id="math-chat-gallery-btn">
              <span aria-hidden="true">🖼</span> Gallery
            </button>
            <input type="file" id="math-chat-camera-input" accept="image/*" capture="environment" hidden />
            <input type="file" id="math-chat-gallery-input" accept="image/*" hidden />
          </div>
          <textarea id="math-chat-input" rows="3" placeholder="Type a question, or use Photo to scan homework" maxlength="2000" required></textarea>
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
    const cameraBtn = root.querySelector("#math-chat-camera-btn");
    const cameraInput = root.querySelector("#math-chat-camera-input");
    const galleryInput = root.querySelector("#math-chat-gallery-input");
    const preview = root.querySelector("#math-chat-preview");
    const previewImg = root.querySelector("#math-chat-preview-img");
    const previewClear = root.querySelector("#math-chat-preview-clear");
    const ocrStatus = root.querySelector("#math-chat-ocr-status");

    let history = loadHistory();
    let chatOpen = false;
    let lastPhotoDataUrl = null;

    function setOcrStatus(text, isError = false) {
      if (!ocrStatus) return;
      if (!text) {
        ocrStatus.hidden = true;
        ocrStatus.textContent = "";
        ocrStatus.classList.remove("math-chat-ocr-status--error");
        return;
      }
      ocrStatus.hidden = false;
      ocrStatus.textContent = text;
      ocrStatus.classList.toggle("math-chat-ocr-status--error", isError);
    }

    function renderMessages() {
      if (!history.length) {
        messagesEl.innerHTML = `<p class="math-chat-welcome">Ask any UK maths question — or tap <strong>Photo</strong> to scan a question from your book or worksheet. I will read it and solve it step by step.</p>`;
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

    function clearPreview() {
      lastPhotoDataUrl = null;
      if (preview) preview.hidden = true;
      if (previewImg) previewImg.removeAttribute("src");
      if (cameraInput) cameraInput.value = "";
      if (galleryInput) galleryInput.value = "";
    }

    async function processImageFile(file) {
      if (!file || !file.type.startsWith("image/")) {
        setOcrStatus("Please choose a photo (JPG or PNG).", true);
        return;
      }

      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the image."));
        reader.readAsDataURL(file);
      });

      lastPhotoDataUrl = dataUrl;
      if (previewImg) previewImg.src = dataUrl;
      if (preview) preview.hidden = false;

      cameraBtn.disabled = true;
      setOcrStatus("Reading your question from the photo…");

      try {
        const Tesseract = await loadTesseract();
        const result = await Tesseract.recognize(dataUrl, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text" && typeof m.progress === "number") {
              setOcrStatus(`Reading photo… ${Math.round(m.progress * 100)}%`);
            }
          },
        });
        const raw = result?.data?.text ?? "";
        const cleaned = normalizeOcrText(raw);

        if (!cleaned || cleaned.length < 2) {
          setOcrStatus("Could not read text clearly. Try better light, hold steady, then type the question.", true);
          input.focus();
          return;
        }

        input.value = cleaned;
        setOcrStatus("Text found — check it below, edit if needed, then tap Send.");
        input.focus();
      } catch (err) {
        setOcrStatus(err.message || "Photo scan failed. You can still type the question.", true);
        input.focus();
      } finally {
        cameraBtn.disabled = false;
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

    cameraBtn.addEventListener("click", () => {
      cameraInput?.click();
    });

    root.querySelector("#math-chat-gallery-btn")?.addEventListener("click", () => {
      galleryInput?.click();
    });

    const onFileChosen = (input) => {
      const file = input.files?.[0];
      if (file) processImageFile(file);
    };

    cameraInput?.addEventListener("change", () => onFileChosen(cameraInput));
    galleryInput?.addEventListener("change", () => onFileChosen(galleryInput));

    previewClear?.addEventListener("click", () => {
      clearPreview();
      setOcrStatus("");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const userMessage = lastPhotoDataUrl
        ? `${text}\n\n(Scanned from a photo — edit if anything looks wrong.)`
        : text;

      history.push({ role: "user", content: userMessage });
      saveHistory(history);
      input.value = "";
      clearPreview();
      setOcrStatus("");
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
        const reply = data?.reply?.trim() || "I could not generate an answer. Please try again.";
        history.push({ role: "assistant", content: reply });
        saveHistory(history);
        renderMessages();
      } catch (err) {
        history.pop();
        saveHistory(history);
        let msg = err.message || "Could not reach the tutor.";
        if (msg === "Something went wrong") {
          msg = "The maths server had a problem. Check you are online, then try again.";
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
