import { test } from "node:test";
import assert from "node:assert/strict";
import { addTreats, defaultState, finishLesson, level, mergeState, todayOf } from "./progress.ts";

const DAY = "2026-05-01";

test("finishing a lesson earns xp, a win, a round and a streak day", () => {
  const r = finishLesson(defaultState(), { lessonId: "target-touch", mood: "nailed", win: "First target touch" }, DAY, "w1");
  assert.equal(r.xpGain, 25);
  assert.equal(r.state.xp, 25);
  assert.deepEqual(r.state.done, ["target-touch"]);
  assert.equal(r.state.wins[0].title, "First target touch");
  assert.equal(r.state.today.rounds, 1);
  assert.equal(r.state.streak.count, 1);
});

test("a rest day keeps the streak but gives little xp, no win, no round, no progress", () => {
  const r = finishLesson(defaultState(), { lessonId: "target-touch", mood: "rest", win: "x" }, DAY, "w1");
  assert.equal(r.rest, true);
  assert.equal(r.xpGain, 5);
  assert.equal(r.state.streak.count, 1);
  assert.deepEqual(r.state.done, []);
  assert.deepEqual(r.state.wins, []);
  assert.equal(r.state.today.rounds, 0);
});

test("replaying a lesson does not duplicate progress", () => {
  const a = finishLesson(defaultState(), { lessonId: "sit", mood: "close", win: "First sit" }, DAY, "a").state;
  const b = finishLesson(a, { lessonId: "sit", mood: "close", win: "First sit" }, DAY, "b").state;
  assert.deepEqual(b.done, ["sit"]);
  assert.equal(b.streak.count, 1);
});

test("today's counters reset on a new day", () => {
  const a = addTreats(defaultState(), 5, DAY);
  assert.equal(a.today.treats, 5);
  assert.equal(todayOf(a, "2026-05-02").treats, 0);
  assert.equal(addTreats(a, 2, "2026-05-02").today.treats, 2);
});

test("treats never go below zero", () => {
  assert.equal(addTreats(defaultState(), -3, DAY).today.treats, 0);
});

test("level is one per 100 xp", () => {
  assert.equal(level(0), 1);
  assert.equal(level(99), 1);
  assert.equal(level(100), 2);
});

test("mergeState survives junk and fills missing fields", () => {
  assert.equal(mergeState(null).onboarded, false);
  assert.equal(mergeState({ v: 99 }).xp, 0);
  const m = mergeState({ v: 1, xp: 40, profile: { name: "Bean" } });
  assert.equal(m.xp, 40);
  assert.equal(m.profile.name, "Bean");
  assert.equal(m.profile.look.pattern, "tabby");
  assert.equal(m.prefs.focus, true);
});
