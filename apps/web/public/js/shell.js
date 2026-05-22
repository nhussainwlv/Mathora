const NAV_ITEMS = [
  { href: "/student/", label: "Student" },
  { href: "/student/learn.html", label: "Learn" },
  { href: "/student/flashcards.html", label: "Flashcards" },
  { href: "/student/games.html", label: "Games" },
  { href: "/teacher/", label: "Teacher" },
  { href: "/admin/", label: "Admin" },
  { href: "/parent/", label: "Parent" },
];

function isActive(pathname, href) {
  if (href.endsWith("/") && href !== "/") {
    return pathname === href || pathname === href.replace(/\/$/, "/index.html");
  }
  return pathname.endsWith(href.replace(/^\//, "")) || pathname === href;
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
        <h2>Mathora</h2>
        <nav class="nav-list" aria-label="Main">${navHtml}</nav>
      </aside>
      <div class="app-main">
        <header class="app-header">
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <button type="button" class="menu-btn" id="menu-toggle" aria-expanded="false">Menu</button>
            <h1>Personalised Maths Learning</h1>
          </div>
          <button type="button" class="theme-toggle" onclick="toggleTheme()" data-theme-label>Dark mode</button>
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

document.addEventListener("DOMContentLoaded", initShell);
