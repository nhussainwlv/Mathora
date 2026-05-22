window.MathoraSession = {
  accessToken: null,
  refreshToken: null,
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  },
};
