import React, { useState } from "react";

/**
 * MachineSplit3Day
 * A self-contained 3-day, machine-based full-body split — rebalanced for
 * EQUAL development across all muscle groups (no chest/bicep bias).
 * Every muscle is trained 3x/week at matched volume (~9 sets/week each),
 * with exercises varied across days to hit each muscle from new angles.
 * - Tab between days, tap any row to check it off (in-memory state).
 * - Styles + fonts are embedded, so it drops into any project with no
 *   Tailwind / CSS setup required.
 */

const DAYS = [
  {
    id: 1,
    label: "Day 1",
    focus: "Full Body A",
    stretch: {
      note: "~6 min",
      items: [
        { name: "Cat-cow", rx: "8 reps" },
        { name: "Leg swings, front-to-back", rx: "10 / leg" },
        { name: "World's greatest stretch", rx: "4 / side" },
        { name: "Arm circles", rx: "15 / way" },
        { name: "Bodyweight squat to stand", rx: "10 reps" },
      ],
    },
    workout: {
      note: "8 movements",
      items: [
        { name: "Hack Squat", tag: "Quads", rx: "3 × 10-12" },
        { name: "Seated Leg Curl", tag: "Hams", rx: "3 × 10-12" },
        { name: "Machine Chest Press", tag: "Chest", rx: "3 × 8-12" },
        { name: "Lat Pulldown", tag: "Back", rx: "3 × 8-12" },
        { name: "Machine Shoulder Press", tag: "Delts", rx: "3 × 8-12" },
        { name: "Machine Preacher Curl", tag: "Biceps", rx: "3 × 10-12" },
        { name: "Rope Tricep Pushdown", tag: "Triceps", rx: "3 × 10-12" },
        { name: "Seated Calf Raise", tag: "Calves", rx: "3 × 12-15" },
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
    focus: "Full Body B",
    stretch: {
      note: "~6 min",
      items: [
        { name: "Hip flexor lunge stretch", rx: "30s / side" },
        { name: "Thoracic rotations", rx: "8 / side" },
        { name: "Leg swings, side-to-side", rx: "10 / leg" },
        { name: "Band pull-aparts", rx: "15 reps" },
        { name: "Deep squat hold", rx: "30s" },
      ],
    },
    workout: {
      note: "8 movements",
      items: [
        { name: "Leg Press", tag: "Quads", rx: "3 × 10-12" },
        { name: "Hip Thrust Machine", tag: "Glutes", rx: "3 × 10-12" },
        { name: "Incline Chest Press", tag: "Chest", rx: "3 × 8-12" },
        { name: "Seated Cable Row", tag: "Back", rx: "3 × 8-12" },
        { name: "Cable Lateral Raise", tag: "Delts", rx: "3 × 12-15" },
        { name: "Cable Hammer Curl", tag: "Biceps", rx: "3 × 10-12" },
        { name: "Overhead Rope Extension", tag: "Triceps", rx: "3 × 10-12" },
        { name: "Standing Calf Raise", tag: "Calves", rx: "3 × 12-15" },
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
    focus: "Full Body C",
    stretch: {
      note: "~6 min",
      items: [
        { name: "Cross-body shoulder stretch", rx: "30s / side" },
        { name: "World's greatest stretch", rx: "4 / side" },
        { name: "Standing quad stretch", rx: "30s / side" },
        { name: "90/90 hip switches", rx: "8 total" },
        { name: "Overhead tricep stretch", rx: "30s / side" },
      ],
    },
    workout: {
      note: "8 movements",
      items: [
        { name: "Smith Machine Squat", tag: "Quads", rx: "3 × 8-12" },
        { name: "Seated Leg Curl", tag: "Hams", rx: "3 × 10-12" },
        { name: "Pec Deck Fly", tag: "Chest", rx: "3 × 10-12" },
        { name: "Close-Grip Lat Pulldown", tag: "Back", rx: "3 × 8-12" },
        { name: "Reverse Pec Deck", tag: "Rear Delt", rx: "3 × 12-15" },
        { name: "Machine Bicep Curl", tag: "Biceps", rx: "3 × 10-12" },
        { name: "Tricep Dip Machine", tag: "Triceps", rx: "3 × 10-12" },
        { name: "Leg Press Calf Raise", tag: "Calves", rx: "3 × 12-15" },
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
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const current = DAYS.find((d) => d.id === activeDay);

  return (
    <div className="ms-root">
      <style>{CSS}</style>
      <div className="wrap">
        <header>
          <div className="eyebrow">Rebuild Block · Balanced Full Body</div>
          <h1>
            Full Body <span>×3</span>
          </h1>
          <p className="sub">
            Machine and cable driven for constant tension and safe proximity to failure. Every
            muscle group gets equal volume and 3× weekly frequency — no priorities. Train on 3
            non-consecutive days; Mon / Wed / Fri works well.
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
                          {item.tag && <span className="tag">{item.tag}</span>}
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
          <b>Even volume, even growth.</b> Each muscle group lands around 9 hard sets a week at
          matched frequency — the balanced dose for overall size coming back from a layoff. Keep
          most sets 1-2 reps shy of failure, push the last set of each movement, and add a little
          weight each week as your strength returns.
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
@import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

.ms-root {
  --bg: #10151c;
  --panel: #171e28;
  --panel-2: #1d2733;
  --line: #2a3644;
  --text: #eef3f8;
  --muted: #7d8a99;
  --iron: #f4a92c;
  --recover: #34d6b6;
  --burn: #ff5f52;
  --shadow: 0 10px 30px rgba(0,0,0,.35);

  background:
    radial-gradient(1100px 600px at 80% -10%, rgba(244,169,44,.06), transparent 60%),
    var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  padding: 28px 16px 64px;
  line-height: 1.5;
}
.ms-root * { margin: 0; padding: 0; box-sizing: border-box; }
.ms-root .wrap { max-width: 720px; margin: 0 auto; }

.ms-root header { margin-bottom: 22px; }
.ms-root .eyebrow {
  font-family: 'Saira Condensed', sans-serif;
  letter-spacing: .28em;
  font-size: .72rem;
  text-transform: uppercase;
  color: var(--iron);
  font-weight: 600;
  margin-bottom: 6px;
}
.ms-root h1 {
  font-family: 'Saira Condensed', sans-serif;
  font-weight: 700;
  font-size: clamp(2.4rem, 9vw, 3.6rem);
  line-height: .95;
  letter-spacing: .01em;
  text-transform: uppercase;
}
.ms-root h1 span { color: var(--muted); }
.ms-root .sub { color: var(--muted); font-size: .9rem; margin-top: 10px; max-width: 52ch; }

.ms-root .tabs {
  display: flex;
  gap: 8px;
  margin: 24px 0 20px;
  position: sticky;
  top: 8px;
  z-index: 5;
}
.ms-root .tab {
  flex: 1;
  background: var(--panel);
  border: 1px solid var(--line);
  color: var(--muted);
  font-family: 'Saira Condensed', sans-serif;
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
  font-family: 'Inter', sans-serif;
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
  font-family: 'Saira Condensed', sans-serif;
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
.ms-root .prescription {
  font-family: 'Saira Condensed', sans-serif;
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
  font-family: 'Inter', sans-serif; font-size: .8rem;
  padding: 8px 16px; border-radius: 20px; cursor: pointer;
  transition: all .15s ease;
}
.ms-root .reset:hover { color: var(--text); border-color: var(--muted); }

@media (max-width: 460px) {
  .ms-root .block-note { display: none; }
  .ms-root .name .tag { display: none; }
}
`;