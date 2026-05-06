import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const DAYS = [
  {
    id: 0,
    short: "Mon",
    label: "Monday",
    title: "Chest + Back",
    badge: "Order fixed",
    badgeType: "fix",
    stats: [
      { v: "5", l: "Exercises" },
      { v: "14", l: "Sets" },
      { v: "~55", l: "Minutes" },
    ],
    note: "Key change: flat press added as the primary mover, pec deck moved to the end. You've now got both upper and overall chest coverage in one session.",
    exercises: [
      {
        num: "1",
        name: "Flat Barbell Bench Press",
        sets: "4 sets",
        reps: "6–8 reps",
        tags: [{ label: "new", type: "new" }],
        note: "Replaces isolation opener. Primary chest mass builder — do this first when fresh.",
        variant: "new",
      },
      {
        num: "2",
        name: "Dumbbell Incline Bench Press",
        sets: "3 sets",
        reps: "10–12 reps",
        tags: [{ label: "moved", type: "changed" }],
        note: "Upper chest emphasis. Now follows the flat press instead of leading.",
        variant: "changed",
      },
      {
        num: "3",
        name: "Lever Lying T-Bar Row",
        sets: "3 sets",
        reps: "8–10 reps",
        note: "Mid-back thickness. Keep this position.",
      },
      {
        num: "4",
        name: "Cable Bar Lateral Pulldown",
        sets: "3 sets",
        reps: "10–12 reps",
        note: "Lat width. Full stretch at top, squeeze at bottom.",
      },
      {
        num: "5",
        name: "Lever Pec Deck Fly",
        sets: "3 sets",
        reps: "12–15 reps",
        tags: [{ label: "moved to end", type: "changed" }],
        note: "Now a finisher — pump and isolation after compounds are done.",
        variant: "changed",
      },
    ],
  },
  {
    id: 1,
    short: "Tue",
    label: "Tuesday",
    title: "Shoulders + Arms",
    badge: "Streamlined",
    badgeType: "fix",
    stats: [
      { v: "6", l: "Exercises" },
      { v: "16", l: "Sets" },
      { v: "~45", l: "Minutes" },
    ],
    note: "Tricep pushdown removed — the JM press is the stronger stimulus and triceps get a dedicated second session on Saturday. Bicep and shoulder volume unchanged.",
    exercises: [
      {
        num: "1",
        name: "Dumbbell Seated Shoulder Press",
        sets: "3 sets",
        reps: "8–10 reps",
        note: "Primary overhead compound. Lead with this.",
      },
      {
        num: "2",
        name: "Cable One Arm Lateral Raise",
        sets: "3 sets",
        reps: "12–15 reps",
        note: "Medial delt width — key for shoulder aesthetics.",
      },
      {
        num: "3",
        name: "Cable Standing Crossover High Reverse Fly",
        sets: "3 sets",
        reps: "15–20 reps",
        tags: [{ label: "sets added", type: "changed" }],
        note: "Was missing set count. Rear delt — important for shoulder roundness and posture.",
        variant: "changed",
      },
      {
        num: "4",
        name: "Dumbbell Preacher Curl",
        sets: "3 sets",
        reps: "10–12 reps",
        note: "Bicep peak. Keep your elbow anchored on the pad.",
      },
      {
        num: "5",
        name: "Cable Hammer Curl (With Rope)",
        sets: "3 sets",
        reps: "12–15 reps",
        tags: [{ label: "+1 set", type: "changed" }],
        note: "Bumped from 2 → 3 sets. Brachialis + forearm thickness for arm fullness.",
        variant: "changed",
      },
      {
        num: "6",
        name: "Smith JM Bench Press",
        sets: "3 sets",
        reps: "10–12 reps",
        tags: [{ label: "+1 set", type: "changed" }],
        note: "Tricep compound — long head + overall mass. Pushdown removed as it overlapped; Saturday covers tricep isolation.",
        variant: "changed",
      },
    ],
  },
  {
    id: 2,
    short: "Thu",
    label: "Thursday",
    title: "Legs",
    badge: "Trimmed to 5",
    badgeType: "fix",
    stats: [
      { v: "5", l: "Exercises" },
      { v: "17", l: "Sets" },
      { v: "~45", l: "Minutes" },
    ],
    note: "Trimmed from 8 → 5 exercises. Leg Press removed (overlaps with Hack Squat and Sunday's leg press superset). Seated Leg Curl removed (Sunday covers hamstring isolation). Crunch moved to Sunday.",
    exercises: [
      {
        num: "1",
        name: "Sled Full Hack Squat",
        sets: "4 sets",
        reps: "6–8 reps",
        tags: [{ label: "moved to #1", type: "changed" }],
        note: "Primary compound — opens the session. Do this heavy while fresh.",
        variant: "changed",
      },
      {
        num: "2",
        name: "Barbell Straight Leg Deadlift",
        sets: "3 sets",
        reps: "8–10 reps",
        note: "Hamstring + glute stretch. Full ROM, don't round the back.",
      },
      {
        num: "3",
        name: "Dumbbell Bulgarian Split Squat",
        sets: "3 sets",
        reps: "10–12 reps/leg",
        tags: [{ label: "replaces adductor", type: "new" }],
        note: "Replaces hip adduction. Unilateral glute + quad driver — far more aesthetic return per set.",
        variant: "new",
      },
      {
        num: "4",
        name: "Lever Standing Calf Raise",
        sets: "4 sets",
        reps: "12–15 reps",
        tags: [{ label: "+1 set", type: "changed" }],
        note: "Bumped to 4 sets. Calves need higher frequency and volume.",
        variant: "changed",
      },
      {
        num: "5",
        name: "Lever Leg Extension",
        sets: "3 sets",
        reps: "12–15 reps",
        tags: [{ label: "moved to end", type: "changed" }],
        note: "Finisher only — isolation after your compounds are done.",
        variant: "changed",
      },
    ],
  },
  {
    id: 3,
    short: "Sat",
    label: "Saturday",
    title: "Upper",
    badge: "Streamlined",
    badgeType: "ok",
    stats: [
      { v: "6", l: "Exercises" },
      { v: "16", l: "Sets" },
      { v: "~45", l: "Minutes" },
    ],
    note: "Cable Low Fly removed — chest already gets flat + incline on Monday. Saturday's Smith Incline covers chest adequately; the slot is better used on back and shoulder volume.",
    exercises: [
      {
        num: "1",
        name: "Smith Incline Bench Press",
        sets: "3 sets",
        reps: "8–10 reps",
        note: "Compound opener — keeps chest in the session without doubling up on isolation.",
      },
      {
        num: "2",
        name: "Chest-Supported Machine Row",
        sets: "3 sets",
        reps: "10–12 reps",
        tags: [{ label: "replaces T-Bar Row", type: "new" }],
        note: "Replaces repeated T-Bar Row. Targets mid-back and rhomboids from a different angle.",
        variant: "new",
      },
      {
        num: "3",
        name: "Pull-Ups (or Weighted Pull-Ups)",
        sets: "3 sets",
        reps: "6–10 reps",
        tags: [{ label: "replaces pulldown", type: "new" }],
        note: "Best V-taper builder available. Add a weight belt once bodyweight is easy.",
        variant: "new",
      },
      {
        num: "4",
        name: "Dumbbell Lateral Raise",
        sets: "4 sets",
        reps: "12–15 reps",
        tags: [{ label: "+1 set", type: "changed" }],
        note: "Bumped to 4 sets. Lateral delts are the #1 aesthetic priority for shoulder width.",
        variant: "changed",
      },
      {
        num: "5",
        name: "Lever Preacher Curl",
        sets: "3 sets",
        reps: "10–12 reps",
        note: "Second bicep session of the week — great frequency.",
      },
      {
        num: "6",
        name: "Tricep Extension (Cable or EZ-bar)",
        sets: "3 sets",
        reps: "12–15 reps",
        note: "Second tricep session — overhead position hits the long head with a full stretch.",
      },
    ],
  },
  {
    id: 4,
    short: "Sun",
    label: "Sunday",
    title: "Lower",
    badge: "Glutes fixed",
    badgeType: "fix",
    stats: [
      { v: "7", l: "Exercises" },
      { v: "22", l: "Sets" },
      { v: "~60", l: "Minutes" },
    ],
    note: "Hip thrust now has 4 assigned sets — this was the biggest gap in your program. Glute volume jumps from ~5 to ~12 weekly sets across both leg days, now hitting the optimal range.",
    superset: {
      label: "Superset — keep from your original",
      exercises: [
        {
          num: "A",
          name: "Leg Press",
          sets: "4 sets",
          reps: "10–12 reps",
          ssItem: true,
        },
        {
          num: "B",
          name: "Sled 45 Calf Press",
          sets: "4 sets",
          reps: "15–20 reps",
          note: "Directly after leg press — no rest between A and B.",
          ssItem: true,
        },
      ],
    },
    exercises: [
      {
        num: "2",
        name: "Dumbbell Lunge",
        sets: "3 sets",
        reps: "10–12 reps/leg",
        note: "Unilateral quad + glute. Keep torso upright for more quad, lean forward for more glute.",
      },
      {
        num: "3",
        name: "Lever Hip Thrust (Plate Loaded)",
        sets: "4 sets",
        reps: "10–12 reps",
        tags: [{ label: "sets added", type: "changed" }],
        note: "Was missing set count — now anchored at 4 sets. The single best glute isolation movement in the program. Don't skip this.",
        variant: "changed",
      },
      {
        num: "4",
        name: "Barbell Straight Leg Deadlift",
        sets: "3 sets",
        reps: "8–10 reps",
        tags: [{ label: "sets added", type: "changed" }],
        note: "Was missing set count on Sun. Good hamstring + glute frequency (also trained Thu).",
        variant: "changed",
      },
      {
        num: "5",
        name: "Lever Lying Leg Curl",
        sets: "3 sets",
        reps: "10–12 reps",
        note: "Lying vs seated — slightly different hamstring emphasis. Good variation from Thu.",
      },
      {
        num: "6",
        name: "Lever Leg Extension",
        sets: "3 sets",
        reps: "12–15 reps",
        note: "Quad finisher — teardrop emphasis with toes pointed slightly inward.",
      },
      {
        num: "7",
        name: "Lever Seated Crunch",
        sets: "3 sets",
        reps: "15–20 reps",
        note: "Core finisher.",
      },
    ],
  },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const C = {
  bg: "#0e0f11",
  surface: "#16181c",
  surface2: "#1e2026",
  border: "rgba(255,255,255,0.08)",
  border2: "rgba(255,255,255,0.14)",
  text: "#f0f0ee",
  muted: "#8a8c92",
  dim: "#4a4c52",
  accent: "#c8f060",
  accentDim: "rgba(200,240,96,0.12)",
  accentBorder: "rgba(200,240,96,0.3)",
  warn: "#f0a840",
  warnDim: "rgba(240,168,64,0.1)",
  warnBorder: "rgba(240,168,64,0.25)",
  blue: "#60b8f0",
  blueDim: "rgba(96,184,240,0.1)",
  blueBorder: "rgba(96,184,240,0.3)",
};

const tagStyles = {
  changed: {
    background: C.accentDim,
    color: C.accent,
    border: `1px solid ${C.accentBorder}`,
  },
  new: {
    background: C.blueDim,
    color: C.blue,
    border: `1px solid ${C.blueBorder}`,
  },
};

const numStyles = {
  default: { background: C.surface2, border: `1px solid ${C.border2}`, color: C.muted },
  changed: { background: C.accentDim, border: `1px solid ${C.accentBorder}`, color: C.accent },
  new: { background: C.blueDim, border: `1px solid ${C.blueBorder}`, color: C.blue },
  ss: { background: C.warnDim, border: `1px solid ${C.warnBorder}`, color: C.warn },
};

const cardBg = {
  default: C.surface,
  changed: `linear-gradient(135deg, ${C.surface} 0%, rgba(200,240,96,0.04) 100%)`,
  new: `linear-gradient(135deg, ${C.surface} 0%, rgba(96,184,240,0.04) 100%)`,
};

const cardBorder = {
  default: C.border,
  changed: C.accentBorder,
  new: C.blueBorder,
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Tag({ label, type }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: "1px 7px",
        borderRadius: 4,
        ...tagStyles[type],
      }}
    >
      {label}
    </span>
  );
}

