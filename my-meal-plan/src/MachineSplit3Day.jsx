import React, { useState } from "react";

/**
 * MachineSplit3Day
 * A self-contained 3-day, machine-based full-body hypertrophy split card.
 * - Tab between days, tap any row to check it off (in-memory state).
 * - Styles + fonts are embedded, so it drops into any project with no
 *   Tailwind / CSS setup required.
 */

const DAYS = [
  {
    id: 1,
    label: "Day 1",
    focus: "Quads + Chest",
    stretch: {
      note: "~6 min",
      items: [
        { name: "Leg swings, front-to-back", rx: "10 / leg" },
        { name: "Bodyweight squat to stand", rx: "10 reps" },
        { name: "Doorway chest stretch", rx: "30s / side" },
        { name: "Cat-cow", rx: "8 reps" },
        { name: "Arm circles", rx: "15 / way" },
      ],
    },
    workout: {
      note: "7 movements",
      items: [
        { name: "Hack Squat", tag: "Machine", rx: "4 × 8-12" },
        { name: "Machine Chest Press", tag: "Chest", emph: true, rx: "4 × 8-12" },
        { name: "Leg Extension", tag: "Machine", rx: "3 × 12-15" },
        { name: "Pec Deck Fly", tag: "Chest", emph: true, rx: "3 × 10-12" },
        { name: "Lat Pulldown", tag: "Cable", rx: "3 × 8-12" },
        { name: "Machine Preacher Curl", tag: "Biceps", emph: true, rx: "3 × 10-12" },
        { name: "Seated Calf Raise", tag: "Machine", rx: "3 × 12-15" },
      ],
    },
    cardio: {
      note: "15-20 min",
      items: [
        { name: "Incline treadmill walk — 3.0-3.5 mph @ 8-10% incline", rx: "15-20 min" },
      ],
      caption: "Low-impact steady-state. Keeps your legs recovered while adding conditioning.",
    },
  },
  {
    id: 2,
    label: "Day 2",
    focus: "Hams + Back",
    stretch: {
      note: "~6 min",
      items: [
        { name: "Standing hamstring reach", rx: "30s / leg" },
        { name: "Hip flexor lunge stretch", rx: "30s / side" },
        { name: "Figure-4 glute stretch", rx: "30s / side" },
        { name: "Thoracic rotations", rx: "8 / side" },
        { name: "Band pull-aparts", rx: "15 reps" },
      ],
    },
    workout: {
      note: "7 movements",
      items: [
        { name: "Leg Press", tag: "Machine", rx: "4 × 10-12" },
        { name: "Seated Leg Curl", tag: "Machine", rx: "3 × 10-12" },
        { name: "Seated Cable Row", tag: "Cable", rx: "4 × 8-12" },
        { name: "Incline Chest Press", tag: "Chest", emph: true, rx: "3 × 8-12" },
        { name: "Close-Grip Lat Pulldown", tag: "Cable", rx: "3 × 8-12" },
        { name: "Cable Hammer Curl", tag: "Biceps", emph: true, rx: "3 × 12" },
        { name: "Rope Tricep Pushdown", tag: "Cable", rx: "2 × 12" },
      ],
    },
    cardio: {
      note: "18-20 min",
      items: [
        { name: "Stationary bike — steady moderate pace (RPE 6)", rx: "18-20 min" },
      ],
      caption: "Short on time? Swap for 5 rounds of 1 min hard / 2 min easy intervals.",
    },
  },
  {
    id: 3,
    label: "Day 3",
    focus: "Full + Delts",
    stretch: {
      note: "~6 min",
      items: [
        { name: "Cross-body shoulder stretch", rx: "30s / side" },
        { name: "Overhead tricep stretch", rx: "30s / side" },
        { name: "Doorway chest stretch", rx: "30s / side" },
        { name: "Standing quad stretch", rx: "30s / side" },
        { name: "Wrist & shoulder circles", rx: "30s" },
      ],
    },
    workout: {
      note: "7 movements",
      items: [
        { name: "Smith Machine Squat", tag: "Machine", rx: "4 × 8-12" },
        { name: "Machine Shoulder Press", tag: "Machine", rx: "3 × 8-12" },
        { name: "Seated Leg Curl", tag: "Machine", rx: "3 × 10-12" },
        { name: "Cable Chest Fly", tag: "Chest", emph: true, rx: "3 × 12" },
        { name: "Cable Lateral Raise", tag: "Cable", rx: "3 × 12-15" },
        { name: "Machine Bicep Curl", tag: "Biceps", emph: true, rx: "3 × 10-12" },
        { name: "Rope Overhead Tricep Ext.", tag: "Cable", rx: "2 × 12" },
      ],
    },
    cardio: {
      note: "12-15 min",
      items: [
        { name: "Stairmaster — steady pace (level 6-8)", rx: "12-15 min" },
      ],
      caption: "Higher burn, still low-impact. Keep it conversational, not all-out.",
    },
  },
];

