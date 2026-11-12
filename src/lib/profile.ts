import { DEFAULT_LOOK, type CatLook } from "./cat.ts";

export type Sex = "girl" | "boy";
export type Home = "indoor" | "both";
export type Food = "hunter" | "picky" | "unsure";
export type Minutes = 5 | 10 | 15;
export type When = "morning" | "dinner" | "evening";

/** Everything onboarding learns about the cat and the owner's time. Plain JSON. */
export type Profile = {
  name: string;
  look: CatLook;
  age: number;
  sex: Sex;
  home: Home;
  others: boolean;
  /** 0 shy .. 100 bold */
  conf: number;
  /** 0 couch potato .. 100 zoomies */
  energy: number;
  /** 0 independent .. 100 cuddly */
  aff: number;
  food: Food;
  treat: string;
  minutes: Minutes;
  when: When;
};

export const TREATS = ["Chicken bits", "Tuna", "Freeze-dried", "Lickable"] as const;

export const WHEN_LABEL: Record<When, string> = {
  morning: "in the morning",
  dinner: "before dinner",
  evening: "in the evening",
};

export const DEFAULT_PROFILE: Profile = {
  name: "Mochi",
  look: DEFAULT_LOOK,
  age: 3,
  sex: "girl",
  home: "indoor",
  others: false,
  conf: 35,
  energy: 72,
  aff: 55,
  food: "hunter",
  treat: "Chicken bits",
  minutes: 10,
  when: "dinner",
};

export type AgeBand = "kitten" | "adult" | "senior";

export function ageBand(age: number): AgeBand {
  return age < 1 ? "kitten" : age > 10 ? "senior" : "adult";
}

export function pronouns(sex: Sex) {
  return sex === "girl" ? { she: "she", her: "her" } : { she: "he", her: "his" };
}

const pick = (v: number, words: [string, string, string]) => (v < 35 ? words[0] : v < 65 ? words[1] : words[2]);

export const confidenceWord = (v: number) => pick(v, ["Shy", "Easygoing", "Bold"]);
export const energyWord = (v: number) => pick(v, ["Couch potato", "Balanced", "Zoomies"]);
export const affectionWord = (v: number) => pick(v, ["Independent", "Friendly", "Cuddly"]);

export const catName = (p: Pick<Profile, "name">) => p.name.trim() || "Your cat";
