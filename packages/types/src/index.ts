export type Role = "STUDENT" | "TEACHER" | "ADMIN" | "PARENT";

export type DashboardStats = {
  xp: number;
  level: number;
  streakDays: number;
  accuracyPct: number;
  studyMinutes: number;
  subjectsCompleted: number;
};

export type Recommendation = {
  skillId: string;
  skillName: string;
  reason: string;
  suggestedMode?: string;
};
