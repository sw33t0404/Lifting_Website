import { useState } from "react";

const ACCENT = "#E8FF47";
const DARK = "#0F1008";
const MID = "#1C1E0F";
const CARD = "#181A0C";
const MUTED = "#8A8F6A";
const WHITE = "#F5F5E8";

const macroTarget = { kcal: 2900, protein: 182, carbs: 399, fat: 64 };

const meals = {
  week1: [
    {
      day: "Mon",
      breakfast: { name: "Overnight Oats + Eggs", kcal: 620, p: 38, c: 72, f: 14 },
      lunch: { name: "Chicken Rice Bowl", kcal: 750, p: 52, c: 88, f: 15 },
      dinner: { name: "Salmon + Sweet Potato + Broccoli", kcal: 740, p: 46, c: 72, f: 22 },
      snack: { name: "Greek Yogurt + Banana + Honey", kcal: 340, p: 22, c: 56, f: 4 },
    },
    {
      day: "Tue",
      breakfast: { name: "Omelette + Sourdough Toast", kcal: 580, p: 34, c: 56, f: 18 },
      lunch: { name: "Tuna Pasta (passata sauce)", kcal: 720, p: 48, c: 86, f: 12 },
      dinner: { name: "Turkey Stir-Fry + Brown Rice", kcal: 760, p: 54, c: 84, f: 16 },
      snack: { name: "Cottage Cheese + Berries", kcal: 290, p: 28, c: 32, f: 4 },
    },
    {
      day: "Wed",
      breakfast: { name: "Smoothie (banana, oats, whey, milk)", kcal: 640, p: 42, c: 80, f: 12 },
      lunch: { name: "Chicken Wrap + Avocado", kcal: 730, p: 46, c: 74, f: 22 },
      dinner: { name: "Baked Cod + Quinoa + Green Beans", kcal: 720, p: 52, c: 72, f: 14 },
      snack: { name: "Rice Cakes + Peanut Butter", kcal: 320, p: 10, c: 38, f: 14 },
    },
    {
      day: "Thu",
      breakfast: { name: "Overnight Oats + Eggs", kcal: 620, p: 38, c: 72, f: 14 },
      lunch: { name: "Beef + Potato Stew (passata base)", kcal: 760, p: 50, c: 80, f: 18 },
      dinner: { name: "Chicken Thighs + Roasted Veg + Rice", kcal: 770, p: 52, c: 82, f: 20 },
      snack: { name: "Greek Yogurt + Mixed Nuts", kcal: 340, p: 20, c: 22, f: 18 },
    },
    {
      day: "Fri",
      breakfast: { name: "Omelette + Sourdough Toast", kcal: 580, p: 34, c: 56, f: 18 },
      lunch: { name: "Tuna Rice Bowl + Edamame", kcal: 740, p: 52, c: 80, f: 14 },
      dinner: { name: "Salmon Stir-Fry + Noodles", kcal: 760, p: 46, c: 82, f: 22 },
      snack: { name: "Banana + Whey Shake", kcal: 340, p: 30, c: 42, f: 4 },
    },
    {
      day: "Sat",
      breakfast: { name: "Pancakes (oat flour) + Maple Syrup + Eggs", kcal: 680, p: 36, c: 88, f: 16 },
      lunch: { name: "Chicken Caesar Wrap", kcal: 720, p: 46, c: 72, f: 20 },
      dinner: { name: "Lean Beef Mince Bolognese (passata)", kcal: 800, p: 54, c: 86, f: 18 },
      snack: { name: "Cottage Cheese + Berries", kcal: 290, p: 28, c: 32, f: 4 },
    },
    {
      day: "Sun",
      breakfast: { name: "Smoothie (banana, oats, whey, milk)", kcal: 640, p: 42, c: 80, f: 12 },
      lunch: { name: "Meal Prep: Rice + Chicken + Broccoli", kcal: 750, p: 54, c: 80, f: 14 },
      dinner: { name: "Baked Salmon + Sweet Potato Mash", kcal: 760, p: 48, c: 72, f: 24 },
      snack: { name: "Rice Cakes + Peanut Butter", kcal: 320, p: 10, c: 38, f: 14 },
    },
  ],
  week2: [
    {
      day: "Mon",
      breakfast: { name: "Overnight Oats + Boiled Eggs", kcal: 620, p: 38, c: 72, f: 14 },
      lunch: { name: "Turkey Rice Bowl + Spinach", kcal: 740, p: 52, c: 82, f: 14 },
      dinner: { name: "Cod + Quinoa + Roasted Peppers", kcal: 720, p: 50, c: 74, f: 14 },
      snack: { name: "Greek Yogurt + Banana", kcal: 310, p: 20, c: 46, f: 4 },
    },
    {
      day: "Tue",
      breakfast: { name: "Egg Muffins + Whole-grain Toast", kcal: 580, p: 36, c: 54, f: 18 },
      lunch: { name: "Chicken Stir-Fry + Brown Rice", kcal: 760, p: 52, c: 86, f: 16 },
      dinner: { name: "Beef Taco Bowl (passata salsa, no tomato chunks)", kcal: 800, p: 52, c: 84, f: 20 },
      snack: { name: "Whey Shake + Oats", kcal: 360, p: 32, c: 46, f: 6 },
    },
    {
      day: "Wed",
      breakfast: { name: "Smoothie (mango, spinach, whey, oats)", kcal: 620, p: 38, c: 78, f: 10 },
      lunch: { name: "Tuna Pasta (passata)", kcal: 720, p: 48, c: 86, f: 12 },
      dinner: { name: "Chicken Thigh + Sweet Potato + Green Beans", kcal: 760, p: 52, c: 78, f: 20 },
      snack: { name: "Cottage Cheese + Honey + Walnuts", kcal: 320, p: 22, c: 22, f: 14 },
    },
    {
      day: "Thu",
      breakfast: { name: "Overnight Oats + Boiled Eggs", kcal: 620, p: 38, c: 72, f: 14 },
      lunch: { name: "Salmon + Rice + Edamame Bowl", kcal: 760, p: 50, c: 82, f: 20 },
      dinner: { name: "Turkey Mince + Pasta (passata sauce)", kcal: 790, p: 54, c: 88, f: 16 },
      snack: { name: "Greek Yogurt + Berries", kcal: 280, p: 20, c: 32, f: 4 },
    },
    {
      day: "Fri",
      breakfast: { name: "Egg Muffins + Whole-grain Toast", kcal: 580, p: 36, c: 54, f: 18 },
      lunch: { name: "Chicken Wrap + Avocado", kcal: 730, p: 46, c: 74, f: 22 },
      dinner: { name: "Baked Salmon + Brown Rice + Broccoli", kcal: 760, p: 48, c: 76, f: 22 },
      snack: { name: "Banana + Peanut Butter", kcal: 310, p: 10, c: 40, f: 14 },
    },
    {
      day: "Sat",
      breakfast: { name: "Pancakes (oat flour) + Eggs + Fruit", kcal: 680, p: 36, c: 88, f: 16 },
      lunch: { name: "Beef + Potato Hash (passata base)", kcal: 770, p: 50, c: 82, f: 18 },
      dinner: { name: "Chicken Thigh + Quinoa + Roasted Veg", kcal: 770, p: 52, c: 80, f: 20 },
      snack: { name: "Whey Shake + Rice Cakes", kcal: 340, p: 30, c: 36, f: 6 },
    },
    {
      day: "Sun",
      breakfast: { name: "Smoothie (banana, oats, whey, milk)", kcal: 640, p: 42, c: 80, f: 12 },
      lunch: { name: "Meal Prep: Turkey + Rice + Broccoli", kcal: 750, p: 52, c: 82, f: 14 },
      dinner: { name: "Salmon Pasta (passata + capers + olives)", kcal: 780, p: 48, c: 84, f: 20 },
      snack: { name: "Greek Yogurt + Mixed Nuts", kcal: 340, p: 20, c: 22, f: 18 },
    },
  ],
};

