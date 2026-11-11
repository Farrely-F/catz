"use client";

/**
 * Synthesized sound, no audio files. One lazily created AudioContext (needs a user gesture).
 *
 * Two independent channels:
 *  - the clicker (`clickerDown` / `clickerUp`), controlled by `sound` and `soft`
 *  - app sounds (`sfx.*`), controlled by `ui`, and silenced by `focus` while `training`
 *    so the cat only hears the clicker.
 */

type Config = {
  sound: boolean;
  ui: boolean;
  focus: boolean;
  soft: boolean;
  haptic: boolean;
  /** True on the clicker tab and during the click step of a lesson. */
  training: boolean;
  boy: boolean;
};

const cfg: Config = { sound: true, ui: true, focus: true, soft: false, haptic: true, training: false, boy: false };

export function configureAudio(patch: Partial<Config>) {
  Object.assign(cfg, patch);
}

let ac: AudioContext | undefined;
let master: GainNode | undefined;
let noiseBuf: AudioBuffer | undefined;

function ctx(): AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  if (!ac) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return undefined;
    ac = new Ctor();
    const comp = ac.createDynamicsCompressor();
    master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(comp);
    comp.connect(ac.destination);
    const n = Math.floor(ac.sampleRate * 0.5);
    noiseBuf = ac.createBuffer(1, n, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ac.state === "suspended") void ac.resume();
  return ac;
}

type OscOpts = { f: number; f2?: number; type?: OscillatorType; t?: number; d?: number; v?: number; a?: number; out?: AudioNode };

function osc({ f, f2, type = "sine", t = 0, d = 0.1, v = 0.2, a = 0.003, out }: OscOpts) {
  const c = ctx();
  if (!c || !master) return;
  const t0 = c.currentTime + t;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + a + d);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  o.connect(g);
  g.connect(out ?? master);
  o.start(t0);
  o.stop(t0 + a + d + 0.03);
}

type NoiseOpts = { t?: number; d?: number; v?: number; type?: BiquadFilterType; f?: number; f2?: number; q?: number; out?: AudioNode };

