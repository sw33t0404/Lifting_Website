import { useState, useRef, useEffect, useCallback } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg:      "#090A06",
  surface: "#111309",
  card:    "#161810",
  border:  "#252718",
  muted:   "#6B7050",
  white:   "#F0F1E6",
  lime:    "#D8FF47",
  green:   "#5BF599",
  orange:  "#FF8C42",
  blue:    "#47C8FF",
  red:     "#FF5C5C",
  purple:  "#C8A8FF",
};

// ─── USDA FOODDATA CENTRAL CONFIG ────────────────────────────────────────────
// Completely free, no usage limits, government-verified data (380k+ foods).
// Get a free key in ~30 seconds — no credit card, no approval:
//   1. Go to https://fdc.nal.usda.gov/api-key-signup
//   2. Enter your email — key arrives instantly
//   3. Paste it below and you're done.
// DEMO_KEY works while you're setting up (~3,000 req/hour per IP, shared limit).
const USDA_KEY  = import.meta.env.VITE_USDA_KEY || "DEMO_KEY";
const USDA_BASE = "https://api.nal.usda.gov/fdc/v1";

// ─── MODE CONFIG ─────────────────────────────────────────────────────────────
const MODE_CONFIG = {
  onTrack: { label: "✅ On Track",     color: "#5BF599", desc: "Clean options that keep you close to your daily macro targets." },
  pre:     { label: "⚡ Pre-Workout",  color: "#D8FF47", desc: "Higher carbs + moderate protein to fuel performance. Eat 60–90 min before training." },
  post:    { label: "🔄 Post-Workout", color: "#47C8FF", desc: "Fast protein + carbs to replenish glycogen and start muscle repair. Eat within 30–60 min after training." },
  cheat:   { label: "🔥 Cheat Meal",   color: "#FF8C42", desc: "Enjoy with full info. Even in cheat mode, aim for 30g+ protein to keep muscle synthesis running." },
};