const shoppingList = {
  "🥩 Proteins": [
    "Chicken breast (1.5 kg) × 2",
    "Chicken thighs, boneless (1 kg) × 2",
    "Salmon fillets (6 × 150g)",
    "Cod fillets (4 × 150g)",
    "Tuna in water, canned (12 cans)",
    "Lean beef mince (500g) × 2",
    "Turkey mince (500g) × 2",
    "Eggs (24-pack) × 2",
    "Greek yogurt, plain (1 kg) × 3",
    "Cottage cheese (500g) × 3",
    "Whey protein powder (enough for 14 scoops)",
    "Edamame, frozen (400g) × 2",
  ],
  "🍚 Carbs & Grains": [
    "White/brown rice (2 kg bag)",
    "Rolled oats (1.5 kg)",
    "Oat flour (500g)",
    "Pasta — penne & spaghetti (1 kg each)",
    "Quinoa (500g)",
    "Sourdough bread (2 loaves)",
    "Whole-grain wraps (16-pack)",
    "Rice cakes (2 packs)",
    "Noodles — egg or udon (400g)",
    "Sweet potatoes (1.5 kg)",
    "Potatoes (1 kg)",
  ],
  "🥦 Vegetables": [
    "Broccoli, fresh or frozen (1 kg) × 2",
    "Spinach, fresh (300g bags) × 2",
    "Green beans, frozen (500g) × 2",
    "Mixed peppers (6 pack)",
    "Courgette (4)",
    "Carrot (500g bag)",
    "Lettuce / mixed salad leaves (2 bags)",
    "Avocados (6)",
    "Spring onions (bunch × 2)",
    "Garlic (2 bulbs)",
    "Ginger root (1 piece)",
  ],
  "🍌 Fruit": [
    "Bananas (2 bunches, ~14 bananas)",
    "Mixed berries, frozen (1 kg)",
    "Mango, frozen (400g)",
    "Lemons (4)",
  ],
  "🧈 Fats & Extras": [
    "Peanut butter, natural (500g jar)",
    "Mixed nuts (400g bag)",
    "Walnuts (200g)",
    "Olive oil (500ml)",
    "Passata (carton × 4) — smooth, no chunks",
    "Tomato paste (tube × 2)",
    "Soy sauce / tamari (bottle)",
    "Capers (jar)",
    "Olives (jar)",
    "Honey (jar)",
    "Maple syrup (small bottle)",
    "Canned coconut milk (2 cans)",
    "Whole milk (2L) × 2",
  ],
  "🧂 Pantry Staples": [
    "Chicken / veg stock cubes",
    "Cumin, paprika, chilli flakes, turmeric, oregano",
    "Salt & black pepper",
    "Baking powder (for pancakes)",
    "Low-sodium soy sauce",
  ],
};