const SECTIONS = [
  { type: "stretch", title: "Warm-up & Stretch" },
  { type: "workout", title: "Workout" },
  { type: "cardio", title: "Cardio Finisher" },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12">
      <path
        d="M1 6l3.5 3.5L11 2"
        stroke="#10151c"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MachineSplit3Day() {
  const [activeDay, setActiveDay] = useState(1);
  const [done, setDone] = useState(() => new Set());

  const toggle = (key) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const reset = () => setDone(new Set());

  const selectDay = (id) => {
    setActiveDay(id);
  };

  const current = DAYS.find((d) => d.id === activeDay);

  return (
    <div className="ms-root">
      <style>{CSS}</style>
      <div className="wrap">
        <header>
          <div className="eyebrow">Summer Size Block · Machine Focus</div>
          <h1>
            Full Body <span>×3</span>
          </h1>
          <p className="sub">
            Machine and cable driven for constant tension and safe proximity to failure.
            Chest and biceps carry extra volume every session. Train on 3 non-consecutive
            days — Mon / Wed / Fri works well.
          </p>
        </header>

        <div className="tabs">
          {DAYS.map((d) => (
            <button
              key={d.id}
              className={`tab${d.id === activeDay ? " active" : ""}`}
              onClick={() => selectDay(d.id)}
            >
              {d.label}
              <small>{d.focus}</small>
            </button>
          ))}
        </div>

        <section className="day active">
          {SECTIONS.map((section) => {
            const block = current[section.type];
            return (
              <div key={section.type} className={`block ${section.type}`}>
                <div className="block-head">
                  <span className="dot" />
                  <span className="block-title">{section.title}</span>
                  <span className="block-note">{block.note}</span>
                </div>
                <ul>
                  {block.items.map((item, i) => {
                    const key = `${current.id}-${section.type}-${i}`;
                    return (
                      <li
                        key={key}
                        className={`row${done.has(key) ? " done" : ""}`}
                        onClick={() => toggle(key)}
                      >
                        <span className="check">
                          <CheckIcon />
                        </span>
                        <span className="name">
                          {item.name}
                          {item.tag && (
                            <span className={`tag${item.emph ? " emph" : ""}`}>{item.tag}</span>
                          )}
                        </span>
                        <span className="prescription">{item.rx}</span>
                      </li>
                    );
                  })}
                </ul>
                {block.caption && <p className="caption">{block.caption}</p>}
              </div>
            );
          })}
        </section>

        <footer>
          <b>Keep cardio moderate.</b> Since the goal right now is building size, 15-20 min of
          steady-state after lifting 3× a week is plenty — enough for conditioning and a bit of
          a lean-out without cutting into recovery. If you start dropping weight too fast, trim
          the cardio before you trim the food.
        </footer>

        <div className="resetbar">
          <button className="reset" onClick={reset}>
            Reset checkmarks
          </button>
        </div>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.ms-root {
  --bg: #0F1008;
  --panel: #1C1E0F;
  --panel-2: #181A0C;
  --line: #2A2D18;
  --text: #F5F5E8;
  --muted: #8A8F6A;
  --iron: #E8FF47;
  --recover: #7EFF9A;
  --burn: #FF9A47;
  --shadow: 0 10px 30px rgba(0,0,0,.35);

  background: transparent;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  padding: 4px 16px 32px;
  line-height: 1.5;
}
.ms-root * { margin: 0; padding: 0; box-sizing: border-box; }
.ms-root .wrap { max-width: 720px; margin: 0 auto; }

.ms-root header { margin-bottom: 22px; }
.ms-root .eyebrow {
  font-family: 'Space Mono', monospace;
  letter-spacing: .28em;
  font-size: .72rem;
  text-transform: uppercase;
  color: var(--iron);
  font-weight: 600;
  margin-bottom: 6px;
}
.ms-root h1 {
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 1.1;
  letter-spacing: -.01em;
  text-transform: none;
}
.ms-root h1 span { color: var(--muted); }
.ms-root .sub { color: var(--muted); font-size: .9rem; margin-top: 10px; max-width: 52ch; }

.ms-root .tabs {
  display: flex;
  gap: 8px;
  margin: 18px 0 20px;
}
.ms-root .tab {
  flex: 1;
  background: var(--panel);
  border: 1px solid var(--line);
  color: var(--muted);
  font-family: 'Space Mono', monospace;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  font-size: .95rem;
  padding: 12px 6px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all .18s ease;
  text-align: center;
  line-height: 1.05;
}
.ms-root .tab small {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  font-size: .68rem;
  color: var(--muted);
  margin-top: 3px;
  opacity: .8;
}
.ms-root .tab.active {
  background: var(--panel-2);
  border-color: var(--iron);
  color: var(--text);
  box-shadow: 0 0 0 1px rgba(244,169,44,.25) inset;
}
.ms-root .tab.active small { color: var(--iron); }

.ms-root .day { animation: ms-fade .25s ease; }
@keyframes ms-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.ms-root .block {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px 18px 8px;
  margin-bottom: 16px;
  box-shadow: var(--shadow);
}
.ms-root .block-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.ms-root .dot { width: 10px; height: 10px; border-radius: 50%; flex: none; }
.ms-root .block-title {
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  font-size: 1.05rem;
}
.ms-root .block-note { margin-left: auto; font-size: .72rem; color: var(--muted); }

.ms-root .stretch .dot { background: var(--recover); }
.ms-root .workout .dot { background: var(--iron); }
.ms-root .cardio .dot { background: var(--burn); }
.ms-root .stretch .block-title { color: var(--recover); }
.ms-root .workout .block-title { color: var(--iron); }
.ms-root .cardio .block-title { color: var(--burn); }

.ms-root ul { list-style: none; }

.ms-root .row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 4px;
  border-top: 1px solid var(--line);
  cursor: pointer;
  user-select: none;
  transition: opacity .15s ease;
}
.ms-root .row:first-child { border-top: none; }
.ms-root .check {
  width: 20px; height: 20px; border-radius: 6px; flex: none;
  border: 1.5px solid var(--line);
  display: grid; place-items: center;
  transition: all .15s ease;
}
.ms-root .check svg { width: 12px; height: 12px; opacity: 0; transition: opacity .15s ease; }
.ms-root .row.done .check { background: var(--iron); border-color: var(--iron); }
.ms-root .row.done .check svg { opacity: 1; }
.ms-root .cardio .row.done .check { background: var(--burn); border-color: var(--burn); }
.ms-root .stretch .row.done .check { background: var(--recover); border-color: var(--recover); }
.ms-root .row.done .name { text-decoration: line-through; color: var(--muted); }

.ms-root .name { flex: 1; font-size: .95rem; font-weight: 500; }
.ms-root .name .tag {
  display: inline-block;
  font-size: .62rem;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 1px 5px;
  margin-left: 6px;
  vertical-align: middle;
}
.ms-root .name .tag.emph { color: var(--iron); border-color: rgba(244,169,44,.4); }
.ms-root .prescription {
  font-family: 'Space Mono', monospace;
  font-weight: 600;
  font-size: .92rem;
  color: var(--text);
  letter-spacing: .02em;
  flex: none;
  white-space: nowrap;
}
.ms-root .cardio .prescription, .ms-root .stretch .prescription { color: var(--muted); }

.ms-root .caption { font-size: .8rem; color: var(--muted); padding: 4px 4px 12px; }

.ms-root footer {
  margin-top: 26px;
  padding: 16px 18px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-left: 3px solid var(--iron);
  border-radius: 12px;
  font-size: .84rem;
  color: var(--muted);
}
.ms-root footer b { color: var(--text); font-weight: 600; }

.ms-root .resetbar { text-align: center; margin-top: 18px; }
.ms-root .reset {
  background: none; border: 1px solid var(--line); color: var(--muted);
  font-family: 'DM Sans', sans-serif; font-size: .8rem;
  padding: 8px 16px; border-radius: 20px; cursor: pointer;
  transition: all .15s ease;
}
.ms-root .reset:hover { color: var(--text); border-color: var(--muted); }

@media (max-width: 460px) {
  .ms-root .block-note { display: none; }
  .ms-root .name .tag { display: none; }
}
`;
