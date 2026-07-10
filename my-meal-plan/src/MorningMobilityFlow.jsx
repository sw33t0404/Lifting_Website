import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * MorningMobilityFlow
 * A self-contained morning mobility routine card with per-movement
 * countdown timers. Tap a step to check it off; tap a timer to run a hold.
 * Only one timer runs at a time. Styles + fonts are embedded, so it drops
 * into any project with no Tailwind / CSS setup required.
 */

const STEPS = [
  {
    name: "Cat-Cow",
    target: "8-10 reps",
    secs: 40,
    cue: "On all fours, alternate arching and rounding your spine — slow and controlled, moving with your breath.",
    why: "Wakes the spine up and gets you breathing.",
  },
  {
    name: "World's Greatest Stretch",
    target: "5 / side",
    secs: 60,
    core: true,
    cue: "From a deep lunge, drop the same-side elbow toward the floor, then rotate that arm up to the ceiling. Switch sides.",
    why: "Hits hip flexors, hamstrings, groin, and thoracic rotation in one move — best bang for your buck.",
  },
  {
    name: "90/90 Hip Switches",
    target: "8-10 total",
    secs: 60,
    core: true,
    cue: "Seated, both knees bent 90°, rotate your hips to switch both legs from one side to the other.",
    why: "Trains hip internal and external rotation — where nimbleness lives when you carry muscle.",
  },
  {
    name: "Deep Squat Hold + Pry",
    target: "30-45s hold",
    secs: 40,
    core: true,
    cue: "Sink into a deep squat, elbows inside your knees, gently push your knees out and rock side to side.",
    why: "Opens ankles, hips, and adductors all at once.",
  },
  {
    name: "Quadruped T-Spine Rotations",
    target: "6-8 / side",
    secs: 50,
    cue: "On all fours, one hand behind your head, rotate that elbow down under you then up toward the ceiling.",
    why: "Restores upper-back rotation that pressing and benching quietly steal.",
  },
  {
    name: "Shoulder Pass-Throughs",
    target: "8-10 reps",
    secs: 40,
    cue: "Hold a band or broomstick wide, sweep it overhead and behind you with straight arms, then back.",
    why: "Keeps your shoulders healthy for overhead and bench work.",
  },
  {
    name: "Leg Swings",
    target: "10 / leg",
    secs: 60,
    cue: "Holding support, swing one leg front-to-back, then side-to-side. Switch legs.",
    why: "Dynamic hip and hamstring mobility.",
  },
  {
    name: "Knee-to-Wall Ankle Rocks",
    target: "8-10 / side",
    secs: 50,
    cue: "Foot a few inches from a wall, drive your knee toward the wall without letting your heel lift.",
    why: "Ankle dorsiflexion — drives squat depth and quick, agile footwork.",
  },
];

const fmt = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");

const CheckIcon = () => (
  <svg viewBox="0 0 12 12">
    <path d="M1 6l3.5 3.5L11 2" stroke="#10151c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 16 16"><rect x="3.5" y="2.5" width="3" height="11" fill="currentColor" /><rect x="9.5" y="2.5" width="3" height="11" fill="currentColor" /></svg>
);
const ResetIcon = () => (
  <svg viewBox="0 0 16 16"><path d="M8 3V0.5L4.5 4 8 7.5V5a4 4 0 11-4 4H2.5A5.5 5.5 0 108 3z" fill="currentColor" /></svg>
);

