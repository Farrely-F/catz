import { test } from "node:test";
import assert from "node:assert/strict";
import { EMPTY_STREAK, dayKey, daysBetween, liveCount, recordDay, type Streak } from "./streak.ts";

const s = (count: number, lastDay: string | null, freezes = 0): Streak => ({ count, lastDay, freezes });

test("dayKey uses the local calendar date", () => {
  assert.equal(dayKey(new Date(2026, 0, 5, 23, 59)), "2026-01-05");
  assert.equal(dayKey(new Date(2026, 11, 31, 0, 1)), "2026-12-31");
});

test("daysBetween crosses month, year and DST boundaries", () => {
  assert.equal(daysBetween("2026-01-31", "2026-02-01"), 1);
  assert.equal(daysBetween("2025-12-31", "2026-01-01"), 1);
  assert.equal(daysBetween("2026-03-07", "2026-03-09"), 2);
  assert.equal(daysBetween("2026-03-09", "2026-03-07"), -2);
});

test("first day starts the streak at 1", () => {
  assert.deepEqual(recordDay(EMPTY_STREAK, "2026-05-01"), { count: 1, lastDay: "2026-05-01", freezes: 1 });
});

test("same day twice does not double count", () => {
  const a = recordDay(EMPTY_STREAK, "2026-05-01");
  assert.equal(recordDay(a, "2026-05-01"), a);
});

test("next day extends the streak", () => {
  assert.equal(recordDay(s(3, "2026-05-01"), "2026-05-02").count, 4);
});

test("one missed day is bridged by a freeze, which is consumed", () => {
  const r = recordDay(s(3, "2026-05-01", 1), "2026-05-03");
  assert.equal(r.count, 4);
  assert.equal(r.freezes, 0);
});

test("one missed day with no freeze resets to 1", () => {
  const r = recordDay(s(3, "2026-05-01", 0), "2026-05-03");
  assert.equal(r.count, 1);
});

test("two or more missed days reset even with a freeze", () => {
  assert.equal(recordDay(s(9, "2026-05-01", 2), "2026-05-04").count, 1);
});

test("a freeze is earned every 7 days, capped at 2", () => {
  assert.equal(recordDay(s(6, "2026-05-01", 0), "2026-05-02").freezes, 1);
  assert.equal(recordDay(s(6, "2026-05-01", 2), "2026-05-02").freezes, 2);
});

test("a clock that moves backwards changes nothing", () => {
  const a = s(5, "2026-05-10");
  assert.equal(recordDay(a, "2026-05-08"), a);
});

test("liveCount shows a broken streak as 0", () => {
  assert.equal(liveCount(EMPTY_STREAK, "2026-05-01"), 0);
  assert.equal(liveCount(s(4, "2026-05-01"), "2026-05-01"), 4);
  assert.equal(liveCount(s(4, "2026-05-01"), "2026-05-02"), 4);
  assert.equal(liveCount(s(4, "2026-05-01", 1), "2026-05-03"), 4);
  assert.equal(liveCount(s(4, "2026-05-01", 0), "2026-05-03"), 0);
  assert.equal(liveCount(s(4, "2026-05-01", 2), "2026-05-04"), 0);
});
