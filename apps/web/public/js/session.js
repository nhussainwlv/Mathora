const STORAGE_KEY = "mathora-session";

window.MathoraSession = {
  accessToken: null,
  refreshToken: null,
  user: null,

  save() {
    const payload = {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      user: this.user,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    document.dispatchEvent(new CustomEvent("mathora:session-changed"));
  },

  clear() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem(STORAGE_KEY);
    document.dispatchEvent(new CustomEvent("mathora:session-changed"));
  },

  setTokens(accessToken, refreshToken, user) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (user) this.user = user;
    this.save();
  },

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      this.accessToken = data.accessToken ?? null;
      this.refreshToken = data.refreshToken ?? null;
      this.user = data.user ?? null;
    } catch {
      this.clear();
    }
  },

  getAccessToken() {
    return this.accessToken;
  },
};

window.MathoraSession.loadFromStorage();