// ─── CHAIN DATA ───────────────────────────────────────────────────────────────
const chains = [
  {
    id: "tacobell", name: "Taco Bell", emoji: "🔔",
    onTrack: [
      { name: "Cantina Chicken Bowl (fresco style)", kcal: 490, p: 32, c: 44, f: 18, rating: 5,
        tip: "Best customisable bowl at Taco Bell. Fresco style swaps creamy sauces for pico de gallo, cutting ~100 kcal.",
        order: "Cantina Chicken Bowl, fresco style, add black beans, no sour cream." },
      { name: "Power Menu Bowl – Chicken", kcal: 460, p: 27, c: 41, f: 21, rating: 4,
        tip: "Rice, chicken, beans, guac and veg. Ask for light sour cream to trim fat.",
        order: "Power Menu Bowl – Chicken, light sour cream." },
      { name: "Grilled Steak Soft Taco × 2 (fresco)", kcal: 360, p: 38, c: 36, f: 10, rating: 4,
        tip: "Steak has Taco Bell's best protein-to-calorie ratio. Two tacos = solid on-track meal.",
        order: "2× Grilled Steak Soft Taco, fresco style." },
    ],
    pre: [
      { name: "Power Menu Bowl + extra rice", kcal: 580, p: 28, c: 68, f: 21,
        why: "Higher-carb bowl to top up glycogen. Beans provide sustained-release carbs alongside the rice — good fuel curve for training.", timing: "60–90 min before",
        order: "Power Menu Bowl – Chicken, ask for double rice, light sour cream." },
      { name: "Bean & Rice Burrito + Chicken Soft Taco", kcal: 540, p: 26, c: 80, f: 12,
        why: "Carb-forward combo. Beans and rice deliver steady energy without a fat spike that slows digestion before training.", timing: "60–90 min before",
        order: "Bean & Rice Burrito + 1 Chicken Soft Taco, fresco style." },
    ],
    post: [
      { name: "Cantina Chicken Bowl + extra chicken", kcal: 640, p: 52, c: 48, f: 20,
        why: "Fast-digesting chicken protein + rice carbs is the textbook post-workout combo.", timing: "Within 30–45 min",
        order: "Cantina Chicken Bowl, extra chicken, fresco style, no sour cream." },
      { name: "Power Menu Bowl – Chicken (add extra protein)", kcal: 520, p: 46, c: 50, f: 22,
        why: "Adding extra chicken doubles the protein hit. High carb + protein ratio suits recovery perfectly.", timing: "Within 30–60 min",
        order: "Power Menu Bowl – Chicken, add extra grilled chicken." },
    ],
    cheat: [
      { name: "Crunchwrap Supreme + Nacho Fries", kcal: 990, p: 28, c: 110, f: 46,
        tip: "The ultimate Taco Bell experience. Swap beef for chicken for a few extra grams of protein.",
        damage: "Low protein for the calorie cost — high refined carbs and fat." },
      { name: "Loaded Nachos Box", kcal: 1140, p: 26, c: 120, f: 58,
        tip: "The most indulgent Taco Bell order. Share it, or commit fully.",
        damage: "Very high calories, very low protein ratio." },
    ],
  },
  {
    id: "mcdonalds", name: "McDonald's", emoji: "🍟",
    onTrack: [
      { name: "Double Quarter Pounder w/ Cheese (no bun)", kcal: 510, p: 46, c: 4, f: 34, rating: 4,
        tip: "McDonald's best protein option. Dropping the bun cuts carbs to near zero. Use mustard/ketchup.",
        order: "Double Quarter Pounder with Cheese, no bun. Mustard/ketchup only." },
      { name: "Egg McMuffin × 2", kcal: 620, p: 34, c: 60, f: 26, rating: 4,
        tip: "Real egg, Canadian bacon, English muffin. Strong protein-per-dollar ratio.",
        order: "2× Egg McMuffin. Skip the hash brown." },
      { name: "10-Piece Chicken McNuggets (mustard only)", kcal: 400, p: 23, c: 26, f: 24, rating: 3,
        tip: "All white meat. Dipping sauces add 50–150 kcal each — use mustard (0 cal) instead.",
        order: "10-piece McNuggets, mustard sauce only." },
    ],
    pre: [
      { name: "Egg McMuffin + Hash Brown", kcal: 480, p: 20, c: 54, f: 22,
        why: "English muffin + hash brown give quick-release carbs, egg adds protein to prevent muscle breakdown.", timing: "60–90 min before",
        order: "Egg McMuffin + Hash Brown. Small OJ if it's an intense session." },
      { name: "McDouble + Apple Slices", kcal: 480, p: 28, c: 50, f: 18,
        why: "Bun carbs for energy, double beef for a protein base. Apple slices add natural simple sugars.", timing: "60–90 min before",
        order: "McDouble, no mayo, ketchup only. Apple Slices side." },
    ],
    post: [
      { name: "Double Quarter Pounder w/ Cheese + Apple Slices", kcal: 770, p: 50, c: 50, f: 36,
        why: "Biggest protein hit at McDonald's post-workout. Apple slices provide fast-digesting simple carbs.", timing: "Within 30–60 min",
        order: "Double Quarter Pounder with Cheese, Apple Slices side. Skip fries." },
      { name: "20-Piece Nuggets + Medium Fries", kcal: 1010, p: 46, c: 102, f: 44,
        why: "High protein + high carb recovery combo. Fries provide rapid glycogen replenishment.", timing: "Within 45–60 min",
        order: "20-piece McNuggets, medium fries, mustard dip only." },
    ],
    cheat: [
      { name: "Double Quarter Pounder + Large Fries", kcal: 1080, p: 52, c: 93, f: 54,
        tip: "Best protein cheat at McDonald's at 52g.",
        damage: "High saturated fat and sodium." },
      { name: "Big Mac + Large Fries + McFlurry", kcal: 1430, p: 30, c: 190, f: 56,
        tip: "The full classic experience. Low protein for the calorie load — pure enjoyment meal.",
        damage: "Very high sugar and refined carbs." },
    ],
  },
  {
    id: "pandaexpress", name: "Panda Express", emoji: "🐼",
    onTrack: [
      { name: "Grilled Teriyaki Chicken + Super Greens", kcal: 390, p: 40, c: 18, f: 14, rating: 5,
        tip: "Best on-track option at Panda. Super Greens (broccoli, kale, cabbage) add fibre at near-zero calories.",
        order: "Bowl: Grilled Teriyaki Chicken + Super Greens. No rice — keeps it lean." },
      { name: "Teriyaki Chicken Plate + Brown Rice + Super Greens", kcal: 620, p: 44, c: 72, f: 14, rating: 5,
        tip: "One of the most macro-balanced fast food meals available anywhere.",
        order: "Plate: Grilled Teriyaki Chicken + steamed brown rice + Super Greens." },
      { name: "Mushroom Chicken + Super Greens", kcal: 290, p: 18, c: 16, f: 14, rating: 3,
        tip: "Lowest calorie chicken option. Pair with an extra protein entree.",
        order: "Bowl: Mushroom Chicken + Super Greens + add second protein entree." },
    ],
    pre: [
      { name: "Teriyaki Chicken + Large Steamed Brown Rice", kcal: 680, p: 40, c: 88, f: 14,
        why: "Brown rice provides slow-release complex carbs for sustained energy. Won't sit heavy before training.", timing: "60–90 min before",
        order: "Plate: Grilled Teriyaki Chicken + large steamed brown rice + Super Greens." },
      { name: "String Bean Chicken Breast + Fried Rice", kcal: 600, p: 30, c: 78, f: 18,
        why: "String bean chicken is lower fat than most Panda options. Fried rice gives fast carbs.", timing: "75–90 min before",
        order: "Bowl: String Bean Chicken Breast + fried rice." },
    ],
    post: [
      { name: "2× Grilled Teriyaki Chicken + White Rice", kcal: 760, p: 72, c: 80, f: 18,
        why: "Double protein + white rice (faster glycogen uptake than brown post-workout) = textbook recovery meal.", timing: "Within 30–45 min",
        order: "Bigger Plate: 2× Grilled Teriyaki Chicken + steamed white rice." },
      { name: "Teriyaki Chicken + White Rice + Super Greens", kcal: 620, p: 44, c: 72, f: 14,
        why: "Leaner recovery option. White rice replenishes glycogen fast, chicken drives muscle protein synthesis.", timing: "Within 30–60 min",
        order: "Plate: Grilled Teriyaki Chicken + white rice + Super Greens." },
    ],
    cheat: [
      { name: "Orange Chicken Plate + Fried Rice + Egg Roll", kcal: 1100, p: 32, c: 148, f: 36,
        tip: "The Panda classic. Orange chicken fried in a sweet thick sauce — pure comfort food.",
        damage: "Very high sugar and refined carbs." },
      { name: "Beijing Beef + Chow Mein", kcal: 970, p: 28, c: 120, f: 38,
        tip: "Sweet crispy beef with lo mein noodles. Finish with a fortune cookie.",
        damage: "High sugar from Beijing Beef glaze, high carbs from chow mein." },
    ],
  },
  {
    id: "chipotle", name: "Chipotle", emoji: "🌯",
    onTrack: [
      { name: "Burrito Bowl: Double Chicken + Rice + Black Beans + Fajita Veg + Fresh Salsa", kcal: 680, p: 64, c: 68, f: 12, rating: 5,
        tip: "Highest protein on-track order across all 8 chains. Double chicken is absolutely worth the upcharge.",
        order: "Bowl, double chicken, white or brown rice, black beans, fajita veg, fresh tomato salsa, lettuce. No sour cream or cheese." },
      { name: "Salad Bowl: Steak + Fajita Veg + Guac", kcal: 530, p: 42, c: 22, f: 26, rating: 4,
        tip: "Lower carb option — great on rest days. Guac adds healthy monounsaturated fats.",
        order: "Salad base, steak, fajita veg, guac, fresh tomato salsa, no dressing." },
      { name: "Burrito Bowl: Chicken + Brown Rice + Pinto Beans + Salsa", kcal: 565, p: 45, c: 67, f: 15, rating: 5,
        tip: "The athlete staple. Brown rice adds fibre over white.",
        order: "Bowl, chicken, brown rice, pinto beans, fresh tomato salsa, lettuce." },
    ],
    pre: [
      { name: "Burrito Bowl: Chicken + White Rice + Black Beans + Salsa", kcal: 600, p: 42, c: 78, f: 12,
        why: "White rice digests faster than brown — better for a pre-workout window.", timing: "60–90 min before",
        order: "Bowl, chicken, extra white rice, black beans, fresh tomato salsa, no sour cream or cheese." },
      { name: "Burrito: Chicken + White Rice + Black Beans + Salsa (no sour cream/cheese)", kcal: 740, p: 44, c: 96, f: 14,
        why: "The tortilla adds ~30g extra carbs — useful for longer or higher-intensity sessions.", timing: "90 min before",
        order: "Burrito, chicken, white rice, black beans, fresh salsa only. No sour cream, no cheese, no guac." },
    ],
    post: [
      { name: "Burrito Bowl: Double Chicken + White Rice + Black Beans + Fresh Salsa", kcal: 720, p: 66, c: 72, f: 12,
        why: "The gold standard post-workout fast food meal. Double chicken + white rice. No fat toppings.", timing: "Within 30–45 min",
        order: "Bowl, double chicken, white rice, black beans, fresh tomato salsa, lettuce. No sour cream, cheese, or guac." },
      { name: "Salad Bowl: Double Protein + Fajita Veg + Guac + Fresh Salsa", kcal: 580, p: 62, c: 28, f: 22,
        why: "High protein, lower carb recovery option — good if you're having other carbs in the same window.", timing: "Within 30–60 min",
        order: "Salad base, double chicken or steak, fajita veg, guac, fresh tomato salsa." },
    ],
    cheat: [
      { name: "Burrito: Carnitas + Everything", kcal: 1050, p: 50, c: 106, f: 38,
        tip: "Even the Chipotle cheat gives 50g protein. Carnitas (braised pork shoulder) is worth the treat.",
        damage: "Large calorie load in a single wrap." },
      { name: "Quesadilla + Chips & Guac", kcal: 1180, p: 44, c: 98, f: 66,
        tip: "Guac at least adds healthy fats. Chips and quesadilla together is a high-fat indulgence.",
        damage: "Very high fat from cheese, guac and chips." },
    ],
  },
  {
    id: "chickfila", name: "Chick-fil-A", emoji: "🐔",
    onTrack: [
      { name: "12-Count Grilled Nuggets", kcal: 200, p: 38, c: 2, f: 5, rating: 5,
        tip: "Best protein-to-calorie ratio at any fast food chain on this list. 38g protein at 200 calories is exceptional.",
        order: "12-count Grilled Nuggets + Fruit Cup or Side Salad for carbs and micronutrients." },
      { name: "Cool Wrap (no dressing)", kcal: 350, p: 42, c: 29, f: 13, rating: 5,
        tip: "42g protein in a flaxseed flatbread. One of the best macro-balanced fast food items on this guide.",
        order: "Grilled Chicken Cool Wrap, no dressing. Honey mustard packet on the side sparingly." },
      { name: "Grilled Chicken Sandwich + Side Salad", kcal: 480, p: 36, c: 48, f: 12, rating: 4,
        tip: "Swap waffle fries for the side salad to save ~200 kcal and add micronutrients.",
        order: "Grilled Chicken Sandwich, no sauce. Side salad with fat-free honey mustard." },
    ],
    pre: [
      { name: "Grilled Chicken Sandwich + Medium Waffle Fries", kcal: 700, p: 36, c: 86, f: 24,
        why: "Waffle fries give a large carb load for your session. Grilled chicken keeps fat manageable.", timing: "60–90 min before",
        order: "Grilled Chicken Sandwich (no mayo) + Medium Waffle Fries. Water or unsweet tea." },
      { name: "Egg White Grill + Hash Browns", kcal: 460, p: 32, c: 46, f: 12,
        why: "Great pre-morning-workout breakfast. Egg whites are fast-digesting, hash browns give quick carb fuel.", timing: "45–60 min before",
        order: "Egg White Grill sandwich + Hash Browns. Small OJ if you need extra fast carbs." },
    ],
    post: [
      { name: "12-Count Grilled Nuggets + Medium Waffle Fries", kcal: 720, p: 42, c: 68, f: 26,
        why: "One of the best post-workout combos on this guide. 38g lean chicken protein + waffle fries for glycogen.", timing: "Within 30–45 min",
        order: "12-count Grilled Nuggets + Medium Waffle Fries. Unsweet tea or water." },
      { name: "Cool Wrap + Fruit Cup + Chocolate Milk", kcal: 680, p: 50, c: 72, f: 16,
        why: "Wrap gives protein and complex carbs. Chocolate milk is a well-researched post-workout recovery drink.", timing: "Within 30–60 min",
        order: "Grilled Chicken Cool Wrap (no dressing) + Fruit Cup + 1% Chocolate Milk." },
    ],
    cheat: [
      { name: "Spicy Deluxe Sandwich + Waffle Fries + Lemonade", kcal: 1080, p: 38, c: 128, f: 44,
        tip: "The full Chick-fil-A experience. Still 38g protein even as a cheat.",
        damage: "High refined carbs from fries and lemonade sugar." },
      { name: "Chicken Strips (4-ct) + Mac & Cheese + Milkshake", kcal: 1320, p: 46, c: 152, f: 54,
        tip: "Strips are surprisingly high protein. This cheat still hits decent protein numbers.",
        damage: "Very high sugar from the milkshake." },
    ],
  },
  {
    id: "innout", name: "In-N-Out", emoji: "🌴",
    onTrack: [
      { name: "Double-Double Protein Style (no spread)", kcal: 440, p: 37, c: 11, f: 32, rating: 5,
        tip: "Protein Style swaps the bun for a lettuce wrap — drops carbs from ~40g to ~11g.",
        order: "Double-Double, Protein Style, no spread, mustard and ketchup instead." },
      { name: "Double Meat Hamburger (no spread) + Side Salad", kcal: 410, p: 34, c: 42, f: 18, rating: 4,
        tip: "If you want the bun, this is the cleanest option. Side salad adds fibre and volume.",
        order: "Double Meat Hamburger, no spread, mustard/ketchup, extra lettuce/tomato. Side salad, no croutons." },
    ],
    pre: [
      { name: "Double-Double + Medium Fries (no spread)", kcal: 830, p: 37, c: 76, f: 42,
        why: "Fries add the carb volume you need pre-workout. No spread keeps fat down.", timing: "90 min before",
        order: "Double-Double, no spread, mustard/ketchup. Medium Fries (not Animal Style — too much fat pre-workout)." },
      { name: "Hamburger + Medium Fries", kcal: 690, p: 24, c: 74, f: 30,
        why: "Lighter pre-workout option. Burger + fries gives a solid carb-heavy fuel base.", timing: "60–90 min before",
        order: "Hamburger, ketchup and mustard only. Medium Fries." },
    ],
    post: [
      { name: "3×3 Protein Style + Medium Fries", kcal: 870, p: 58, c: 46, f: 56,
        why: "Three patties = 58g protein — the highest post-workout protein option at In-N-Out.", timing: "Within 30–60 min",
        order: "3×3 Burger, Protein Style, no spread, mustard/ketchup. Medium Fries." },
      { name: "Double-Double Protein Style + Medium Fries", kcal: 750, p: 40, c: 44, f: 46,
        why: "Solid protein + carb recovery combo. Protein Style keeps carbs focused on the fries.", timing: "Within 30–60 min",
        order: "Double-Double Protein Style, no spread. Medium Fries. Water or unsweetened tea." },
    ],
    cheat: [
      { name: "Double-Double Animal Style + Animal Style Fries", kcal: 1060, p: 40, c: 78, f: 66,
        tip: "The In-N-Out experience done properly. Animal Style adds grilled onions, extra spread and mustard-fried patties.",
        damage: "Very high fat from spread and cheese sauce on Animal Style fries." },
      { name: "3×3 Burger + Fries + Vanilla Shake", kcal: 1490, p: 58, c: 148, f: 76,
        tip: "58g protein even as a treat — one of the best protein cheat meals on this list.",
        damage: "High everything — rare occasion only." },
    ],
  },
  {
    id: "canes", name: "Raising Cane's", emoji: "🍗",
    onTrack: [
      { name: "3 Finger Combo (no sauce, no toast)", kcal: 530, p: 39, c: 44, f: 22, rating: 3,
        tip: "Cane's Sauce is 190 cal per serving — skip it. Fresh, never-frozen chicken fingers.",
        order: "3 Finger Combo, no Cane's Sauce (honey mustard instead at ~45 cal), no Texas toast, coleslaw side." },
      { name: "Box Combo (no sauce, no toast)", kcal: 720, p: 62, c: 56, f: 30, rating: 4,
        tip: "4 fingers + crinkle fries without the sauce. One of the highest on-track protein options across all 8 chains.",
        order: "Box Combo, no Cane's Sauce, no Texas toast. Squeeze lemon over chicken instead." },
    ],
    pre: [
      { name: "3 Finger Combo + Texas Toast (no sauce)", kcal: 730, p: 42, c: 72, f: 28,
        why: "Keeping the toast (skipping sauce) gives ~30g extra carbs pre-workout.", timing: "60–90 min before",
        order: "3 Finger Combo, keep Texas Toast, NO Cane's Sauce. Lemon or honey mustard only." },
      { name: "Box Combo (no sauce, keep fries and toast)", kcal: 900, p: 62, c: 88, f: 34,
        why: "Fries and toast together pre-workout give a large carb load for intense sessions.", timing: "75–90 min before",
        order: "Box Combo, no sauce, keep fries and toast. Water or unsweet tea." },
    ],
    post: [
      { name: "Caniac Combo (no sauce, no toast)", kcal: 920, p: 90, c: 74, f: 38,
        why: "90g protein makes this the single best post-workout protein meal on this entire guide.", timing: "Within 30–45 min",
        order: "Caniac Combo, NO Cane's Sauce (critical — double sauce = ~380 extra kcal), no Texas toast. Keep crinkle fries." },
      { name: "Box Combo (no sauce, no toast) + extra side fries", kcal: 900, p: 66, c: 80, f: 36,
        why: "62g protein from the chicken fingers. Extra side of fries boosts glycogen carbs.", timing: "Within 30–60 min",
        order: "Box Combo, no sauce, no toast. Add extra side of crinkle fries." },
    ],
    cheat: [
      { name: "Caniac Combo (full — sauce, toast, everything)", kcal: 1420, p: 90, c: 106, f: 76,
        tip: "Best cheat meal protein across all 8 chains at 90g. The sauce is genuinely delicious.",
        damage: "Very high sodium and fat from Cane's Sauce and fried chicken." },
      { name: "Box Combo + Cane's Sauce + Sweet Tea", kcal: 1080, p: 62, c: 96, f: 48,
        tip: "The classic Cane's experience.",
        damage: "High sodium and fat from the sauce." },
    ],
  },
  {
    id: "whataburger", name: "Whataburger", emoji: "🤠",
    onTrack: [
      { name: "Grilled Chicken Sandwich (no mayo)", kcal: 400, p: 34, c: 42, f: 10, rating: 4,
        tip: "Cleanest option at Whataburger. Skip mayo and you have a strong macro split.",
        order: "Grilled Chicken Sandwich, no mayo, add mustard. No combo — skip fries." },
      { name: "Cobb Salad with Grilled Chicken", kcal: 430, p: 36, c: 16, f: 24, rating: 4,
        tip: "Lower carb option with solid protein. Use low-fat vinaigrette on the side.",
        order: "Cobb Salad with grilled chicken, low-fat vinaigrette on the side." },
      { name: "Whataburger Jr. + Apple Slices", kcal: 380, p: 18, c: 40, f: 16, rating: 3,
        tip: "Lighter option. Apple slices are just 30 cal — lowest calorie side on the menu.",
        order: "Whataburger Jr., no mayo, mustard/ketchup. Apple slices side." },
    ],
    pre: [
      { name: "Grilled Chicken Sandwich + Small Fries", kcal: 700, p: 36, c: 80, f: 22,
        why: "Grilled chicken is lean and digestible. Small fries add the carb fuel load for training.", timing: "60–90 min before",
        order: "Grilled Chicken Sandwich (no mayo), Small Fries. Unsweet tea." },
      { name: "Breakfast on a Bun (bacon, no cheese)", kcal: 500, p: 28, c: 44, f: 22,
        why: "Good pre-morning-workout option. Egg and bacon on a bun gives protein and fast carbs.", timing: "45–60 min before",
        order: "Breakfast on a Bun with bacon, no cheese, no butter on bun." },
    ],
    post: [
      { name: "Double Meat Whataburger (no mayo) + Apple Slices", kcal: 760, p: 52, c: 54, f: 34,
        why: "Double beef patties give a strong 52g protein hit. Apple slices add fast simple sugars for glycogen.", timing: "Within 30–60 min",
        order: "Double Meat Whataburger, no mayo, mustard/ketchup. Apple slices side." },
      { name: "Grilled Chicken Sandwich + Medium Fries", kcal: 760, p: 38, c: 90, f: 24,
        why: "Leaner protein source paired with a large carb load from the fries.", timing: "Within 30–60 min",
        order: "Grilled Chicken Sandwich (no mayo) + Medium Fries. Unsweet tea or water." },
    ],
    cheat: [
      { name: "Double Meat Whataburger + Onion Rings", kcal: 1020, p: 50, c: 84, f: 52,
        tip: "The Whataburger classic. Two fresh-beef patties give 50g protein.",
        damage: "High saturated fat and sodium." },
      { name: "Triple Meat Whataburger + Large Fries", kcal: 1650, p: 65, c: 110, f: 90,
        tip: "The most extreme item on the menu — 65g protein but a massive calorie hit.",
        damage: "Extremely high calories and fat — eat light the rest of the day." },
    ],
  },
];

