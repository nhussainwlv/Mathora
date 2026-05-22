const children = [
  { id: "c1", name: "Sam", accuracy: 87, streak: 14, weakTopic: "Ratios" },
  { id: "c2", name: "Ava", accuracy: 79, streak: 9, weakTopic: "Algebra" },
];

function initParent() {
  const root = document.getElementById("parent-page");
  if (!root) return;

  let activeChildId = children[0].id;
  const messageEl = root.querySelector("[data-message]");
  const childRow = root.querySelector("[data-children]");
  const accuracyEl = root.querySelector("[data-accuracy]");
  const streakEl = root.querySelector("[data-streak]");
  const weakEl = root.querySelector("[data-weak]");

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function activeChild() {
    return children.find((child) => child.id === activeChildId) ?? children[0];
  }

  function renderChild() {
    const child = activeChild();
    accuracyEl.textContent = `${child.accuracy}%`;
    streakEl.textContent = `${child.streak} days`;
    weakEl.textContent = child.weakTopic;
  }

  childRow.innerHTML = children
    .map(
      (child) =>
        `<button type="button" class="pill${activeChildId === child.id ? " active" : ""}" data-child="${child.id}">${child.name}</button>`,
    )
    .join("");

  childRow.querySelectorAll("[data-child]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeChildId = btn.dataset.child;
      childRow.querySelectorAll(".pill").forEach((pill) => {
        pill.classList.toggle("active", pill.dataset.child === activeChildId);
      });
      renderChild();
    });
  });

  root.querySelectorAll("[data-feature]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setMessage(`${btn.dataset.feature} for ${activeChild().name}.`);
    });
  });

  renderChild();
}

document.addEventListener("DOMContentLoaded", initParent);
