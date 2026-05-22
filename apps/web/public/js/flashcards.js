const cards = [
  {
    front: "What is 3/4 of 20?",
    back: "15",
    hint: "Find one quarter first, then multiply by 3.",
  },
  {
    front: "Solve: 2x + 5 = 17",
    back: "x = 6",
    hint: "Subtract 5 from both sides first.",
  },
  {
    front: "What is the area of a triangle with base 10 and height 6?",
    back: "30",
    hint: "Use 1/2 × base × height.",
  },
];

function initFlashcards() {
  const root = document.getElementById("flashcards-page");
  if (!root) return;

  let index = 0;
  let flipped = false;
  const bookmarked = [];

  const cardEl = root.querySelector("[data-card]");
  const hintEl = root.querySelector("[data-hint]");
  const favBtn = root.querySelector("[data-favourite]");

  function render() {
    const card = cards[index];
    const isFavourite = bookmarked.includes(index);
    cardEl.textContent = flipped ? card.back : card.front;
    cardEl.classList.toggle("flipped", flipped);
    hintEl.textContent = `Hint: ${card.hint}`;
    favBtn.textContent = isFavourite ? "Remove favourite" : "Add favourite";
  }

  cardEl.addEventListener("click", () => {
    flipped = !flipped;
    render();
  });

  root.querySelector("[data-prev]")?.addEventListener("click", () => {
    flipped = false;
    index = (index + cards.length - 1) % cards.length;
    render();
  });

  root.querySelector("[data-next]")?.addEventListener("click", () => {
    flipped = false;
    index = (index + 1) % cards.length;
    render();
  });

  favBtn?.addEventListener("click", () => {
    if (bookmarked.includes(index)) {
      const i = bookmarked.indexOf(index);
      bookmarked.splice(i, 1);
    } else {
      bookmarked.push(index);
    }
    render();
  });

  render();
}

document.addEventListener("DOMContentLoaded", initFlashcards);
