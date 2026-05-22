function initTeacher() {
  const root = document.getElementById("teacher-page");
  if (!root) return;

  let classrooms = ["KS2 Maths Wizards"];
  let assignments = [];
  const messageEl = root.querySelector("[data-message]");
  const classroomList = root.querySelector("[data-classrooms]");
  const assignmentList = root.querySelector("[data-assignments]");

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function renderClassrooms() {
    classroomList.innerHTML = classrooms
      .map(
        (classroom) => `<li class="list-item">
          <span>${classroom}</span>
          <button type="button" class="btn btn-dark btn-sm" data-analytics="${classroom}">View analytics</button>
        </li>`,
      )
      .join("");

    classroomList.querySelectorAll("[data-analytics]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setMessage(`Opened analytics for ${btn.dataset.analytics}.`);
      });
    });
  }

  function renderAssignments() {
    if (assignments.length === 0) {
      assignmentList.innerHTML = `<li class="list-item">No assignments yet.</li>`;
      return;
    }

    assignmentList.innerHTML = assignments
      .map(
        (assignment) => `<li class="list-item">
          <span>${assignment}</span>
          <button type="button" class="btn btn-primary btn-sm" data-report="${assignment}">Download report</button>
        </li>`,
      )
      .join("");

    assignmentList.querySelectorAll("[data-report]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setMessage(`Report download started for "${btn.dataset.report}".`);
      });
    });
  }

  root.querySelector("[data-classroom-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get("classroomName") || "").trim();
    if (!name) return;
    classrooms = [name, ...classrooms];
    setMessage(`Classroom "${name}" created.`);
    form.reset();
    renderClassrooms();
  });

  root.querySelector("[data-assignment-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const title = String(new FormData(form).get("assignmentTitle") || "").trim();
    if (!title) return;
    assignments = [title, ...assignments];
    setMessage(`Assignment "${title}" published.`);
    form.reset();
    renderAssignments();
  });

  renderClassrooms();
  renderAssignments();
}

document.addEventListener("DOMContentLoaded", initTeacher);