const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
const mealLabels = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };
const mealColors = { breakfast: "#E8FF47", lunch: "#7EFF9A", dinner: "#FF9A47", snack: "#47D4FF" };

const totalDay = (day) => {
  const keys = ["breakfast", "lunch", "dinner", "snack"];
  return {
    kcal: keys.reduce((s, k) => s + day[k].kcal, 0),
    p: keys.reduce((s, k) => s + day[k].p, 0),
    c: keys.reduce((s, k) => s + day[k].c, 0),
    f: keys.reduce((s, k) => s + day[k].f, 0),
  };
};

function MacroBar({ label, val, max, color }) {
  const pct = Math.min((val / max) * 100, 100);
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED, marginBottom: 3, fontFamily: "'Space Mono', monospace" }}>
        <span>{label}</span>
        <span style={{ color: WHITE }}>{val}g</span>
      </div>
      <div style={{ height: 5, background: "#2A2D18", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function DayCard({ day, isActive, onClick }) {
  const totals = totalDay(day);
  return (
    <button
      onClick={onClick}
      style={{
        background: isActive ? ACCENT : CARD,
        border: `1px solid ${isActive ? ACCENT : "#2A2D18"}`,
        borderRadius: 12,
        padding: "10px 14px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s",
        minWidth: 72,
      }}
    >
      <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, color: isActive ? DARK : WHITE }}>{day.day}</div>
      <div style={{ fontSize: 11, color: isActive ? "#666" : MUTED, marginTop: 2 }}>{totals.kcal} kcal</div>
    </button>
  );
}