function ExCard({ ex, ssItem = false }) {
  const variant = ssItem ? "ss" : ex.variant || "default";
  return (
    <div
      style={{
        background: ssItem ? C.surface : cardBg[ex.variant || "default"],
        border: ssItem ? "none" : `1px solid ${cardBorder[ex.variant || "default"]}`,
        borderRadius: 12,
        padding: 14,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontFamily: "'DM Mono', monospace",
          flexShrink: 0,
          ...(ssItem ? numStyles.ss : numStyles[ex.variant || "default"]),
        }}
      >
        {ex.num}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14, color: C.text }}>{ex.name}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              color: C.muted,
              background: C.surface2,
              padding: "2px 8px",
              borderRadius: 4,
              border: `1px solid ${C.border}`,
            }}
          >
            {ex.sets}
          </span>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: C.muted }}>
            {ex.reps}
          </span>
          {ex.tags && ex.tags.map((t, i) => <Tag key={i} {...t} />)}
        </div>
        {ex.note && (
          <div style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.4 }}>
            {ex.note}
          </div>
        )}
      </div>
    </div>
  );
}

function SupersetGroup({ superset }) {
  return (
    <div
      style={{
        background: C.surface2,
        border: `1px solid rgba(240,168,64,0.2)`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "6px 14px",
          fontSize: 10,
          fontFamily: "'DM Mono', monospace",
          color: C.warn,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          borderBottom: "1px solid rgba(240,168,64,0.15)",
          background: "rgba(240,168,64,0.06)",
        }}
      >
        {superset.label}
      </div>
      <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
        {superset.exercises.map((ex, i) => (
          <ExCard key={i} ex={ex} ssItem />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function WorkoutProgram() {
  const [activeDay, setActiveDay] = useState(0);
  const navRef = useRef(null);

  // Scroll active pill into view when day changes
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const pill = nav.children[activeDay];
    if (pill) pill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeDay]);

  const day = DAYS[activeDay];

  const pillStyle = (i) => ({
    flexShrink: 0,
    padding: "6px 14px",
    borderRadius: 999,
    border: `1px solid ${i === activeDay ? C.accentBorder : C.border2}`,
    background: i === activeDay ? C.accentDim : "transparent",
    color: i === activeDay ? C.accent : C.muted,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: i === activeDay ? 500 : 400,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  });

  const botBtnStyle = (i) => ({
    flex: 1,
    padding: "10px 6px",
    borderRadius: 8,
    border: `1px solid ${i === activeDay ? C.accentBorder : C.border2}`,
    background: i === activeDay ? C.accentDim : C.surface,
    color: i === activeDay ? C.accent : C.muted,
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: i === activeDay ? 500 : 400,
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.15s",
  });

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          background: C.bg,
          color: C.text,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          lineHeight: 1.5,
          minHeight: "100vh",
          paddingBottom: 80,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: `1px solid ${C.border}`,
            position: "sticky",
            top: 0,
            background: C.bg,
            zIndex: 100,
          }}
        >
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
              color: C.text,
            }}
          >
            Revised Program
          </h1>
          <p
            style={{
              fontSize: 12,
              color: C.muted,
              marginTop: 2,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            5 days · intermediate · summer aesthetic
          </p>
        </div>

        {/* ── DAY NAV ── */}
        <div
          ref={navRef}
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            padding: "12px 16px",
            borderBottom: `1px solid ${C.border}`,
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            position: "sticky",
            top: 69,
            background: C.bg,
            zIndex: 99,
          }}
        >
          {DAYS.map((d, i) => (
            <button key={d.id} style={pillStyle(i)} onClick={() => setActiveDay(i)}>
              {d.short} — {d.title}
            </button>
          ))}
        </div>

        {/* ── LEGEND ── */}
        <div style={{ display: "flex", gap: 12, padding: "14px 16px 4px", flexWrap: "wrap" }}>
          {[
            { color: "rgba(200,240,96,0.5)", border: C.accentBorder, label: "Order / sets fixed" },
            { color: "rgba(96,184,240,0.5)", border: C.blueBorder, label: "New exercise" },
            { color: "rgba(240,168,64,0.4)", border: C.warnBorder, label: "Superset" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: l.color,
                  border: `1px solid ${l.border}`,
                }}
              />
              <span style={{ fontSize: 11, color: C.muted }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* ── SESSION HEADER ── */}
        <div
          style={{
            padding: "20px 16px 12px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              {day.label}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                color: C.text,
              }}
            >
              {day.title}
            </div>
          </div>
          <span
            style={{
              flexShrink: 0,
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              fontFamily: "'DM Mono', monospace",
              marginTop: 4,
              ...(day.badgeType === "ok"
                ? { background: C.accentDim, color: C.accent, border: `1px solid ${C.accentBorder}` }
                : { background: C.warnDim, color: C.warn, border: `1px solid ${C.warnBorder}` }),
            }}
          >
            {day.badge}
          </span>
        </div>

        {/* ── STATS CHIPS ── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "0 16px 16px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {day.stats.map((s) => (
            <div
              key={s.l}
              style={{
                flexShrink: 0,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: C.accent,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.muted,
                  marginTop: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* ── EXERCISES LABEL ── */}
        <div
          style={{
            fontSize: 10,
            fontFamily: "'DM Mono', monospace",
            color: C.dim,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "0 16px 8px",
          }}
        >
          Exercises
        </div>

        {/* ── EXERCISE LIST ── */}
        <div
          style={{
            padding: "0 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {day.superset && <SupersetGroup superset={day.superset} />}
          {day.exercises.map((ex, i) => (
            <ExCard key={i} ex={ex} />
          ))}
        </div>

        {/* ── SESSION NOTE ── */}
        <div
          style={{
            margin: "0 16px 24px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.accent}`,
            borderRadius: "0 8px 8px 0",
            padding: "12px 14px",
            fontSize: 13,
            color: C.muted,
            lineHeight: 1.5,
          }}
        >
          {day.note}
        </div>

        {/* ── BOTTOM NAV (mobile) ── */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: C.bg,
            borderTop: `1px solid ${C.border}`,
            padding: "10px 12px 20px",
            display: "flex",
            gap: 6,
            zIndex: 200,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          {DAYS.map((d, i) => (
            <button key={d.id} style={botBtnStyle(i)} onClick={() => setActiveDay(i)}>
              {d.short}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}