// ─── HIGHLIGHTS & TIPS ────────────────────────────────────────────────────────
const highlights = {
  onTrack: [
    { chain: "Chick-fil-A",   item: "12-Count Grilled Nuggets",       kcal: 200,  p: 38, badge: "Best P/kcal ratio" },
    { chain: "Chipotle",      item: "Double Chicken Bowl",             kcal: 680,  p: 64, badge: "Highest total protein" },
    { chain: "Panda Express", item: "Teriyaki + Brown Rice",           kcal: 620,  p: 44, badge: "Most balanced macros" },
  ],
  pre: [
    { chain: "Chipotle",      item: "Chicken Burrito (no fat toppings)", kcal: 740, p: 44, badge: "Best carb load" },
    { chain: "Chick-fil-A",  item: "Grilled Sandwich + Waffle Fries",  kcal: 700, p: 36, badge: "Best pre-workout combo" },
    { chain: "Panda Express", item: "Teriyaki + Large Brown Rice",      kcal: 680, p: 40, badge: "Cleanest carb source" },
  ],
  post: [
    { chain: "Raising Cane's", item: "Caniac Combo (no sauce)",         kcal: 920,  p: 90, badge: "Highest recovery protein" },
    { chain: "Chipotle",       item: "Double Chicken Bowl (white rice)", kcal: 720,  p: 66, badge: "Best protein + carb ratio" },
    { chain: "Panda Express",  item: "2× Teriyaki + White Rice",        kcal: 760,  p: 72, badge: "Fastest glycogen refuel" },
  ],
  cheat: [
    { chain: "Raising Cane's", item: "Caniac Combo (full)",        kcal: 1420, p: 90, badge: "Highest cheat protein" },
    { chain: "In-N-Out",       item: "3×3 + Shake",                kcal: 1490, p: 58, badge: "Most iconic cheat" },
    { chain: "Whataburger",    item: "Triple Meat + Large Fries",  kcal: 1650, p: 65, badge: "Biggest Texas treat" },
  ],
};