export default function MealPlan() {
  const [week, setWeek] = useState("week1");
  const [activeDay, setActiveDay] = useState(0);
  const [tab, setTab] = useState("plan");
  const [checkedItems, setCheckedItems] = useState({});

  const weekDays = meals[week];
  const day = weekDays[activeDay];
  const totals = totalDay(day);

  const toggleCheck = (cat, i) => {
    const key = `${cat}-${i}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: WHITE }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: MID, borderBottom: `1px solid #2A2D18`, padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: ACCENT, margin: 0 }}>BI-WEEKLY</h1>
            <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: WHITE, margin: 0 }}>PERFORMANCE PLAN</h1>
          </div>
          <p style={{ color: MUTED, fontSize: 13, margin: "6px 0 16px", letterSpacing: 0.3 }}>
            ~2,900 kcal · 182g protein · 399g carbs · 64g fat — athletic performance macro split
          </p>
          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 8 }}>
            {["plan", "shopping"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 20,
                  border: "none",
                  background: tab === t ? ACCENT : "#2A2D18",
                  color: tab === t ? DARK : MUTED,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  transition: "all 0.2s",
                }}
              >
                {t === "plan" ? "Meal Plan" : "Shopping List"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 20px 40px" }}>
        {tab === "plan" && (
          <>
            {/* Week selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {["week1", "week2"].map((w, i) => (
                <button
                  key={w}
                  onClick={() => { setWeek(w); setActiveDay(0); }}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 8,
                    border: `1px solid ${week === w ? ACCENT : "#2A2D18"}`,
                    background: week === w ? "transparent" : "transparent",
                    color: week === w ? ACCENT : MUTED,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Week {i + 1}
                </button>
              ))}
            </div>

            {/* Day strip */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
              {weekDays.map((d, i) => (
                <DayCard key={d.day} day={d} isActive={i === activeDay} onClick={() => setActiveDay(i)} />
              ))}
            </div>

            {/* Daily macros summary */}
            <div style={{ background: CARD, borderRadius: 14, padding: "16px 20px", marginBottom: 20, border: "1px solid #2A2D18" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: MUTED }}>TODAY'S TOTALS</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, color: ACCENT, fontWeight: 700 }}>{totals.kcal} kcal</span>
              </div>
              <MacroBar label="Protein" val={totals.p} max={macroTarget.protein} color="#E8FF47" />
              <MacroBar label="Carbs" val={totals.c} max={macroTarget.carbs} color="#7EFF9A" />
              <MacroBar label="Fat" val={totals.f} max={macroTarget.fat} color="#FF9A47" />
            </div>

            {/* Meals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mealTypes.map((type) => {
                const meal = day[type];
                const color = mealColors[type];
                return (
                  <div key={type} style={{ background: CARD, borderRadius: 14, padding: "14px 18px", border: "1px solid #2A2D18", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ background: color, color: DARK, fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono', monospace", padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>
                          {mealLabels[type]}
                        </span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: WHITE, marginBottom: 6 }}>{meal.name}</div>
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: MUTED, fontFamily: "'Space Mono', monospace" }}>
                        <span style={{ color }}>{meal.kcal} kcal</span>
                        <span>P: {meal.p}g</span>
                        <span>C: {meal.c}g</span>
                        <span>F: {meal.f}g</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "shopping" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: MUTED, fontSize: 13, margin: "0 0 16px" }}>
                Everything you need for 14 days. Tick items as you add them to your basket.
              </p>
            </div>
            {Object.entries(shoppingList).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: ACCENT, marginBottom: 10, letterSpacing: 1 }}>
                  {cat}
                </div>
                <div style={{ background: CARD, borderRadius: 14, border: "1px solid #2A2D18", overflow: "hidden" }}>
                  {items.map((item, i) => {
                    const key = `${cat}-${i}`;
                    const checked = !!checkedItems[key];
                    return (
                      <div
                        key={i}
                        onClick={() => toggleCheck(cat, i)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "11px 16px",
                          borderBottom: i < items.length - 1 ? "1px solid #1E2010" : "none",
                          cursor: "pointer",
                          transition: "background 0.15s",
                          background: checked ? "#1E2212" : "transparent",
                        }}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: 5,
                          border: `2px solid ${checked ? ACCENT : "#3A3F20"}`,
                          background: checked ? ACCENT : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, transition: "all 0.2s"
                        }}>
                          {checked && <span style={{ fontSize: 11, color: DARK, fontWeight: 900 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: 14, color: checked ? MUTED : WHITE, textDecoration: checked ? "line-through" : "none", transition: "all 0.2s" }}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Note */}
            <div style={{ background: "#1A1C0F", border: `1px solid ${ACCENT}22`, borderRadius: 12, padding: "14px 18px", marginTop: 8 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: ACCENT, marginBottom: 6 }}>📌 NOTE</div>
              <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.7 }}>
                All tomato-based sauces use <strong style={{ color: WHITE }}>passata or tomato paste only</strong> — no whole or chunky tomatoes. Protein intake is set at ~1.6–2g/kg for a ~90kg athlete, consistent with ACSM recommendations for athletic performance. Adjust quantities if your bodyweight differs significantly.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
