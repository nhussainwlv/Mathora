function initAdmin() {
  const root = document.getElementById("admin-page");
  if (!root) return;

  let users = [
    { id: "u1", name: "Student Sam", banned: false },
    { id: "u2", name: "Teacher Taylor", banned: false },
  ];
  let questionBank = ["Fractions: simplify 12/18"];
  const messageEl = root.querySelector("[data-message]");
  const usersList = root.querySelector("[data-users]");
  const bankList = root.querySelector("[data-bank]");

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function renderUsers() {
    usersList.innerHTML = users
      .map(
        (user) => `<li class="list-item">
          <span>${user.name}</span>
          <button type="button" class="btn btn-sm ${user.banned ? "badge-emerald" : ""}" style="background:${user.banned ? "#059669" : "#e11d48"};color:#fff;" data-ban="${user.id}">${user.banned ? "Unban" : "Ban"}</button>
        </li>`,
      )
      .join("");

    usersList.querySelectorAll("[data-ban]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const user = users.find((item) => item.id === btn.dataset.ban);
        if (!user) return;
        user.banned = !user.banned;
        setMessage(`${user.banned ? "Banned" : "Unbanned"} ${user.name}.`);
        renderUsers();
      });
    });
  }

  function renderBank() {
    bankList.innerHTML = questionBank
      .map((item) => `<li class="list-item">${item}</li>`)
      .join("");
  }

  root.querySelector("[data-question-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const question = String(new FormData(form).get("question") || "").trim();
    if (!question) return;
    questionBank = [question, ...questionBank];
    setMessage("Question added to bank.");
    form.reset();
    renderBank();
  });

  root.querySelectorAll("[data-panel]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setMessage(`${btn.dataset.panel} panel opened.`);
    });
  });

  renderUsers();
  renderBank();
}

document.addEventListener("DOMContentLoaded", initAdmin);