function noise({ t = 0, d = 0.05, v = 0.2, type = "highpass", f = 3000, f2, q = 1, out }: NoiseOpts) {
  const c = ctx();
  if (!c || !master || !noiseBuf) return;
  const t0 = c.currentTime + t;
  const s = c.createBufferSource();
  const flt = c.createBiquadFilter();
  const g = c.createGain();
  s.buffer = noiseBuf;
  flt.type = type;
  flt.Q.value = q;
  flt.frequency.setValueAtTime(f, t0);
  if (f2) flt.frequency.exponentialRampToValueAtTime(f2, t0 + d);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0 + Math.min(0.004, d / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
  s.connect(flt);
  flt.connect(g);
  g.connect(out ?? master);
  s.start(t0, Math.random() * 0.3);
  s.stop(t0 + d + 0.02);
}

/** Box clicker: a loud hollow "clack" on press, a small dry "tick" on release. */
function clicker(kind: "down" | "up") {
  if (!cfg.sound) return;
  const c = ctx();
  if (!c || !master) return;
  const soft = cfg.soft;
  const k = (soft ? 0.72 : 1) * (1 + (Math.random() - 0.5) * 0.04);
  let out: AudioNode = master;
  if (soft) {
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3000;
    lp.connect(master);
    out = lp;
  }
  const down = kind === "down";
  const vol = (down ? 1 : 0.45) * (soft ? 0.6 : 1);
  const jit = () => 1 + (Math.random() - 0.5) * 0.03;
  noise({ d: 0.009, v: 0.7 * vol, type: "bandpass", f: down ? 2200 : 3000, q: 0.9, out });
  noise({ d: down ? 0.06 : 0.035, v: (down ? 0.9 : 0.4) * vol, type: "bandpass", f: (down ? 1350 : 1900) * k * jit(), q: down ? 9 : 7, out });
  (down
    ? ([[1250, 0.34], [1880, 0.22], [2740, 0.1]] as const)
    : ([[1750, 0.18], [2600, 0.08]] as const)
  ).forEach(([f, v], i) => osc({ f: f * k * jit(), d: (down ? 0.05 : 0.03) - i * 0.006, v: v * vol, a: 0.001, out }));
  osc({ f: (down ? 700 : 520) * k, f2: (down ? 360 : 330) * k, d: 0.04, v: (down ? 0.4 : 0.2) * vol, a: 0.001, out });
}

export const clickerDown = () => {
  clicker("down");
  if (cfg.haptic && typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(cfg.soft ? 8 : 14);
};
export const clickerUp = () => clicker("up");

/** App sounds play only when enabled, and not while Focus mode is protecting a training session. */
const on = () => cfg.ui && !(cfg.focus && cfg.training);

let lastSlide = 0;
let lastMeow = 0;
const SCALE = [523, 587, 659, 784, 880, 988];

export const sfx = {
  press() { if (!on()) return; noise({ d: 0.015, v: 0.1, type: "bandpass", f: 1800 }); osc({ f: 210, f2: 130, d: 0.04, v: 0.1, type: "triangle" }); },
  pop() { if (!on()) return; osc({ f: 480, f2: 900, d: 0.07, v: 0.13 }); osc({ f: 900, d: 0.05, v: 0.05, t: 0.04, type: "triangle" }); },
  toggle(v: boolean) { if (!on()) return; osc({ f: v ? 520 : 420, f2: v ? 780 : 300, d: 0.08, v: 0.13 }); },
  tab() { if (!on()) return; osc({ f: 620, f2: 780, d: 0.06, v: 0.1, type: "triangle" }); },
  next() { if (!on()) return; noise({ d: 0.16, v: 0.07, type: "bandpass", f: 500, f2: 2400, q: 1.2 }); osc({ f: 520, f2: 780, d: 0.08, v: 0.08, t: 0.05, type: "triangle" }); },
  back() { if (!on()) return; noise({ d: 0.16, v: 0.07, type: "bandpass", f: 2400, f2: 500, q: 1.2 }); },
  step(dir: number) { if (!on()) return; osc({ f: dir > 0 ? 600 : 480, f2: dir > 0 ? 760 : 380, d: 0.06, v: 0.12 }); },
  slide(val: number) {
    if (!on()) return;
    const n = performance.now();
    if (n - lastSlide < 55) return;
    lastSlide = n;
    osc({ f: 300 + val * 5, d: 0.03, v: 0.07, type: "triangle" });
  },
  check() { if (!on()) return; osc({ f: 660, d: 0.09, v: 0.12, type: "triangle" }); osc({ f: 990, d: 0.12, v: 0.12, t: 0.07, type: "triangle" }); },
  error() { if (!on()) return; [0, 0.12].forEach((t) => osc({ f: 200, f2: 120, d: 0.14, v: 0.16, type: "triangle", t })); },
  rep(i: number) { if (!on()) return; osc({ f: SCALE[i % SCALE.length], d: 0.18, v: 0.13, type: "triangle", t: 0.09 }); },
  crunch() {
    if (!on()) return;
    [0, 0.05, 0.1].forEach((t) => noise({ t, d: 0.03, v: 0.16, type: "bandpass", f: 1500, q: 2 }));
    osc({ f: 200, f2: 120, d: 0.05, v: 0.1, type: "triangle" });
  },
  success() { if (!on()) return; [523, 659, 784].forEach((f, i) => osc({ f, d: 0.22, v: 0.14, type: "triangle", t: i * 0.08 })); },
  chime() { if (!on()) return; [784, 988, 1175].forEach((f, i) => osc({ f, d: 0.45, v: 0.12, t: i * 0.14 })); },
  tickUp(i: number) { if (!on()) return; osc({ f: 700 + i * 70, d: 0.04, v: 0.09, type: "triangle" }); },
  win() {
    if (!on()) return;
    [523, 659, 784, 1047].forEach((f, i) => osc({ f, d: 0.28, v: 0.15, type: "triangle", t: i * 0.09 }));
    osc({ f: 262, d: 0.5, v: 0.14, type: "triangle" });
    [2093, 2637, 3136, 3520].forEach((f, i) => osc({ f, d: 0.16, v: 0.05, t: 0.35 + i * 0.08 }));
  },
  meow() {
    if (!on()) return;
    const now = performance.now();
    if (now - lastMeow < 380) return;
    lastMeow = now;
    const c = ctx();
    if (!c || !master) return;
    const t0 = c.currentTime;
    const long = Math.random() < 0.45;
    const dur = long ? 0.55 : 0.2;
    const base = (cfg.boy ? 330 : 420) * (1 + (Math.random() - 0.5) * 0.1);
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(base * 0.9, t0);
    o.frequency.linearRampToValueAtTime(base * (long ? 1.5 : 1.25), t0 + dur * 0.35);
    o.frequency.linearRampToValueAtTime(base * (long ? 0.95 : 1), t0 + dur);
    const f1 = c.createBiquadFilter();
    f1.type = "bandpass";
    f1.Q.value = 4;
    f1.frequency.setValueAtTime(700, t0);
    f1.frequency.linearRampToValueAtTime(1400, t0 + dur * 0.4);
    f1.frequency.linearRampToValueAtTime(900, t0 + dur);
    const f2 = c.createBiquadFilter();
    f2.type = "bandpass";
    f2.frequency.value = 2600;
    f2.Q.value = 6;
    const g2 = c.createGain();
    g2.gain.value = 0.45;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 4200;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.04);
    g.gain.setValueAtTime(0.2, t0 + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(f1);
    o.connect(f2);
    f2.connect(g2);
    f1.connect(g);
    g2.connect(g);
    g.connect(lp);
    lp.connect(master);
    if (!long) {
      const lfo = c.createOscillator();
      const lg = c.createGain();
      lfo.frequency.value = 24;
      lg.gain.value = 0.08;
      lfo.connect(lg);
      lg.connect(g.gain);
      lfo.start(t0);
      lfo.stop(t0 + dur + 0.02);
    }
    o.start(t0);
    o.stop(t0 + dur + 0.03);
  },
};
