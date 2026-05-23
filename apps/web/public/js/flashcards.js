const FAV_STORAGE_KEY = "mathora-flashcard-favourites";
const LEVELS = ["easy", "medium", "hard", "advanced"];
const LEVEL_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  advanced: "Advanced",
};

function loadFavouriteIds() {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function saveFavouriteIds(ids) {
  try {
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function paintFaces(frontEl, backEl) {
  window.paintFlashcardText?.(frontEl);
  window.paintFlashcardText?.(backEl);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildDecks() {
  const perLevel = window.MathoraGenerator?.FLASHCARDS_PER_LEVEL ?? 50;
  const decks = { all: [] };
  LEVELS.forEach((level) => {
    decks[level] = window.MathoraGenerator.buildFlashcardDeck(level, perLevel);
    decks.all.push(...decks[level]);
  });
  return decks;
}

function initFlashcards() {
  const root = document.getElementById("flashcards-page");
  if (!root || !window.MathoraGenerator) return;

  const decks = buildDecks();
  let favouriteIds = loadFavouriteIds();
  let mode = "all";
  let levelFilter = "all";
  let index = 0;
  let flipped = false;
  let animating = false;

  const sceneEl = root.querySelector("[data-scene]");
  const innerEl = root.querySelector("[data-card]");
  const frontEl = root.querySelector("[data-card-front]");
  const backEl = root.querySelector("[data-card-back]");
  const hintEl = root.querySelector("[data-hint]");
  const counterEl = root.querySelector("[data-counter]");
  const favBtn = root.querySelector("[data-favourite]");
  const favIcon = root.querySelector("[data-fav-icon]");
  const favLabel = root.querySelector("[data-fav-label]");
  const favListEl = root.querySelector("[data-fav-list]");
  const favEmptyEl = root.querySelector("[data-fav-empty]");
  const gotoFavBtn = root.querySelector("[data-goto-favourites]");
  const modeBtns = root.querySelectorAll("[data-mode]");
  const levelBtns = root.querySelectorAll("[data-level-filter]");

  function activeDeck() {
    if (mode === "favourites") {
      const pool = decks.all.filter((c) => favouriteIds.includes(c.id));
      return pool;
    }
    if (levelFilter === "all") return decks.all;
    return decks[levelFilter] ?? [];
  }

  function currentCard() {
    const deck = activeDeck();
    return deck[index] ?? null;
  }

  function isFavourite(id) {
    return favouriteIds.includes(id);
  }

  function persistFavourites() {
    saveFavouriteIds(favouriteIds);
    renderFavList();
    updateFavCount();
  }

  function updateFavCount() {
    const n = favouriteIds.length;
    root.querySelectorAll("[data-fav-count]").forEach((el) => {
      el.textContent = String(n);
    });
    if (gotoFavBtn) gotoFavBtn.hidden = n === 0;
  }

  function renderFavList() {
    if (!favListEl) return;
    const items = decks.all.filter((c) => favouriteIds.includes(c.id));

    if (favEmptyEl) favEmptyEl.hidden = items.length > 0;
    favListEl.innerHTML = items
      .map(
        (card) => `
        <li>
          <button type="button" class="flashcards-fav-chip" data-fav-jump="${card.id}">
            <span class="flashcards-fav-chip-text">${escapeHtml(card.front)}</span>
            <span class="flashcards-fav-chip-level">${LEVEL_LABELS[card.level] || card.level}</span>
          </button>
          <button type="button" class="flashcards-fav-remove" data-fav-remove="${card.id}" aria-label="Remove">×</button>
        </li>
      `
      )
      .join("");

    favListEl.querySelectorAll("[data-fav-jump]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-fav-jump");
        setMode("favourites");
        jumpToCard(id);
      });
    });

    favListEl.querySelectorAll("[data-fav-remove]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-fav-remove");
        favouriteIds = favouriteIds.filter((x) => x !== id);
        persistFavourites();
        clampIndex();
        render({ animate: false });
      });
    });
  }

  function setMode(next) {
    mode = next;
    index = 0;
    flipped = false;
    modeBtns.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-mode") === mode);
    });
    clampIndex();
    render({ animate: false });
  }

  function setLevelFilter(level) {
    levelFilter = level;
    if (mode !== "favourites") {
      index = 0;
      flipped = false;
    }
    levelBtns.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-level-filter") === level);
    });
    clampIndex();
    render({ animate: false });
  }

  function jumpToCard(id) {
    const deck = activeDeck();
    const i = deck.findIndex((c) => c.id === id);
    if (i >= 0) {
      index = i;
      flipped = false;
      innerEl?.classList.remove("is-flipped");
      render({ animate: true, direction: "next" });
    }
  }

  function clampIndex() {
    const deck = activeDeck();
    if (deck.length === 0) {
      index = 0;
      return;
    }
    if (index >= deck.length) index = deck.length - 1;
    if (index < 0) index = 0;
  }

  function toggleFavourite() {
    const card = currentCard();
    if (!card) return;

    if (isFavourite(card.id)) {
      favouriteIds = favouriteIds.filter((id) => id !== card.id);
      favBtn?.classList.remove("is-favourite");
    } else {
      favouriteIds = [...favouriteIds, card.id];
      favBtn?.classList.add("is-favourite", "flashcards-fav-pulse");
      window.setTimeout(() => favBtn?.classList.remove("flashcards-fav-pulse"), 450);
    }
    persistFavourites();
    updateFavouriteButton();
  }

  function updateFavouriteButton() {
    const card = currentCard();
    const on = card && isFavourite(card.id);
    if (favIcon) favIcon.textContent = on ? "★" : "♡";
    if (favLabel) favLabel.textContent = on ? "Saved" : "Add favourite";
    favBtn?.classList.toggle("is-favourite", Boolean(on));
  }

  function renderCardFaces() {
    const card = currentCard();
    const deck = activeDeck();

    if (!card || deck.length === 0) {
      if (frontEl) frontEl.textContent = mode === "favourites" ? "No favourites yet" : "No cards in this set";
      if (backEl) backEl.textContent = "Try another level or add favourites";
      innerEl?.classList.remove("is-flipped");
      if (hintEl) hintEl.textContent = "";
      if (counterEl) counterEl.textContent = "";
      paintFaces(frontEl, backEl);
      return;
    }

    if (frontEl) frontEl.textContent = card.front;
    if (backEl) backEl.textContent = card.back;
    innerEl?.classList.toggle("is-flipped", flipped);
    if (hintEl) hintEl.textContent = `Hint: ${card.hint}`;
    if (counterEl) {
      const levelName = LEVEL_LABELS[card.level] || card.level;
      counterEl.textContent = `Card ${index + 1} of ${deck.length} · ${levelName}`;
    }
    paintFaces(frontEl, backEl);
    updateFavouriteButton();
  }

  function runSlide(direction, done) {
    if (!sceneEl || animating) {
      done();
      return;
    }
    animating = true;
    const outClass = direction === "next" ? "flashcard-scene--out-left" : "flashcard-scene--out-right";
    sceneEl.classList.add(outClass);

    window.setTimeout(() => {
      done();
      sceneEl.classList.remove(outClass);
      sceneEl.classList.add(direction === "next" ? "flashcard-scene--in-right" : "flashcard-scene--in-left");
      window.setTimeout(() => {
        sceneEl.classList.remove("flashcard-scene--in-right", "flashcard-scene--in-left");
        animating = false;
      }, 280);
    }, 220);
  }

  function render(options = {}) {
    const { animate = false, direction = "next" } = options;
    if (animate) {
      runSlide(direction, () => renderCardFaces());
    } else {
      renderCardFaces();
    }
  }

  innerEl?.addEventListener("click", () => {
    if (animating || !currentCard()) return;
    flipped = !flipped;
    innerEl.classList.toggle("is-flipped", flipped);
  });

  innerEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      innerEl.click();
    }
  });

  root.querySelector("[data-prev]")?.addEventListener("click", () => {
    const deck = activeDeck();
    if (!deck.length || animating) return;
    flipped = false;
    innerEl?.classList.remove("is-flipped");
    index = (index + deck.length - 1) % deck.length;
    render({ animate: true, direction: "prev" });
  });

  root.querySelector("[data-next]")?.addEventListener("click", () => {
    const deck = activeDeck();
    if (!deck.length || animating) return;
    flipped = false;
    innerEl?.classList.remove("is-flipped");
    index = (index + 1) % deck.length;
    render({ animate: true, direction: "next" });
  });

  favBtn?.addEventListener("click", toggleFavourite);

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = btn.getAttribute("data-mode");
      if (m) setMode(m);
    });
  });

  levelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const l = btn.getAttribute("data-level-filter");
      if (l) setLevelFilter(l);
    });
  });

  gotoFavBtn?.addEventListener("click", () => setMode("favourites"));

  persistFavourites();
  render({ animate: false });
}

document.addEventListener("DOMContentLoaded", initFlashcards);
