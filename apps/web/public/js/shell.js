const NAV_ITEMS = [
  { href: "/student/", label: "Dashboard" },
  { href: "/student/learn.html", label: "Learn" },
  { href: "/student/flashcards.html", label: "Flashcards" },
  { href: "/student/games.html", label: "Games" },
];

function isActive(pathname, href) {
  if (href.endsWith("/") && href !== "/") {
    return pathname === href || pathname === href.replace(/\/$/, "/index.html");
  }
  return pathname.endsWith(href.replace(/^\//, "")) || pathname === href;
}

function renderAuthBar() {
  const signedIn = window.MathoraProgress?.isSignedIn?.();
  const name = window.MathoraSession?.user?.profile?.displayName ?? window.MathoraSession?.user?.email;
  if (signedIn) {
    return `
      <span class="auth-pill">${name}</span>
      <button type="button" class="btn btn-outline btn-sm" id="auth-signout">Sign out</button>
    `;
  }
  return `
    <a class="btn btn-outline btn-sm" href="/auth/signin.html">Sign in</a>
    <a class="btn btn-primary btn-sm" href="/auth/signup.html">Sign up</a>
  `;
}

function initShell() {
  const content = document.getElementById("page-content");
  if (!content) return;

  const pathname = window.location.pathname;
  const activePath = window.MATHORA_ACTIVE || pathname;

  const navHtml = NAV_ITEMS.map((item) => {
    const active = isActive(activePath, item.href) || isActive(pathname, item.href);
    return `<a class="nav-link${active ? " active" : ""}" href="${item.href}">${item.label}</a>`;
  }).join("");

  const layout = document.createElement("div");
  layout.className = "app-layout";
  layout.innerHTML = `
    <div class="app-inner">
      <aside class="sidebar">
        <a href="/student/" class="sidebar-brand" title="Home">Mathora</a>
        <p class="sidebar-tagline">Practice. Progress. Confidence.</p>
        <nav class="nav-list" aria-label="Main">${navHtml}</nav>
      </aside>
      <div class="app-main">
        <header class="app-header">
          <div class="header-left">
            <button type="button" class="menu-btn" id="menu-toggle" aria-expanded="false">Menu</button>
            <a href="/student/" class="header-brand" title="Home">Mathora</a>
          </div>
          <div class="header-right">
            <button type="button" class="btn btn-outline btn-sm" data-install-app hidden>Install app</button>
            <div class="header-auth">${renderAuthBar()}</div>
            <button type="button" class="theme-toggle" onclick="toggleTheme()" data-theme-label>Dark mode</button>
          </div>
        </header>
        <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">${navHtml}</nav>
        <div class="page-content" id="shell-main"></div>
      </div>
    </div>
  `;

  const main = layout.querySelector("#shell-main");
  while (content.firstChild) {
    main.appendChild(content.firstChild);
  }
  content.remove();
  document.body.prepend(layout);

  bindSignOut();
  refreshAuthBar();
  document.addEventListener("mathora:session-changed", refreshAuthBar);

  const menuBtn = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  menuBtn?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  const dark = document.documentElement.classList.contains("dark");
  document.querySelectorAll("[data-theme-label]").forEach((el) => {
    el.textContent = dark ? "Light mode" : "Dark mode";
  });
}

function refreshAuthBar() {
  const el = document.querySelector(".header-auth");
  if (!el) return;
  el.innerHTML = renderAuthBar();
  bindSignOut();
}

function bindSignOut() {
  document.getElementById("auth-signout")?.addEventListener("click", async () => {
    const btn = document.getElementById("auth-signout");
    if (btn) btn.disabled = true;
    try {
      if (window.MathoraSession.refreshToken) {
        await apiFetch("/auth/signout", {
          method: "POST",
          body: JSON.stringify({ refreshToken: window.MathoraSession.refreshToken }),
        });
      }
    } catch {
      /* still sign out locally if API is offline */
    }
    window.MathoraSession.clear();
    if (window.MathoraProgress) {
      window.MathoraProgress.solvedKeys = new Set();
      window.MathoraProgress.profile = null;
    }
    document.dispatchEvent(new CustomEvent("mathora:session-changed"));
    window.location.href = "/";
  });
}

function bootShell() {
  initShell();
  document.dispatchEvent(new CustomEvent("mathora:shell-ready"));
}

document.addEventListener("DOMContentLoaded", bootShell);
