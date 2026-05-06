import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const DAYS = [
  {
    id: 0,
    short: "Mon",
    label: "Monday",
    title: "Chest + Back",
    badge: "Strength emphasis",
    badgeType: "ok",
    stats: [
      { v: "5", l: "Exercises" },
      { v: "14", l: "Sets" },
      { v: "~55", l: "Minutes" },
    ],
    note: "Flat press leads as the primary mass builder, pec deck closes as a pump finisher. Leave 2 RIR on all compounds — consecutive training days make failure sets on Monday bleed into Tuesday shoulders.",
    exercises: [
      {
        num: "1",
        name: "Flat Barbell Bench Press",
        sets: "4 sets",
        reps: "6–8 reps",
        rir: "2 RIR",
        tags: [{ label: "compound first", type: "new" }],
        note: "Primary chest mass builder. Stop 2 reps short of failure — this is your heaviest session of the week and fatigue carries into Tuesday.",
        variant: "new",
      },
      {
        num: "2",
        name: "Dumbbell Incline Bench Press",
        sets: "3 sets",
        reps: "10–12 reps",
        rir: "1–2 RIR",
        tags: [{ label: "upper chest", type: "changed" }],
        note: "Upper chest + front delt. Use double progression: add reps each session until you hit 12, then add weight and drop back to 10.",
        variant: "changed",
      },
      {
        num: "3",
        name: "Lever Lying T-Bar Row",
        sets: "3 sets",
        reps: "8–10 reps",
        rir: "1–2 RIR",
        note: "Mid-back thickness. Full stretch at the bottom, row to lower chest not chin.",
      },
      {
        num: "4",
        name: "Cable Bar Lateral Pulldown",
        sets: "3 sets",
        reps: "10–12 reps",
        rir: "1–2 RIR",
        note: "Lat width. Initiate with the elbows, not the hands. Full stretch at the top.",
      },
      {
        num: "5",
        name: "Lever Pec Deck Fly",
        sets: "3 sets",
        reps: "12–15 reps",
        rir: "0–1 RIR",
        tags: [{ label: "finisher", type: "changed" }],
        note: "Isolation finisher — can push to 1 RIR or failure here as fatigue bleed-over to the next muscle group is minimal.",
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
    note: "Tricep pushdown removed — JM press is the stronger compound stimulus and triceps get a full second session Saturday. Bicep volume is now in the 10–16 set weekly optimal range per Pelland et al. (2026).",
    exercises: [
      {
        num: "1",
        name: "Dumbbell Seated Shoulder Press",
        sets: "3 sets",
        reps: "8–10 reps",
        rir: "2 RIR",
        note: "Primary overhead compound. Keep 2 RIR — shoulders are small and fatigue quickly, leaving something in the tank keeps quality high across all 6 exercises.",
      },
      {
        num: "2",
        name: "Cable One Arm Lateral Raise",
        sets: "3 sets",
        reps: "12–15 reps",
        rir: "1 RIR",
        note: "Medial delt width — the #1 aesthetic priority. Cable keeps constant tension through the full range. Lean slightly away from the stack.",
      },
      {
        num: "3",
        name: "Cable Standing Crossover High Reverse Fly",
        sets: "3 sets",
        reps: "15–20 reps",
        rir: "1 RIR",
        tags: [{ label: "sets added", type: "changed" }],
        note: "Rear delt — critical for shoulder roundness and posture balance. High rep range is appropriate; rear delts respond well to volume.",
        variant: "changed",
      },
      {
        num: "4",
        name: "Dumbbell Preacher Curl",
        sets: "3 sets",
        reps: "10–12 reps",
        rir: "1 RIR",
        note: "Bicep peak. Keep the elbow anchored on the pad throughout — any lifting of the elbow removes tension from the bicep.",
      },
      {
        num: "5",
        name: "Cable Hammer Curl (With Rope)",
        sets: "3 sets",
        reps: "12–15 reps",
        rir: "0–1 RIR",
        tags: [{ label: "+1 set", type: "changed" }],
        note: "Brachialis + brachioradialis — adds forearm and elbow thickness. Can push to near-failure as a late-session isolation move.",
        variant: "changed",
      },
      {
        num: "6",
        name: "Smith JM Bench Press",
        sets: "3 sets",
        reps: "10–12 reps",
        rir: "1–2 RIR",
        tags: [{ label: "+1 set", type: "changed" }],
        note: "Tricep compound — long head emphasis. Elbows stay tucked, bar path travels to lower chest. Saturday's tricep extension covers isolation.",
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
    note: "Trimmed from 8 → 5 by removing redundant movements (leg press and seated leg curl both covered Sunday). Quality over quantity — heavy compounds first, isolation last. Hamstring and quad weekly totals stay intact across both leg days.",
    exercises: [
      {
        num: "1",
        name: "Sled Full Hack Squat",
        sets: "4 sets",
        reps: "6–8 reps",
        rir: "2 RIR",
        tags: [{ label: "compound first", type: "changed" }],
        note: "Primary quad compound. Leave 2 RIR — this is your heaviest leg movement and you have 4 more exercises to go. Use double progression: hit 8 reps on all 4 sets, then add weight.",
        variant: "changed",
      },
      {
        num: "2",
        name: "Barbell Straight Leg Deadlift",
        sets: "3 sets",
        reps: "8–10 reps",
        rir: "1–2 RIR",
        note: "Hamstring + glute stretch under load. Hinge at the hip, maintain a neutral spine. The stretch at the bottom is where the growth stimulus happens — don't cut it short.",
      },
      {
        num: "3",
        name: "Dumbbell Bulgarian Split Squat",
        sets: "3 sets",
        reps: "10–12 reps/leg",
        rir: "1–2 RIR",
        tags: [{ label: "replaces adductor", type: "new" }],
        note: "Unilateral glute + quad. Rear foot on bench, front foot far enough forward that your shin is vertical at the bottom. Lean forward slightly for more glute.",
        variant: "new",
      },
      {
        num: "4",
        name: "Lever Standing Calf Raise",
        sets: "4 sets",
        reps: "12–15 reps",
        rir: "0–1 RIR",
        tags: [{ label: "+1 set", type: "changed" }],
        note: "Full ROM — pause 1 second at the bottom stretch, drive through the big toe. Calves are notoriously stubborn and respond to high volume and full stretch.",
        variant: "changed",
      },
      {
        num: "5",
        name: "Lever Leg Extension",
        sets: "3 sets",
        reps: "12–15 reps",
        rir: "0–1 RIR",
        tags: [{ label: "finisher", type: "changed" }],
        note: "Quad isolation finisher. Safe to push to near-failure here — no compound movements follow. Pause briefly at the top for maximum quad contraction.",
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
    note: "Cable Low Fly removed — chest gets flat + incline Monday; Saturday's incline press maintains frequency without redundant isolation. The freed slot is better used for back variety and shoulder volume.",
    exercises: [
      {
        num: "1",
        name: "Smith Incline Bench Press",
        sets: "3 sets",
        reps: "8–10 reps",
        rir: "2 RIR",
        note: "Upper chest compound opener. Smith machine allows controlled path — focus on the upper pec stretch at the bottom and squeeze at the top.",
      },
      {
        num: "2",
        name: "Chest-Supported Machine Row",
        sets: "3 sets",
        reps: "10–12 reps",
        rir: "1–2 RIR",
        tags: [{ label: "replaces T-Bar Row", type: "new" }],
        note: "Different angle from Monday's T-Bar Row — targets mid-back and rhomboids. Chest support removes lower back from the equation, allowing full focus on the pull.",
        variant: "new",
      },
      {
        num: "3",
        name: "Pull-Ups (or Weighted Pull-Ups)",
        sets: "3 sets",
        reps: "6–10 reps",
        rir: "1–2 RIR",
        tags: [{ label: "V-taper priority", type: "new" }],
        note: "Best lat builder available. Full hang at the bottom, chin over bar at the top. Once bodyweight for 10 reps is easy, add a weight belt. Use a resistance band if needed.",
        variant: "new",
      },
      {
        num: "4",
        name: "Dumbbell Lateral Raise",
        sets: "4 sets",
        reps: "12–15 reps",
        rir: "1 RIR",
        tags: [{ label: "+1 set", type: "changed" }],
        note: "Medial delt — second hit of the week. 4 sets here + 3 Tuesday = 7 weekly sets. Lead with the elbow, not the hand. Slight lean away from the working side increases ROM.",
        variant: "changed",
      },
      {
        num: "5",
        name: "Lever Preacher Curl",
        sets: "3 sets",
        reps: "10–12 reps",
        rir: "1 RIR",
        note: "Second bicep session of the week — great for frequency-driven hypertrophy. Different machine vs Tuesday's dumbbell preacher gives a slightly different stimulus.",
      },
      {
        num: "6",
        name: "Tricep Extension (Cable or EZ-bar)",
        sets: "3 sets",
        reps: "12–15 reps",
        rir: "0–1 RIR",
        note: "Overhead position for maximum long head stretch — the biggest and most visible tricep head. Can push to near-failure as the session's final isolation move.",
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
    note: "Hip thrust anchored at 4 sets — previously had no set count and was the biggest gap in the program. Glute weekly volume now ~12 sets across both leg days, inside the 10–16 optimal range.",
    superset: {
      label: "Superset — time-efficient, non-competing",
      exercises: [
        {
          num: "A",
          name: "Leg Press",
          sets: "4 sets",
          reps: "10–12 reps",
          rir: "1–2 RIR",
          ssItem: true,
        },
        {
          num: "B",
          name: "Sled 45 Calf Press",
          sets: "4 sets",
          reps: "15–20 reps",
          rir: "0–1 RIR",
          note: "Go directly into calf press after each leg press set — quads rest while calves work. Rest 90s after both.",
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
        rir: "1–2 RIR",
        note: "Torso upright = quad emphasis. Torso forward = glute emphasis. Pick a consistent stance and apply double progression — add reps, then add weight.",
      },
      {
        num: "3",
        name: "Lever Hip Thrust (Plate Loaded)",
        sets: "4 sets",
        reps: "10–12 reps",
        rir: "1–2 RIR",
        tags: [{ label: "sets added", type: "changed" }],
        note: "Best glute isolation in the program. Shoulders on bench, chin tucked, drive through the heel. Pause 1 second at the top with maximum glute contraction — this is not a speed exercise.",
        variant: "changed",
      },
      {
        num: "4",
        name: "Barbell Straight Leg Deadlift",
        sets: "3 sets",
        reps: "8–10 reps",
        rir: "1–2 RIR",
        tags: [{ label: "sets added", type: "changed" }],
        note: "Second hamstring + glute hinge of the week. Was missing set count — now anchored at 3 sets. Slightly lighter than Thursday's version since it follows hip thrusts.",
        variant: "changed",
      },
      {
        num: "5",
        name: "Lever Lying Leg Curl",
        sets: "3 sets",
        reps: "10–12 reps",
        rir: "1 RIR",
        note: "Lying vs. seated curl — slightly more short-head emphasis. Different position than Thursday covers the hamstring more completely across the week.",
      },
      {
        num: "6",
        name: "Lever Leg Extension",
        sets: "3 sets",
        reps: "12–15 reps",
        rir: "0–1 RIR",
        note: "Quad finisher. Toes pointed slightly inward shifts emphasis to the outer quad (vastus lateralis) — a key aesthetic muscle for leg separation.",
      },
      {
        num: "7",
        name: "Lever Seated Crunch",
        sets: "3 sets",
        reps: "15–20 reps",
        rir: "0–1 RIR",
        note: "Core finisher. Control the eccentric — don't let the weight pull you back. Weekly ab frequency of twice (Thu crunch removed, now only Sun) is sufficient.",
      },
    ],
  },
];

// ─── GUIDE DATA ───────────────────────────────────────────────────────────────

const GUIDE_SECTIONS = [
  {
    icon: "📈",
    title: "Progressive overload — double progression",
    color: "#c8f060",
    colorDim: "rgba(200,240,96,0.1)",
    colorBorder: "rgba(200,240,96,0.25)",
    body: "For every exercise, work within a rep range (e.g. 8–12). Each session, try to add 1–2 reps. Once you hit the top of the range on all sets, add weight (2.5–5kg) and drop back to the bottom. This is double progression — the most sustainable model for intermediates.",
    detail: "Example — Hack Squat: Session 1: 4×6 @ 100kg → Session 3: 4×8 @ 100kg → Session 4: 4×6 @ 105kg",
    source: "Plotkin et al., 2022 · Chaves et al., 2024",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9528903/",
  },
  {
    icon: "🎯",
    title: "Reps in reserve (RIR) — don't train to failure on compounds",
    color: "#60b8f0",
    colorDim: "rgba(96,184,240,0.1)",
    colorBorder: "rgba(96,184,240,0.25)",
    body: "Refalo et al. (2025) found training to failure causes 25% more neuromuscular fatigue than stopping at 1–2 RIR, with recovery incomplete at 24h. On a 5-day program this compounds across the week. Target: 2 RIR on all compound openers, 1 RIR on accessory work, 0–1 RIR on isolation finishers only.",
    detail: "Similar hypertrophy. Lower fatigue. Better performance across the full week.",
    source: "Refalo et al., 2025 · Coleman et al., 2025",
    sourceUrl: "https://onlinelibrary.wiley.com/doi/full/10.1002/ejsc.12266",
  },
  {
    icon: "🔄",
    title: "Deload every 4–6 weeks — scheduled, not reactive",
    color: "#f0a840",
    colorDim: "rgba(240,168,64,0.1)",
    colorBorder: "rgba(240,168,64,0.25)",
    body: "Coleman et al. (2024, Schoenfeld lab, PeerJ) confirmed a 1-week deload has zero negative effect on muscle size or endurance, and may re-sensitise muscle to anabolic stimuli. Keep the same exercises and weights — cut sets by ~50% only. Don't skip it just because you feel fine.",
    detail: "Deload week: same weight, same exercises, ~50% of your normal sets. Train normally otherwise.",
    source: "Coleman et al., 2024, PeerJ",
    sourceUrl: "https://peerj.com/articles/16777/",
  },
  {
    icon: "🥩",
    title: "Protein — 1.6–2.2g per kg bodyweight daily",
    color: "#f06060",
    colorDim: "rgba(240,96,96,0.1)",
    colorBorder: "rgba(240,96,96,0.25)",
    body: "At 163 lbs (~74kg) your daily target is 118–163g minimum, with 148g (2.0g/kg) being the evidence-backed optimum. Mănescu et al. (2025) confirmed protein benefits plateau around 2.0–2.2g/kg. Distribute across 4–5 meals (~30–40g each) — evenly spread protein produces 25% higher 24h muscle protein synthesis vs. a skewed pattern.",
    detail: "Targets at 74kg: Minimum 118g · Optimal 148g · Upper end 178g · Per meal (4x) ~37–45g",
    source: "Mănescu et al., 2025 · Morton et al., 2018",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12655760/",
  },
  {
    icon: "💊",
    title: "Creatine monohydrate — 3–5g daily",
    color: "#a78cf0",
    colorDim: "rgba(167,140,240,0.1)",
    colorBorder: "rgba(167,140,240,0.25)",
    body: "The single supplement with strong morphological (ultrasound/MRI) evidence for hypertrophy. Mănescu et al. (2025) confirmed measurable increases in muscle thickness across 46 trials at 3–5g/day. No loading phase needed. Take any time — consistency matters, not timing. Everything else (BCAAs, HMB, pre-workout) has far weaker evidence.",
    detail: "3–5g daily. Any brand of creatine monohydrate. Takes 3–4 weeks to fully saturate.",
    source: "Mănescu et al., 2025 · Burke et al., 2023",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12655760/",
  },
  {
    icon: "😴",
    title: "Sleep 7–9 hours — non-negotiable",
    color: "#5dcaa5",
    colorDim: "rgba(93,202,165,0.1)",
    colorBorder: "rgba(93,202,165,0.25)",
    body: "Kaczmarek et al. (2025) confirmed insufficient sleep elevates cortisol and directly suppresses testosterone and growth hormone — exactly the hormonal environment that blocks hypertrophy. Easow et al. (2025) systematic review confirmed sleep deprivation significantly impairs strength performance. On a 5-day program, chronic under-recovery limits every adaptation you're training for.",
    detail: "Consistent bedtime (±30 min) matters as much as total hours. Prioritise sleep hygiene on Sunday and Monday nights especially.",
    source: "Kaczmarek et al., 2025 · Easow et al., 2025",
    sourceUrl: "https://www.mdpi.com/2077-0383/14/21/7606",
  },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const C = {
  bg: "#0F1008",
  surface: "#1C1E0F",
  surface2: "#181A0C",
  border: "#2A2D18",
  border2: "#3A3F20",
  text: "#F5F5E8",
  muted: "#8A8F6A",
  dim: "#4A4F2A",
  accent: "#E8FF47",
  accentDim: "rgba(232,255,71,0.1)",
  accentBorder: "rgba(232,255,71,0.3)",
  warn: "#FF9A47",
  warnDim: "rgba(255,154,71,0.1)",
  warnBorder: "rgba(255,154,71,0.25)",
  blue: "#47D4FF",
  blueDim: "rgba(71,212,255,0.1)",
  blueBorder: "rgba(71,212,255,0.3)",
};

const tagStyles = {
  changed: { background: C.accentDim, color: C.accent, border: `1px solid ${C.accentBorder}` },
  new: { background: C.blueDim, color: C.blue, border: `1px solid ${C.blueBorder}` },
};

const numStyles = {
  default: { background: C.surface2, border: `1px solid ${C.border2}`, color: C.muted },
  changed: { background: C.accentDim, border: `1px solid ${C.accentBorder}`, color: C.accent },
  new: { background: C.blueDim, border: `1px solid ${C.blueBorder}`, color: C.blue },
  ss: { background: C.warnDim, border: `1px solid ${C.warnBorder}`, color: C.warn },
};

const cardBg = {
  default: C.surface,
  changed: `linear-gradient(135deg, ${C.surface} 0%, rgba(232,255,71,0.04) 100%)`,
  new: `linear-gradient(135deg, ${C.surface} 0%, rgba(71,212,255,0.04) 100%)`,
};

const cardBorder = {
  default: C.border,
  changed: C.accentBorder,
  new: C.blueBorder,
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Tag({ label, type }) {
  return (
    <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, ...tagStyles[type] }}>
      {label}
    </span>
  );
}

function RirBadge({ rir }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: "1px 7px",
        borderRadius: 4,
        background: "rgba(167,140,240,0.12)",
        color: "#a78cf0",
        border: "1px solid rgba(167,140,240,0.3)",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {rir}
    </span>
  );
}

function ExCard({ ex, ssItem = false }) {
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
          fontFamily: "'Space Mono', monospace",
          flexShrink: 0,
          ...(ssItem ? numStyles.ss : numStyles[ex.variant || "default"]),
        }}
      >
        {ex.num}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14, color: C.text }}>{ex.name}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: "'Space Mono', monospace",
              color: C.muted,
              background: C.surface2,
              padding: "2px 8px",
              borderRadius: 4,
              border: `1px solid ${C.border}`,
            }}
          >
            {ex.sets}
          </span>
          <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: C.muted }}>
            {ex.reps}
          </span>
          {ex.rir && <RirBadge rir={ex.rir} />}
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
          fontFamily: "'Space Mono', monospace",
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

function GuideCard({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${section.colorBorder}`,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>{section.icon}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>
          {section.title}
        </span>
        <span style={{ color: C.muted, fontSize: 18, flexShrink: 0, transition: "transform 0.2s", display: "block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ↓
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "0 16px 16px",
            borderTop: `1px solid ${section.colorBorder}`,
          }}
        >
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "12px 0 10px" }}>
            {section.body}
          </p>
          <div
            style={{
              background: section.colorDim,
              border: `1px solid ${section.colorBorder}`,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              color: C.text,
              fontFamily: "'Space Mono', monospace",
              lineHeight: 1.5,
              marginBottom: 10,
            }}
          >
            {section.detail}
          </div>
          <a
            href={section.sourceUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: C.blue,
              textDecoration: "none",
              background: C.blueDim,
              padding: "2px 8px",
              borderRadius: 4,
              border: `1px solid ${C.blueBorder}`,
            }}
          >
            ↗ {section.source}
          </a>
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

function useLocalStorage(key, init) {
  const [v, sv] = useState(() => {
    try { const s = localStorage.getItem(key); return s !== null ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const set = (next) => {
    sv(prev => {
      const val = typeof next === "function" ? next(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
      return val;
    });
  };
  return [v, set];
}

export default function WorkoutProgram() {
  const [activeTab, setActiveTab] = useLocalStorage("wp-tab", "program");
  const [activeDay, setActiveDay] = useLocalStorage("wp-day", 0);
  const navRef = useRef(null);

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

  const tabStyle = (id) => ({
    padding: "7px 16px",
    borderRadius: 999,
    border: `1px solid ${activeTab === id ? C.accentBorder : C.border2}`,
    background: activeTab === id ? C.accentDim : "transparent",
    color: activeTab === id ? C.accent : C.muted,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: activeTab === id ? 500 : 400,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap"
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
          paddingBottom: activeTab === "program" ? 80 : 24,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            padding: "20px 16px 14px",
            borderBottom: `1px solid ${C.border}`,
            position: "sticky",
            top: 0,
            background: C.surface,
            zIndex: 100,
          }}
        >
          <h1 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 10px", color: C.text }}>
            Summer Aesthetic Program
          </h1>
          {/* Top-level tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            <button style={tabStyle("program")} onClick={() => setActiveTab("program")}>
              Program
            </button>
            <button style={tabStyle("guide")} onClick={() => setActiveTab("guide")}>
              Research guide
            </button>
          </div>
        </div>

        {/* ══ PROGRAM TAB ══ */}
        {activeTab === "program" && (
          <>
            {/* Day nav */}
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
                top: 77,
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

            {/* Legend */}
            <div style={{ display: "flex", gap: 12, padding: "12px 16px 4px", flexWrap: "wrap" }}>
              {[
                { color: "rgba(200,240,96,0.5)", border: C.accentBorder, label: "Reordered / volume adjusted" },
                { color: "rgba(96,184,240,0.5)", border: C.blueBorder, label: "New exercise" },
                { color: "rgba(167,140,240,0.4)", border: "rgba(167,140,240,0.3)", label: "RIR target" },
                { color: "rgba(240,168,64,0.4)", border: C.warnBorder, label: "Superset" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color, border: `1px solid ${l.border}` }} />
                  <span style={{ fontSize: 11, color: C.muted }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Session header */}
            <div style={{ padding: "18px 16px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                  {day.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.2, color: C.text }}>
                  {day.title}
                </div>
              </div>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontFamily: "'Space Mono', monospace",
                  marginTop: 4,
                  ...(day.badgeType === "ok"
                    ? { background: C.accentDim, color: C.accent, border: `1px solid ${C.accentBorder}` }
                    : { background: C.warnDim, color: C.warn, border: `1px solid ${C.warnBorder}` }),
                }}
              >
                {day.badge}
              </span>
            </div>

            {/* Stats chips */}
            <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", overflowX: "auto", scrollbarWidth: "none" }}>
              {day.stats.map((s) => (
                <div key={s.l} style={{ flexShrink: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.accent, fontFamily: "'Space Mono', monospace" }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Exercises label */}
            <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 16px 8px" }}>
              Exercises
            </div>

            {/* Exercise list */}
            <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {day.superset && <SupersetGroup superset={day.superset} />}
              {day.exercises.map((ex, i) => <ExCard key={i} ex={ex} />)}
            </div>

            {/* Session note */}
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

            {/* Bottom nav */}
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
          </>
        )}

        {/* ══ GUIDE TAB ══ */}
        {activeTab === "guide" && (
          <div style={{ padding: "20px 16px" }}>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20, borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
              Evidence-based principles underpinning this program. Tap each section to expand. All findings are sourced from peer-reviewed research published 2022–2026.
            </p>
            {GUIDE_SECTIONS.map((s, i) => <GuideCard key={i} section={s} />)}
            <p style={{ fontSize: 11, color: C.dim, textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
              Sources: Plotkin et al. 2022 · Chaves et al. 2024 · Refalo et al. 2023/2025 · Coleman et al. 2024/2025 · Pelland et al. 2026 · Mănescu et al. 2025 · Kaczmarek et al. 2025 · Easow et al. 2025
            </p>
          </div>
        )}
      </div>
    </>
  );
}