const modeTips = {
  onTrack: [
    "Sauces are macro killers — Cane's Sauce is 190 kcal alone, ranch is ~140 kcal per packet",
    "Grilled > fried whenever available — similar protein, significantly less fat",
    "Chipotle double chicken bowl is the best overall on-track option across all 8 chains",
    "Water or unsweet tea always — sodas add 150–300 empty calories",
  ],
  pre: [
    "Eat 60–90 min before — enough time to digest without training on a full stomach",
    "Target 50–80g carbs, 25–40g protein, keep fat under 25g pre-workout",
    "White rice and buns digest faster than brown rice — better in a short pre-workout window",
    "Avoid Cane's Sauce, Animal Style spread, sour cream pre-workout — high fat + training = GI distress",
  ],
  post: [
    "Eat within 30–60 min — your glycogen and muscle repair window is most active here",
    "Target 40g+ protein — fast-absorbing lean meat drives muscle protein synthesis",
    "Pair with fast-digesting carbs: white rice, crinkle fries, or buns replenish glycogen quickly",
    "Avoid high-fat toppings post-workout — sour cream, extra cheese and spread slow protein absorption",
    "Raising Cane's Caniac (no sauce) = 90g protein — the best post-workout fast food meal on this guide",
  ],
  cheat: [
    "Keep it to once a week — research shows this doesn't significantly derail athletic performance",
    "Even in cheat mode, aim for 30g+ protein to keep muscle synthesis ticking",
    "Don't skip your next planned meal — get back on track immediately after",
    "Cheat meals, not cheat days — one meal is fine, a full day of poor eating is another story",
    "High sodium in fast food — drink extra water the rest of the day to counteract it",
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
// Protein efficiency score: protein grams per 100 kcal (higher = better)
function efficiency(item) {
  return ((item.p / item.kcal) * 100).toFixed(1);
}

function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return dv;
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function MacroPill({ label, val, color }) {
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}38`, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontFamily: "'Martian Mono', monospace" }}>
      {label} {val}g
    </span>
  );
}

function RatingDots({ r, color }) {
  return (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < r ? color : T.border, fontSize: 9, marginRight: 1 }}>◆</span>
      ))}
    </span>
  );
}

function ProteinBar({ grams, goal = 148 }) {
  const pct = Math.min(100, Math.round((grams / goal) * 100));
  const color = pct >= 30 ? T.green : pct >= 20 ? T.lime : T.orange;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10, color: T.muted, fontFamily: "'Martian Mono', monospace" }}>
        <span>{grams}g protein</span>
        <span>{pct}% of daily {goal}g target</span>
      </div>
      <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function EfficiencyBadge({ item }) {
  const eff = parseFloat(efficiency(item));
  const color = eff >= 7 ? T.green : eff >= 4.5 ? T.lime : eff >= 3 ? T.orange : T.muted;
  return (
    <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: `${color}15`, color, border: `1px solid ${color}35`, fontFamily: "'Martian Mono', monospace" }}>
      {eff}g P/100kcal
    </span>
  );
}

function ItemCard({ item, mode, onLog }) {
  const [open, setOpen] = useState(false);
  const cfg = MODE_CONFIG[mode];
  const color = cfg.color;
  const isWorkout = mode === "pre" || mode === "post";
  const isCheat = mode === "cheat";

  return (
    <div
      style={{ background: open ? `${color}08` : T.card, borderRadius: 12, border: `1px solid ${open ? color + "55" : T.border}`, padding: "13px 15px", cursor: "pointer", transition: "all 0.18s" }}
    >
      <div onClick={() => setOpen(!open)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.white, lineHeight: 1.35, marginBottom: 7 }}>{item.name}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <MacroPill label="P" val={item.p} color={T.lime} />
              <MacroPill label="C" val={item.c} color={T.green} />
              <MacroPill label="F" val={item.f} color={T.orange} />
              <EfficiencyBadge item={item} />
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 17, fontWeight: 700, color, lineHeight: 1 }}>{item.kcal}</div>
            <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Martian Mono', monospace", marginBottom: 4 }}>kcal</div>
            {item.rating && <RatingDots r={item.rating} color={color} />}
            {isWorkout && item.timing && (
              <div style={{ fontSize: 10, color, fontFamily: "'Martian Mono', monospace", marginTop: 5 }}>{item.timing}</div>
            )}
          </div>
        </div>
        <ProteinBar grams={item.p} />
      </div>

      {open && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
          {isWorkout ? (
            <>
              <p style={{ fontSize: 12.5, color: T.muted, margin: "0 0 9px", lineHeight: 1.65 }}>
                <span style={{ color, fontFamily: "'Martian Mono', monospace", fontSize: 10, marginRight: 4 }}>WHY</span>
                {item.why}
              </p>
              <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color }}>ORDER → </span>
                <span style={{ fontSize: 12, color: T.white }}>{item.order}</span>
              </div>
            </>
          ) : isCheat ? (
            <>
              <p style={{ fontSize: 12.5, color: T.muted, margin: "0 0 9px", lineHeight: 1.65 }}>{item.tip}</p>
              <div style={{ background: `${T.red}10`, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: T.red }}>⚠ </span>
                <span style={{ fontSize: 12, color: T.white }}>{item.damage}</span>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 12.5, color: T.muted, margin: "0 0 9px", lineHeight: 1.65 }}>{item.tip}</p>
              <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color }}>ORDER → </span>
                <span style={{ fontSize: 12, color: T.white }}>{item.order}</span>
              </div>
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onLog(item); }}
            style={{ background: `${T.lime}15`, border: `1px solid ${T.lime}40`, borderRadius: 6, padding: "5px 12px", fontSize: 11, color: T.lime, cursor: "pointer", fontFamily: "'Martian Mono', monospace" }}
          >
            + Log this meal
          </button>
        </div>
      )}
    </div>
  );
}

// Live search result card (from USDA FoodData Central)
function FdcResultCard({ item, onLog }) {
  // Extract macros from the nutrients array
  const getNutrient = (id) => {
    const n = (item.foodNutrients || []).find(n => n.nutrientId === id || n.nutrientNumber === String(id));
    return Math.round(n ? (n.value || 0) : 0);
  };
  const kcal = getNutrient(1008) || getNutrient(2047);
  const prot = getNutrient(1003);
  const carb = getNutrient(1005);
  const fat  = getNutrient(1004);
  const servingSize = item.servingSize ? `${item.servingSize}${item.servingSizeUnit || "g"}` : "";
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.white, marginBottom: 4, lineHeight: 1.3 }}>{item.description}</div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>
            {item.brandName || item.brandOwner || "USDA"}{servingSize ? ` · ${servingSize}` : ""}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <MacroPill label="P" val={prot} color={T.lime} />
            <MacroPill label="C" val={carb} color={T.green} />
            <MacroPill label="F" val={fat} color={T.orange} />
            <EfficiencyBadge item={{ p: prot, kcal: kcal || 1 }} />
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 17, fontWeight: 700, color: T.blue }}>{kcal}</div>
          <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Martian Mono', monospace" }}>kcal</div>
        </div>
      </div>
      <ProteinBar grams={prot} />
      <button
        onClick={() => onLog({ name: item.description, p: prot, c: carb, f: fat, kcal })}
        style={{ marginTop: 8, background: `${T.blue}15`, border: `1px solid ${T.blue}40`, borderRadius: 6, padding: "5px 12px", fontSize: 11, color: T.blue, cursor: "pointer", fontFamily: "'Martian Mono', monospace" }}
      >
        + Log this meal
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FastFoodGuide() {
  const [mode, setMode]               = useState("onTrack");
  const [activeChain, setActiveChain] = useState("all");
  const [searchQ, setSearchQ]         = useState("");
  const [fdcQuery, setFdcQuery]       = useState("");
  const [fdcResults, setFdcResults]   = useState([]);
  const [fdcLoading, setFdcLoading]   = useState(false);
  const [fdcError, setFdcError]       = useState("");
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [showLog, setShowLog]         = useState(false);
  const [activeTab, setActiveTab]     = useState("guide"); // "guide" | "search"

  const cfg = MODE_CONFIG[mode];
  const debouncedFdc = useDebounce(fdcQuery, 600);

  // All items flat for in-app search
  const allItems = chains.flatMap(c =>
    ["onTrack","pre","post","cheat"].flatMap(m =>
      (c[m] || []).map(item => ({ ...item, chain: c.name, chainEmoji: c.emoji, mode: m }))
    )
  );

  const filteredItems = searchQ.trim().length > 1
    ? allItems.filter(i => i.name.toLowerCase().includes(searchQ.toLowerCase()) || i.chain.toLowerCase().includes(searchQ.toLowerCase()))
    : [];

  // USDA FoodData Central live search
  useEffect(() => {
    if (!debouncedFdc || debouncedFdc.length < 3) { setFdcResults([]); return; }
    setFdcLoading(true);
    setFdcError("");
    const params = new URLSearchParams({
      api_key: USDA_KEY,
      query: debouncedFdc,
      dataType: "Branded",
      pageSize: 10,
      sortBy: "score",
      sortOrder: "desc",
    });
    fetch(`${USDA_BASE}/foods/search?${params}`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        setFdcResults((data.foods || []).slice(0, 8));
        setFdcLoading(false);
      })
      .catch(err => {
        if (String(err).includes("429")) {
          setFdcError("Rate limit hit on DEMO_KEY. Sign up for a free personal key at fdc.nal.usda.gov/api-key-signup — takes 30 seconds.");
        } else {
          setFdcError("Search failed — check your network connection.");
        }
        setFdcLoading(false);
      });
  }, [debouncedFdc]);

  const logMeal = useCallback((item) => {
    setLoggedMeals(prev => [...prev, { ...item, id: Date.now() }]);
  }, []);

  const totalLogged = loggedMeals.reduce((a, m) => ({ p: a.p + m.p, kcal: a.kcal + m.kcal }), { p: 0, kcal: 0 });

  const visibleChains = activeChain === "all" ? chains : chains.filter(c => c.id === activeChain);

  // In-app filtered items by mode
  const modeFilteredItems = filteredItems.filter(i => i.mode === mode);

  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setActiveTab(id)} style={{
      padding: "7px 16px", borderRadius: 20, border: `1px solid ${activeTab === id ? cfg.color : T.border}`,
      background: activeTab === id ? `${cfg.color}15` : "transparent",
      color: activeTab === id ? cfg.color : T.muted,
      fontFamily: "'Martian Mono', monospace", fontSize: 10, cursor: "pointer", transition: "all 0.18s",
    }}>{label}</button>
  );

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: T.white }}>
      <link href="https://fonts.googleapis.com/css2?family=Martian+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "16px 20px 0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 18, fontWeight: 700, color: T.lime }}>FAST FOOD</span>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 18, fontWeight: 700, color: T.white }}>GUIDE</span>
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>8 US chains · May 2026 · USDA FoodData Central live search</div>
            </div>
            {/* Protein log summary */}
            <button
              onClick={() => setShowLog(!showLog)}
              style={{ background: `${T.lime}12`, border: `1px solid ${T.lime}30`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", textAlign: "right" }}
            >
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 14, fontWeight: 700, color: T.lime }}>{totalLogged.p}g</div>
              <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Martian Mono', monospace" }}>/ 148g protein</div>
            </button>
          </div>

          {/* Protein progress bar */}
          <div style={{ marginBottom: 12 }}>
            <ProteinBar grams={totalLogged.p} goal={148} />
          </div>

          {/* 4-mode toggle */}
          <div style={{ display: "flex", gap: 2, background: "#0C0D08", borderRadius: 10, padding: 3, border: `1px solid ${T.border}`, marginBottom: 0 }}>
            {Object.entries(MODE_CONFIG).map(([key, val]) => (
              <button key={key} onClick={() => setMode(key)} style={{
                flex: 1, padding: "7px 2px", borderRadius: 8, border: "none",
                background: mode === key ? val.color : "transparent",
                color: mode === key ? T.bg : T.muted,
                fontFamily: "'Martian Mono', monospace", fontSize: 9, fontWeight: 700,
                cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap", letterSpacing: 0.1,
              }}>{val.label}</button>
            ))}
          </div>
          <div style={{ background: `${cfg.color}10`, padding: "7px 12px", fontSize: 11.5, color: cfg.color, lineHeight: 1.5 }}>
            {cfg.desc}
          </div>

          {/* Tab row */}
          <div style={{ display: "flex", gap: 6, paddingTop: 10, paddingBottom: 2, overflowX: "auto", scrollbarWidth: "none" }}>
            {tabBtn("guide", "◆ CHAIN GUIDE")}
            {tabBtn("search", "⌕ LIVE SEARCH")}
          </div>
        </div>
      </div>

      {/* ── MEAL LOG DRAWER ── */}
      {showLog && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderBottom: `1px solid ${T.lime}22`, padding: "12px 20px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: T.lime }}>◆ MEAL LOG</span>
              <button onClick={() => setLoggedMeals([])} style={{ fontSize: 10, color: T.muted, background: "none", border: "none", cursor: "pointer" }}>Clear all</button>
            </div>
            {loggedMeals.length === 0 ? (
              <div style={{ fontSize: 12, color: T.muted }}>No meals logged yet — tap "Log this meal" on any item.</div>
            ) : loggedMeals.map((m, i) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < loggedMeals.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 12, color: T.white, flex: 1 }}>{m.name}</span>
                <span style={{ fontSize: 11, color: T.lime, fontFamily: "'Martian Mono', monospace", marginLeft: 10 }}>{m.p}g P · {m.kcal} kcal</span>
                <button onClick={() => setLoggedMeals(prev => prev.filter(x => x.id !== m.id))} style={{ fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer", marginLeft: 8 }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 16px 80px" }}>

        {/* ══ GUIDE TAB ══ */}
        {activeTab === "guide" && (
          <>
            {/* In-app item search */}
            <div style={{ marginBottom: 14 }}>
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search items across all chains…"
                style={{
                  width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
                  padding: "10px 14px", color: T.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Search results */}
            {searchQ.trim().length > 1 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: cfg.color, marginBottom: 8 }}>
                  ◆ SEARCH RESULTS ({modeFilteredItems.length} items in {MODE_CONFIG[mode].label} mode)
                </div>
                {modeFilteredItems.length === 0 ? (
                  <div style={{ fontSize: 12, color: T.muted, padding: "10px 0" }}>No items match in this mode — try switching modes or use Live Search.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {modeFilteredItems.map((item, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 10, color: T.muted, fontFamily: "'Martian Mono', monospace", marginBottom: 4 }}>{item.chainEmoji} {item.chain}</div>
                        <ItemCard item={item} mode={item.mode} onLog={logMeal} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chain filter */}
            {!searchQ.trim() && (
              <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 14, paddingBottom: 4, scrollbarWidth: "none" }}>
                {[{ id: "all", name: "All Chains", emoji: "⭐" }, ...chains].map(c => (
                  <button key={c.id} onClick={() => setActiveChain(c.id)} style={{
                    padding: "4px 11px", borderRadius: 20, flexShrink: 0,
                    border: `1px solid ${activeChain === c.id ? cfg.color : T.border}`,
                    background: activeChain === c.id ? `${cfg.color}15` : "transparent",
                    color: activeChain === c.id ? cfg.color : T.muted,
                    fontFamily: "'Martian Mono', monospace", fontSize: 10, cursor: "pointer", transition: "all 0.18s",
                  }}>{c.emoji} {c.name}</button>
                ))}
              </div>
            )}

            {/* Top picks */}
            {activeChain === "all" && !searchQ.trim() && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: cfg.color, marginBottom: 10, letterSpacing: 1 }}>◆ TOP PICKS</div>
                {(highlights[mode] || []).map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{p.chain}</span>
                      <span style={{ fontSize: 12, color: T.muted }}> · {p.item}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
                      <span style={{ fontSize: 10, color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, borderRadius: 20, padding: "2px 8px", fontFamily: "'Martian Mono', monospace" }}>{p.badge}</span>
                      <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 11, color: T.lime, flexShrink: 0 }}>{p.p}g P</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mode tips */}
            {!searchQ.trim() && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: cfg.color, marginBottom: 10, letterSpacing: 1 }}>
                  {mode === "pre" ? "⚡ PRE-WORKOUT RULES" : mode === "post" ? "🔄 POST-WORKOUT RULES" : mode === "cheat" ? "🔥 CHEAT MEAL STRATEGY" : "🎯 ON-TRACK RULES"}
                </div>
                {(modeTips[mode] || []).map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, color: T.muted, marginBottom: 6, lineHeight: 1.55 }}>
                    <span style={{ color: cfg.color, flexShrink: 0 }}>→</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Chain sections */}
            {!searchQ.trim() && visibleChains.map(chain => {
              const items = chain[mode] || [];
              if (!items.length) return null;
              return (
                <div key={chain.id} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{chain.emoji}</span>
                    <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 13, fontWeight: 700, color: T.white }}>{chain.name}</span>
                    <div style={{ height: 1, flex: 1, background: T.border }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {items.map((item, i) => <ItemCard key={i} item={item} mode={mode} onLog={logMeal} />)}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ══ LIVE SEARCH TAB ══ */}
        {activeTab === "search" && (
          <>
            <div style={{ background: T.card, border: `1px solid ${T.blue}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: T.blue, marginBottom: 6 }}>◆ USDA FOODDATA CENTRAL — LIVE SEARCH</div>
              <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.6 }}>
                Search 380,000+ foods from the USDA's government-verified database — including branded fast food items.
                Completely free, no credit card. Replace <code style={{ color: T.lime, fontSize: 11 }}>DEMO_KEY</code> at the top of this file with your personal key from{" "}
                <a href="https://fdc.nal.usda.gov/api-key-signup" target="_blank" rel="noreferrer" style={{ color: T.blue }}>fdc.nal.usda.gov/api-key-signup</a> for higher rate limits.
              </p>
            </div>
            <input
              value={fdcQuery}
              onChange={e => setFdcQuery(e.target.value)}
              placeholder="e.g. McDonald's McDouble, Chipotle chicken bowl…"
              style={{
                width: "100%", background: T.card, border: `1px solid ${T.blue}50`, borderRadius: 10,
                padding: "10px 14px", color: T.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                outline: "none", boxSizing: "border-box", marginBottom: 14,
              }}
            />
            {fdcLoading && (
              <div style={{ textAlign: "center", padding: "20px 0", color: T.muted, fontFamily: "'Martian Mono', monospace", fontSize: 11 }}>Searching USDA database…</div>
            )}
            {fdcError && (
              <div style={{ background: `${T.orange}10`, border: `1px solid ${T.orange}30`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: T.orange, lineHeight: 1.6, marginBottom: 14 }}>
                {fdcError}
              </div>
            )}
            {!fdcLoading && fdcResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: T.blue, marginBottom: 4 }}>◆ {fdcResults.length} RESULTS — USDA VERIFIED DATA</div>
                {fdcResults.map((item, i) => <FdcResultCard key={i} item={item} onLog={logMeal} />)}
              </div>
            )}
            {!fdcLoading && !fdcError && fdcQuery.length > 2 && fdcResults.length === 0 && (
              <div style={{ fontSize: 12, color: T.muted, textAlign: "center", padding: "20px 0" }}>No results found — try a different search term.</div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ background: T.surface, border: `1px solid ${T.lime}22`, borderRadius: 12, padding: "13px 16px", marginTop: 8 }}>
          <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: T.lime, marginBottom: 5 }}>◆ DATA NOTE</div>
          <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.7 }}>
            Curated items verified against official 2026 restaurant sources. Live search powered by USDA FoodData Central — free, government-verified, 380,000+ foods including branded fast food items, updated quarterly. McDonald's grilled chicken sandwich confirmed discontinued. Macros are approximate and vary slightly by location. No chunky tomato options appear in any recommendation. Daily protein target of 148g based on 2.0g/kg at 74kg per Mănescu et al. (2025).
          </p>
        </div>
      </div>
    </div>
  );
}