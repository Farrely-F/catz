import { LESSONS, type Lesson } from "./curriculum.ts";
import { WHEN_LABEL, ageBand, catName, pronouns, type Profile } from "./profile.ts";

export type Plan = {
  /** Ordered lesson ids for this cat. */
  lessonIds: string[];
  start: string;
  pace: string;
  rounds: string;
  roundsPerDay: number;
  tricks: string;
  notes: string[];
  /** Use a quieter click. */
  softClick: boolean;
  /** Clicks needed per lesson. */
  goalReps: number;
};

/** Fill `{name}`, `{she}` and `{her}` in lesson copy. */
export function fill(text: string, p: Profile): string {
  const pr = pronouns(p.sex);
  return text.replaceAll("{name}", catName(p)).replaceAll("{she}", pr.she).replaceAll("{her}", pr.her);
}

/** Which lessons suit this cat, in order. */
export function lessonsFor(p: Profile): Lesson[] {
  const senior = ageBand(p.age) === "senior";
  return LESSONS.filter((l) => {
    if (l.onlyPicky && p.food !== "picky") return false;
    if (l.highImpact && senior) return false;
    return true;
  });
}

/** Rules that turn onboarding answers into a plan. Kept pure so an LLM can replace it later. */
export function buildPlan(p: Profile): Plan {
  const pr = pronouns(p.sex);
  const band = ageBand(p.age);
  const lessons = lessonsFor(p);

  const start =
    p.food === "picky"
      ? `Find the treat ${pr.she} loves`
      : p.conf < 40
        ? "Clicker, from a distance"
        : "Charge the clicker";
  const pace =
    p.conf < 40
      ? "Gentle, with extra-slow steps and a soft click"
      : p.conf > 65
        ? `Quick, fewer repeats once ${pr.she} gets it`
        : "Steady, one new skill at a time";

  const roundsPerDay = p.minutes === 15 ? 3 : 2;
  const rounds = { 5: "2 rounds of 2 to 3 min", 10: "2 rounds of 5 min", 15: "3 rounds of 5 min" }[p.minutes];
  const tricks =
    band === "senior"
      ? "Low-impact tricks only, no jumps"
      : band === "kitten"
        ? "Short bursts, lots of play"
        : "Full trick list, sit to high five";

  const notes: string[] = [];
  if (p.energy > 65) notes.push("A play break between rounds");
  if (p.others) notes.push("Train in a separate room");

  return {
    lessonIds: lessons.map((l) => l.id),
    start,
    pace,
    rounds: `${rounds} ${WHEN_LABEL[p.when]}`,
    roundsPerDay,
    tricks,
    notes,
    softClick: p.conf < 40,
    goalReps: p.conf < 40 ? 3 : 5,
  };
}
