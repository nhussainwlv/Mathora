(function () {
  const DISMISS_KEY = "mathora-install-dismissed";
  const DISMISS_DAYS = 14;
  const PROMPT_AFTER_SIGNIN = "mathora-prompt-install";

  let deferredPrompt = null;

  function isInstalled() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function isAndroid() {
    return /android/i.test(navigator.userAgent);
  }

  function isDismissed() {
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (!raw) return false;
      const dismissedAt = Number(raw);
      if (!Number.isFinite(dismissedAt)) return true;
      return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }

  function dismissPrompt() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    hideModal();
  }

  function canOfferInstall() {
    return !isInstalled() && !isDismissed();
  }

  function shouldPromptAfterSignIn() {
    try {
      return sessionStorage.getItem(PROMPT_AFTER_SIGNIN) === "1";
    } catch {
      return false;
    }
  }

  function clearPromptAfterSignIn() {
    try {
      sessionStorage.removeItem(PROMPT_AFTER_SIGNIN);
    } catch {
      /* ignore */
    }
  }

  function iosInstructionsHtml() {
    return `
      <ol class="install-ios-steps">
        <li>Tap the <strong>Share</strong> button in Safari (square with arrow)</li>
        <li>Scroll and tap <strong>Add to Home Screen</strong></li>
        <li>Tap <strong>Add</strong> — Mathora appears on your home screen</li>
      </ol>
    `;
  }

  function chromeManualHtml() {
    return `
      <ol class="install-ios-steps">
        <li>Look for the <strong>install</strong> icon in the address bar (⊕ or computer with arrow)</li>
        <li>Or open the browser <strong>menu</strong> (⋮) → <strong>Install Mathora</strong> / <strong>Save and share</strong> → Install</li>
        <li>Confirm — the app opens from your home screen or apps list</li>
      </ol>
    `;
  }

  function mountModal() {
    if (document.getElementById("mathora-install-modal")) return document.getElementById("mathora-install-modal");

    const root = document.createElement("div");
    root.id = "mathora-install-modal";
    root.className = "install-modal";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "install-modal-title");

    root.innerHTML = `
      <div class="install-modal-backdrop" data-install-close></div>
      <div class="install-modal-panel">
        <button type="button" class="install-modal-close" data-install-close aria-label="Close">×</button>
        <div class="install-modal-icon" aria-hidden="true">
          <img src="/icons/icon-192.png" width="56" height="56" alt="" />
        </div>
        <h2 id="install-modal-title" class="install-modal-title" data-install-title>Install Mathora</h2>
        <p class="install-modal-text" data-install-body>
          Add Mathora to your home screen for one-tap access and offline study.
        </p>
        <div data-install-ios hidden>${iosInstructionsHtml()}</div>
        <div data-install-manual hidden>${chromeManualHtml()}</div>
        <p class="install-modal-status" data-install-status hidden role="status"></p>
        <div class="install-modal-actions">
          <button type="button" class="btn btn-primary" data-install-confirm>Install app</button>
          <button type="button" class="btn btn-outline" data-install-dismiss>Not now</button>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    root.querySelectorAll("[data-install-close]").forEach((el) => {
      el.addEventListener("click", dismissPrompt);
    });
    root.querySelector("[data-install-dismiss]")?.addEventListener("click", dismissPrompt);

    root.querySelector("[data-install-confirm]")?.addEventListener("click", () => {
      promptInstall();
    });

    return root;
  }

  function setInstallStatus(modal, text) {
    const el = modal.querySelector("[data-install-status]");
    if (!el) return;
    if (!text) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = text;
  }

  function showModal(options = {}) {
    if (isInstalled()) return;
    const modal = mountModal();
    const iosBlock = modal.querySelector("[data-install-ios]");
    const manualBlock = modal.querySelector("[data-install-manual]");
    const body = modal.querySelector("[data-install-body]");
    const title = modal.querySelector("[data-install-title]");
    const confirmBtn = modal.querySelector("[data-install-confirm]");
    const useIos = isIos();
    const useManual = !useIos && !deferredPrompt;

    setInstallStatus(modal, "");

    if (title) {
      title.textContent =
        options.title || (useIos ? "Add to your home screen" : "Install Mathora");
    }
    if (iosBlock) iosBlock.hidden = !useIos;
    if (manualBlock) manualBlock.hidden = !useManual;
    if (body) {
      body.textContent =
        options.body ||
        (useIos
          ? "In Safari, use Share → Add to Home Screen:"
          : useManual
            ? "Your browser has not shown the install prompt yet. Try one of these:"
            : "Tap Install app below — your browser will add Mathora to your home screen or app list.");
    }
    if (confirmBtn) {
      confirmBtn.textContent = useIos ? "Got it" : "Install app";
      confirmBtn.disabled = false;
    }

    modal.hidden = false;
    document.body.classList.add("install-modal-open");
    confirmBtn?.focus();
  }

  function hideModal() {
    const modal = document.getElementById("mathora-install-modal");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("install-modal-open");
  }

  async function promptInstall() {
    if (isInstalled()) {
      hideModal();
      return { ok: true, outcome: "already-installed" };
    }

    if (isIos()) {
      showModal({
        title: "Add to your home screen",
        body: "Safari does not allow one-tap install. Follow these steps:",
      });
      return { ok: false, outcome: "ios-manual" };
    }

    if (deferredPrompt) {
      const modal = mountModal();
      const confirmBtn = modal.querySelector("[data-install-confirm]");
      if (confirmBtn) confirmBtn.disabled = true;
      setInstallStatus(modal, "Waiting for your confirmation in the browser dialog…");

      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        setInstallStatus(modal, "");
        if (confirmBtn) confirmBtn.disabled = false;

        if (outcome === "accepted") {
          hideModal();
          updateInstallButtons();
          return { ok: true, outcome: "accepted" };
        }

        setInstallStatus(modal, "Install cancelled. You can try again or use the menu → Install Mathora.");
        return { ok: false, outcome: "dismissed" };
      } catch (err) {
        console.warn("Install prompt failed:", err);
        deferredPrompt = null;
        if (confirmBtn) confirmBtn.disabled = false;
        showModal({
          title: "Install from the browser menu",
          body: "The install dialog could not open. Use the steps below:",
        });
        return { ok: false, outcome: "error" };
      }
    }

    showModal({
      title: "Install from your browser",
      body: "Use the install icon in the address bar, or the browser menu:",
    });
    return { ok: false, outcome: "manual" };
  }

  function updateInstallButtons() {
    const show = canOfferInstall() && (deferredPrompt || isIos() || isAndroid());
    document.querySelectorAll("[data-install-app]").forEach((btn) => {
      btn.hidden = !show;
    });
  }

  function maybeShowInstallPrompt(delayMs = 2500) {
    if (!canOfferInstall()) return;
    if (deferredPrompt || isIos()) {
      window.setTimeout(() => showModal(), delayMs);
    }
  }

  function showInstallAfterSignIn() {
    if (isInstalled()) {
      clearPromptAfterSignIn();
      return;
    }
    clearPromptAfterSignIn();
    window.setTimeout(
      () =>
        showModal({
          title: "Install the app if you fancy",
          body: "Add Mathora to your home screen for one-tap access — and keep studying when you go offline.",
        }),
      800,
    );
  }

  /* —— Offline status toast —— */
  function mountOfflineToast() {
    if (document.getElementById("mathora-offline-toast")) return;

    const el = document.createElement("div");
    el.id = "mathora-offline-toast";
    el.className = "status-toast";
    el.hidden = true;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML = `
      <span class="status-toast-icon" data-status-icon aria-hidden="true"></span>
      <div class="status-toast-body">
        <strong class="status-toast-title" data-status-title></strong>
        <p class="status-toast-text" data-status-text></p>
      </div>
      <button type="button" class="status-toast-close" data-status-close aria-label="Dismiss">×</button>
    `;
    document.body.appendChild(el);

    el.querySelector("[data-status-close]")?.addEventListener("click", () => {
      el.hidden = true;
    });
  }

  function showStatusToast({ variant, title, text, autoHideMs }) {
    mountOfflineToast();
    const el = document.getElementById("mathora-offline-toast");
    if (!el) return;

    el.classList.remove("status-toast--offline", "status-toast--online");
    el.classList.add(variant === "online" ? "status-toast--online" : "status-toast--offline");

    const icon = el.querySelector("[data-status-icon]");
    if (icon) icon.textContent = variant === "online" ? "✓" : "◎";

    const titleEl = el.querySelector("[data-status-title]");
    const textEl = el.querySelector("[data-status-text]");
    if (titleEl) titleEl.textContent = title;
    if (textEl) textEl.textContent = text;

    el.hidden = false;

    if (autoHideMs) {
      window.clearTimeout(showStatusToast._timer);
      showStatusToast._timer = window.setTimeout(() => {
        el.hidden = true;
      }, autoHideMs);
    }
  }

  function initOfflineStatus() {
    mountOfflineToast();

    const showOffline = () => {
      showStatusToast({
        variant: "offline",
        title: "You are offline",
        text: "This app works offline too — keep studying! Your progress syncs when you are back online.",
      });
    };

    const showOnline = () => {
      showStatusToast({
        variant: "online",
        title: "Back online",
        text: "Connection restored. Your progress will sync automatically.",
        autoHideMs: 4500,
      });
    };

    window.addEventListener("offline", showOffline);
    window.addEventListener("online", showOnline);

    if (!navigator.onLine) {
      window.setTimeout(showOffline, 1200);
    }
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    updateInstallButtons();
    if (!shouldPromptAfterSignIn()) maybeShowInstallPrompt();
  });

  window.MathoraInstall = {
    show: (options) => {
      if (!isInstalled()) showModal(options);
    },
    promptInstall,
    dismiss: dismissPrompt,
    canInstall: () => canOfferInstall(),
    isInstalled,
  };

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initOfflineStatus();
    updateInstallButtons();

    document.querySelectorAll("[data-install-app]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        promptInstall();
      });
    });

    if (shouldPromptAfterSignIn()) {
      showInstallAfterSignIn();
      return;
    }

    if (canOfferInstall() && isIos()) {
      maybeShowInstallPrompt();
    }
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    hideModal();
    updateInstallButtons();
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  });
})();
