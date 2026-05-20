import type { PropsWithChildren } from "react";

export function GlassCard({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/50">
      {children}
    </div>
  );
}
