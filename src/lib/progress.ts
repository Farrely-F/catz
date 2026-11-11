import { DEFAULT_PROFILE, type Profile } from "./profile.ts";
import { EMPTY_STREAK, recordDay, type Streak } from "./streak.ts";

export type Prefs = {
  /** Clicker sound. */
  sound: boolean;
  /** Taps, chimes and meows. */
  ui: boolean;
  /** Only the clicker makes sound while training. */
  focus: boolean;
  /** Quieter click for shy cats. */
  soft: boolean;
  haptic: boolean;
};

export type Win = { id: string; day: string; title: string; note: string; lessonId?: string };
export type Today = { day: string; rounds: number; treats: number };

/** Everything we persist. Plain JSON so it can sync to a server later. */
export type State = {
  v: 1;
  onboarded: boolean;
  profile: Profile;
  xp: number;
  done: string[];
  streak: Streak;
  today: Today;
  wins: Win[];
  prefs: Prefs;
};

export const DEFAULT_PREFS: Prefs = { sound: true, ui: true, focus: true, soft: false, haptic: true };

export function defaultState(): State {
  return {
    v: 1,
    onboarded: false,
    profile: DEFAULT_PROFILE,
    xp: 0,
    done: [],
    streak: EMPTY_STREAK,
    today: { day: "", rounds: 0, treats: 0 },
    wins: [],
    prefs: DEFAULT_PREFS,
  };
}

export const level = (xp: number) => 1 + Math.floor(xp / 100);

/** Today's counters, reset when the day has changed. */
export function todayOf(s: State, day: string): Today {
  return s.today.day === day ? s.today : { day, rounds: 0, treats: 0 };
}

export type Mood = "nailed" | "close" | "rest";

export type FinishInput = { lessonId: string; mood: Mood; win: string };

/** Apply a finished lesson. A "Not today" rest day keeps the streak but earns little XP and no win. */
export function finishLesson(s: State, input: FinishInput, day: string, id: string) {
  const rest = input.mood === "rest";
  const xpGain = rest ? 5 : input.mood === "nailed" ? 25 : 20;
  const today = todayOf(s, day);
  const state: State = {
    ...s,
    xp: s.xp + xpGain,
    streak: recordDay(s.streak, day),
    today: { ...today, rounds: today.rounds + (rest ? 0 : 1) },
    done: !rest && !s.done.includes(input.lessonId) ? [...s.done, input.lessonId] : s.done,
    wins: rest ? s.wins : [{ id, day, title: input.win, note: "", lessonId: input.lessonId }, ...s.wins],
  };
  return { state, xpGain, rest };
}

export function addTreats(s: State, n: number, day: string): State {
  const today = todayOf(s, day);
  return { ...s, today: { ...today, treats: Math.max(0, today.treats + n) } };
}

/** Tolerant loader: unknown or old data falls back to defaults field by field. */
export function mergeState(raw: unknown): State {
  const base = defaultState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<State>;
  if (r.v !== 1) return base;
  return {
    ...base,
    ...r,
    v: 1,
    profile: { ...base.profile, ...r.profile, look: { ...base.profile.look, ...r.profile?.look } },
    prefs: { ...base.prefs, ...r.prefs },
    streak: { ...base.streak, ...r.streak },
    today: { ...base.today, ...r.today },
    done: Array.isArray(r.done) ? r.done : base.done,
    wins: Array.isArray(r.wins) ? r.wins : base.wins,
  };
}