export default function MorningMobilityFlow() {
  const [done, setDone] = useState(() => new Set());
  const [activeIdx, setActiveIdx] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const audioRef = useRef(null);

  const beep = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!audioRef.current) audioRef.current = new Ctx();
      const ctx = audioRef.current;
      [880, 1175].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = f;
        const t = ctx.currentTime + i * 0.18;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.start(t);
        o.stop(t + 0.35);
      });
    } catch {
      /* audio unavailable — fail silently */
    }
  }, []);

  // Drive the countdown one tick at a time.
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining]);

  // Handle reaching zero: beep, stop, reset the display after a beat.
  useEffect(() => {
    if (running && remaining === 0 && activeIdx !== null) {
      beep();
      setRunning(false);
      const t = setTimeout(() => setRemaining(STEPS[activeIdx].secs), 900);
      return () => clearTimeout(t);
    }
  }, [running, remaining, activeIdx, beep]);

  const togglePlay = (idx) => {
    if (audioRef.current && audioRef.current.state === "suspended") audioRef.current.resume();
    if (activeIdx === idx && running) {
      setRunning(false); // pause
      return;
    }
    if (activeIdx !== idx) {
      setActiveIdx(idx);
      setRemaining(STEPS[idx].secs);
    }
    setRunning(true);
  };

  const resetTimer = (idx) => {
    if (activeIdx === idx) {
      setRunning(false);
      setActiveIdx(null);
      setRemaining(0);
    }
  };

  const toggleDone = (idx) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const resetAll = () => {
    setRunning(false);
    setActiveIdx(null);
    setRemaining(0);
    setDone(new Set());
  };

  const displaySecs = (idx) => (activeIdx === idx ? remaining : STEPS[idx].secs);

  return (
    <div className="mm-root">
      <style>{CSS}</style>
      <div className="wrap">
        <header>
          <div className="eyebrow">Daily · Before Coffee</div>
          <h1>
            Morning <span>Mobility</span>
          </h1>
          <p className="sub">
            Mostly dynamic movement to wake cold joints up — hips, spine, shoulders, and ankles.
            Flow through it continuously, don't rest between moves. Tap a step to check it off; tap
            the timer on any hold.
          </p>
        </header>

        <div className="meta">
          <span className="pill"><b>8-10</b> min</span>
          <span className="pill">Core 3: steps <b>2 · 3 · 4</b></span>
          <span className="progress"><b>{done.size}</b> / 8 done</span>
        </div>

        <div>
          {STEPS.map((s, i) => {
            const isRunning = activeIdx === i && running;
            const isDone = done.has(i);
            return (
              <div key={i} className={`step${isRunning ? " running" : ""}${isDone ? " done" : ""}`}>
                <div className="step-top" onClick={() => toggleDone(i)}>
                  <span className="check"><CheckIcon /></span>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="name">
                    {s.name}
                    {s.core && <span className="badge">Core</span>}
                  </span>
                  <span className="target">{s.target}</span>
                </div>
                <p className="cue">{s.cue}</p>
                <p className="why">{s.why}</p>
                <div className="step-foot">
                  <span className="foot-label">Timer</span>
                  <div className="timer">
                    <span className="time">{fmt(displaySecs(i))}</span>
                    <button className="tbtn play" title="Start / pause" onClick={() => togglePlay(i)}>
                      {isRunning ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button className="tbtn rst" title="Reset timer" onClick={() => resetTimer(i)}>
                      <ResetIcon />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <footer>
          <b>Morning = dynamic, not deep.</b> Cold tissue doesn't like long static holds, so keep
          these moving. Save deep stretching to <b>gain</b> range for after training when you're
          warm. And this won't cost you strength or size — long static holds only dampen power if
          done right before heavy lifting, which this isn't.
        </footer>

        <div className="resetbar">
          <button className="reset" onClick={resetAll}>Reset all</button>
        </div>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.mm-root {
  --bg: #0F1008;
  --panel: #1C1E0F;
  --panel-2: #181A0C;
  --line: #2A2D18;
  --text: #F5F5E8;
  --muted: #8A8F6A;
  --mob: #7EFF9A;
  --iron: #E8FF47;
  --shadow: 0 10px 30px rgba(0,0,0,.35);

  background: transparent;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  padding: 4px 16px 32px;
  line-height: 1.5;
}
.mm-root * { margin: 0; padding: 0; box-sizing: border-box; }
.mm-root .wrap { max-width: 640px; margin: 0 auto; }

.mm-root header { margin-bottom: 20px; }
.mm-root .eyebrow {
  font-family: 'Space Mono', monospace;
  letter-spacing: .28em; font-size: .72rem; text-transform: uppercase;
  color: var(--mob); font-weight: 600; margin-bottom: 6px;
}
.mm-root h1 {
  font-family: 'Space Mono', monospace; font-weight: 700;
  font-size: 1.4rem; line-height: 1.1;
  letter-spacing: -.01em; text-transform: none;
}
.mm-root h1 span { color: var(--muted); }
.mm-root .sub { color: var(--muted); font-size: .9rem; margin-top: 10px; max-width: 54ch; }

.mm-root .meta {
  display: flex; align-items: center; gap: 14px; margin: 18px 0 22px;
  font-family: 'Space Mono', monospace; letter-spacing: .05em;
  text-transform: uppercase; font-size: .8rem;
}
.mm-root .pill { border: 1px solid var(--line); border-radius: 20px; padding: 6px 12px; color: var(--muted); }
.mm-root .pill b { color: var(--mob); }
.mm-root .progress { margin-left: auto; color: var(--muted); }
.mm-root .progress b { color: var(--text); }

.mm-root .step {
  background: var(--panel); border: 1px solid var(--line); border-radius: 16px;
  padding: 16px; margin-bottom: 12px; box-shadow: var(--shadow);
  transition: border-color .18s ease, opacity .18s ease;
}
.mm-root .step.running { border-color: var(--mob); box-shadow: 0 0 0 1px rgba(52,214,182,.25) inset, var(--shadow); }
.mm-root .step.done { opacity: .55; }

.mm-root .step-top { display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none; }
.mm-root .check {
  width: 24px; height: 24px; border-radius: 7px; flex: none;
  border: 1.5px solid var(--line); display: grid; place-items: center; transition: all .15s ease;
}
.mm-root .check svg { width: 13px; height: 13px; opacity: 0; transition: opacity .15s ease; }
.mm-root .step.done .check { background: var(--mob); border-color: var(--mob); }
.mm-root .step.done .check svg { opacity: 1; }

.mm-root .num { font-family: 'Space Mono', monospace; font-weight: 700; color: var(--muted); font-size: 1rem; min-width: 22px; }
.mm-root .name {
  flex: 1; font-family: 'Space Mono', monospace; font-weight: 600;
  text-transform: uppercase; letter-spacing: .05em; font-size: 1.08rem;
}
.mm-root .step.done .name { text-decoration: line-through; color: var(--muted); }
.mm-root .badge {
  font-family: 'DM Sans', sans-serif; font-size: .58rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase; color: var(--iron);
  border: 1px solid rgba(244,169,44,.4); border-radius: 5px; padding: 1px 5px;
  margin-left: 8px; vertical-align: middle;
}
.mm-root .target { font-family: 'Space Mono', monospace; font-weight: 600; font-size: .9rem; color: var(--text); white-space: nowrap; }

.mm-root .cue { color: var(--text); font-size: .88rem; margin: 12px 0 6px; padding-left: 34px; }
.mm-root .why { color: var(--muted); font-size: .8rem; padding-left: 34px; }

.mm-root .step-foot { display: flex; align-items: center; gap: 10px; margin-top: 14px; padding-left: 34px; }
.mm-root .foot-label { font-size: .72rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
.mm-root .timer { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.mm-root .time {
  font-family: 'Space Mono', monospace; font-weight: 700; font-size: 1.15rem;
  letter-spacing: .04em; min-width: 52px; text-align: right; font-variant-numeric: tabular-nums;
}
.mm-root .step.running .time { color: var(--mob); }
.mm-root .tbtn {
  width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--line);
  background: var(--panel-2); color: var(--text); display: grid; place-items: center;
  cursor: pointer; transition: all .15s ease;
}
.mm-root .tbtn:hover { border-color: var(--mob); color: var(--mob); }
.mm-root .tbtn svg { width: 14px; height: 14px; }

.mm-root footer {
  margin-top: 22px; padding: 16px 18px; background: var(--panel);
  border: 1px solid var(--line); border-left: 3px solid var(--mob);
  border-radius: 12px; font-size: .84rem; color: var(--muted);
}
.mm-root footer b { color: var(--text); font-weight: 600; }

.mm-root .resetbar { text-align: center; margin-top: 18px; }
.mm-root .reset {
  background: none; border: 1px solid var(--line); color: var(--muted);
  font-family: 'DM Sans', sans-serif; font-size: .8rem; padding: 8px 16px;
  border-radius: 20px; cursor: pointer; transition: all .15s ease;
}
.mm-root .reset:hover { color: var(--text); border-color: var(--muted); }

@media (max-width: 440px) {
  .mm-root .cue, .mm-root .why, .mm-root .step-foot { padding-left: 0; }
  .mm-root .foot-label { display: none; }
}
`;
