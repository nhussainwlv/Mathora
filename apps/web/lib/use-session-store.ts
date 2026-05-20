"use client";

import { create } from "zustand";

type SessionState = {
  accessToken?: string;
  refreshToken?: string;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  accessToken: undefined,
  refreshToken: undefined,
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  clear: () => set({ accessToken: undefined, refreshToken: undefined }),
}));
