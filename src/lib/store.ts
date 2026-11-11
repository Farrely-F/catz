"use client";

import { useSyncExternalStore } from "react";
import { buildPlan } from "./plan.ts";
import {
  addTreats,
  defaultState,
  finishLesson,
  mergeState,
  type FinishInput,
  type Prefs,
  type State,
} from "./progress.ts";
import type { Profile } from "./profile.ts";
import { dayKey } from "./streak.ts";

const KEY = "catz:v1";

let state: State = defaultState();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = mergeState(JSON.parse(raw));
  } catch {
    /* private mode or corrupt data: start fresh */
  }
}

function commit(next: State) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: keep working in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): State | null {
  if (!loaded) load();
  return state;
}

/** `null` on the server and during hydration. Render a skeleton until it is a State. */
export function useCatz(): State | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));

export const actions = {
  /** Merge profile edits (during onboarding or later in My cat). */
  patchProfile(patch: Partial<Profile>) {
    getSnapshot();
    commit({ ...state, profile: { ...state.profile, ...patch } });
  },
  /** Finish onboarding: lock in the plan's defaults. */
  completeOnboarding() {
    getSnapshot();
    const plan = buildPlan(state.profile);
    commit({
      ...state,
      onboarded: true,
      prefs: { ...state.prefs, soft: plan.softClick },
    });
  },
  finishLesson(input: FinishInput) {
    getSnapshot();
    const r = finishLesson(state, input, dayKey(), newId());
    commit(r.state);
    return { xpGain: r.xpGain, rest: r.rest };
  },
  addTreats(n: number) {
    getSnapshot();
    commit(addTreats(state, n, dayKey()));
  },
  setPrefs(patch: Partial<Prefs>) {
    getSnapshot();
    commit({ ...state, prefs: { ...state.prefs, ...patch } });
  },
  setWinNote(id: string, note: string) {
    getSnapshot();
    commit({ ...state, wins: state.wins.map((w) => (w.id === id ? { ...w, note } : w)) });
  },
  reset() {
    getSnapshot();
    commit(defaultState());
  },
};
