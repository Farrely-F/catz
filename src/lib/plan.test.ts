import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPlan, fill, lessonsFor } from "./plan.ts";
import { DEFAULT_PROFILE, type Profile } from "./profile.ts";

const p = (patch: Partial<Profile>): Profile => ({ ...DEFAULT_PROFILE, ...patch });

test("a shy cat starts at a distance with a soft click and fewer reps", () => {
  const plan = buildPlan(p({ conf: 20 }));
  assert.equal(plan.start, "Clicker, from a distance");
  assert.equal(plan.softClick, true);
  assert.equal(plan.goalReps, 3);
});

test("a bold cat gets the quick pace", () => {
  const plan = buildPlan(p({ conf: 90 }));
  assert.match(plan.pace, /^Quick/);
  assert.equal(plan.softClick, false);
  assert.equal(plan.goalReps, 5);
});

test("a picky eater gets the find-the-treat lesson first", () => {
  const plan = buildPlan(p({ food: "picky" }));
  assert.equal(plan.lessonIds[0], "find-treat");
  assert.match(plan.start, /^Find the treat/);
});

test("other cats do not see find-the-treat", () => {
  assert.ok(!buildPlan(p({ food: "hunter" })).lessonIds.includes("find-treat"));
});

test("senior cats skip high-impact lessons", () => {
  assert.ok(!lessonsFor(p({ age: 12 })).some((l) => l.highImpact));
  assert.ok(lessonsFor(p({ age: 3 })).some((l) => l.highImpact));
  assert.equal(buildPlan(p({ age: 12 })).tricks, "Low-impact tricks only, no jumps");
});

test("time budget sets the rounds", () => {
  assert.equal(buildPlan(p({ minutes: 5 })).roundsPerDay, 2);
  assert.equal(buildPlan(p({ minutes: 15 })).roundsPerDay, 3);
  assert.match(buildPlan(p({ minutes: 10, when: "dinner" })).rounds, /2 rounds of 5 min before dinner/);
});

test("notes reflect energy and other cats", () => {
  const plan = buildPlan(p({ energy: 90, others: true }));
  assert.deepEqual(plan.notes, ["A play break between rounds", "Train in a separate room"]);
  assert.deepEqual(buildPlan(p({ energy: 10, others: false })).notes, []);
});

test("fill replaces name and pronouns", () => {
  assert.equal(fill("{name} lifts {her} paw. {she} is happy.", p({ name: "Mochi", sex: "girl" })), "Mochi lifts her paw. she is happy.");
  assert.equal(fill("{she}/{her}", p({ sex: "boy" })), "he/his");
  assert.equal(fill("{name}", p({ name: "  " })), "Your cat");
});
