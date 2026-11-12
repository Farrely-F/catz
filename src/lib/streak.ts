/** Streaks count local calendar days. A "Not today" rest day counts as a day. */

export type Streak = {
  count: number;
  /** Local date, `YYYY-MM-DD`, of the last counted day. */
  lastDay: string | null;
  /** Each freeze bridges one fully missed day. Earned every 7 days, max 2. */
  freezes: number;
};

export const EMPTY_STREAK: Streak = { count: 0, lastDay: null, freezes: 1 };
export const MAX_FREEZES = 2;

export function dayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Whole calendar days from `a` to `b`. Uses UTC math so DST never shifts the answer. */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

/** Record that the owner trained (or rested) on `today`. */
export function recordDay(s: Streak, today: string): Streak {
  if (s.lastDay === today) return s;
  if (s.lastDay === null) return { ...s, count: 1, lastDay: today };

  const gap = daysBetween(s.lastDay, today);
  if (gap <= 0) return s; // clock moved backwards, ignore

  let count: number;
  let freezes = s.freezes;
  if (gap === 1) count = s.count + 1;
  else if (gap === 2 && freezes > 0) {
    count = s.count + 1;
    freezes -= 1;
  } else count = 1;

  if (count > 1 && count % 7 === 0) freezes = Math.min(MAX_FREEZES, freezes + 1);
  return { count, lastDay: today, freezes };
}

/** The streak to display today, which may already be broken. */
export function liveCount(s: Streak, today: string): number {
  if (s.lastDay === null) return 0;
  const gap = daysBetween(s.lastDay, today);
  if (gap <= 1) return s.count;
  if (gap === 2 && s.freezes > 0) return s.count;
  return 0;
}

/** The 7 local dates of the week containing `now`, Monday first. */
export function weekKeys(now: Date = new Date()): string[] {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => dayKey(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)));
}

/** Whether `day` falls inside the current streak run (ending at lastDay). */
export function streakCovers(s: Streak, day: string): boolean {
  if (s.lastDay === null || s.count < 1) return false;
  const back = daysBetween(day, s.lastDay);
  return back >= 0 && back < s.count;
}
