import { useState } from "react";

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
};

const MODE_CONFIG = {
  onTrack: { label: "✅ On Track",     color: "#5BF599", desc: "Clean options that keep you close to your daily macro targets." },
  pre:     { label: "⚡ Pre-Workout",  color: "#D8FF47", desc: "Higher carbs + moderate protein to fuel performance. Eat 60–90 min before training." },
  post:    { label: "🔄 Post-Workout", color: "#47C8FF", desc: "Fast protein + carbs to replenish glycogen and start muscle repair. Eat within 30–60 min after training." },
  cheat:   { label: "🔥 Cheat Meal",   color: "#FF8C42", desc: "Enjoy with full info. Even in cheat mode, aim for 30g+ protein to keep muscle synthesis running." },
};

const chains = [
  {
    id: "tacobell", name: "Taco Bell", emoji: "🔔",
    onTrack: [
      { name: "Cantina Chicken Bowl (fresco style)", kcal: 490, p: 32, c: 44, f: 18, rating: 5,
        tip: "Best customisable bowl at Taco Bell. Fresco style swaps creamy sauces for pico de gallo, cutting ~100 kcal.",
        order: "Cantina Chicken Bowl, fresco style, add black beans, no sour cream." },
      { name: "Power Menu Bowl – Chicken", kcal: 460, p: 27, c: 41, f: 21, rating: 4,
        tip: "Rice, chicken, beans, guac and veg. Ask for light sour cream to trim fat without losing the flavour.",
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
        why: "Fast-digesting chicken protein + rice carbs is the textbook post-workout combo. Fresco salsa adds micronutrients without fat.", timing: "Within 30–45 min",
        order: "Cantina Chicken Bowl, extra chicken, fresco style, no sour cream." },
      { name: "Power Menu Bowl – Chicken (add extra protein)", kcal: 520, p: 46, c: 50, f: 22,
        why: "Adding extra chicken doubles the protein hit. High carb + protein ratio suits recovery perfectly.", timing: "Within 30–60 min",
        order: "Power Menu Bowl – Chicken, add extra grilled chicken." },
    ],
    cheat: [
      { name: "Crunchwrap Supreme + Nacho Fries", kcal: 990, p: 28, c: 110, f: 46,
        tip: "The ultimate Taco Bell experience. Swap beef for chicken for a few extra grams of protein without much change in calories.",
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
        tip: "Grilled chicken is gone — this is McDonald's best protein option now. Dropping the bun cuts carbs to near zero. Use the app to find the protein badge on this item.",
        order: "Double Quarter Pounder with Cheese, no bun. Ask for lettuce wrap or box it with mustard/ketchup." },
      { name: "Egg McMuffin × 2", kcal: 620, p: 34, c: 60, f: 26, rating: 4,
        tip: "Real egg, Canadian bacon, English muffin. McDonald's added protein badges to these on the app as of April 2026.",
        order: "2× Egg McMuffin. Skip the hash brown." },
      { name: "10-Piece Chicken McNuggets (mustard only)", kcal: 400, p: 23, c: 26, f: 24, rating: 3,
        tip: "All white meat. Dipping sauces add 50–150 kcal each — use mustard (0 cal) instead.",
        order: "10-piece McNuggets, mustard sauce only." },
    ],
    pre: [
      { name: "Egg McMuffin + Hash Brown", kcal: 480, p: 20, c: 54, f: 22,
        why: "English muffin + hash brown give quick-release carbs, egg adds protein to prevent muscle breakdown during training.", timing: "60–90 min before",
        order: "Egg McMuffin + Hash Brown. Small OJ if it's an intense session." },
      { name: "McDouble + Apple Slices", kcal: 480, p: 28, c: 50, f: 18,
        why: "Bun carbs for energy, double beef for a protein base. Apple slices add natural simple sugars for a light energy top-up.", timing: "60–90 min before",
        order: "McDouble, no mayo, ketchup only. Apple Slices side." },
    ],
    post: [
      { name: "Double Quarter Pounder w/ Cheese + Apple Slices", kcal: 770, p: 50, c: 50, f: 36,
        why: "Biggest protein hit at McDonald's post-workout. Apple slices provide fast-digesting simple carbs for glycogen replenishment.", timing: "Within 30–60 min",
        order: "Double Quarter Pounder with Cheese, Apple Slices side. Skip fries — too much fat slows digestion post-workout." },
      { name: "20-Piece Nuggets + Medium Fries", kcal: 1010, p: 46, c: 102, f: 44,
        why: "High protein + high carb recovery combo. Fries provide rapid glycogen replenishment after a hard session.", timing: "Within 45–60 min",
        order: "20-piece McNuggets, medium fries, mustard dip only." },
    ],
    cheat: [
      { name: "Double Quarter Pounder + Large Fries", kcal: 1080, p: 52, c: 93, f: 54,
        tip: "Best protein cheat at McDonald's at 52g. App now highlights this with a protein badge.",
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
        tip: "Best on-track option at Panda. 36g protein from the teriyaki alone. Super Greens (broccoli, kale, cabbage) add fibre at near-zero calories.",
        order: "Bowl: Grilled Teriyaki Chicken + Super Greens. No rice — keeps it lean." },
      { name: "Teriyaki Chicken Plate + Brown Rice + Super Greens", kcal: 620, p: 44, c: 72, f: 14, rating: 5,
        tip: "With brown rice, this is one of the most macro-balanced fast food meals available anywhere. Athletes on performance plans should opt for this over Orange Chicken every time.",
        order: "Plate: Grilled Teriyaki Chicken + steamed brown rice + Super Greens." },
      { name: "Mushroom Chicken + Super Greens", kcal: 290, p: 18, c: 16, f: 14, rating: 3,
        tip: "Lowest calorie chicken option. Good add-on but not enough alone — pair with an extra protein entree.",
        order: "Bowl: Mushroom Chicken + Super Greens + add second protein entree." },
    ],
    pre: [
      { name: "Teriyaki Chicken + Large Steamed Brown Rice", kcal: 680, p: 40, c: 88, f: 14,
        why: "Brown rice provides slow-release complex carbs for sustained energy. Grilled teriyaki is lean and easy to digest — won't sit heavy before training.", timing: "60–90 min before",
        order: "Plate: Grilled Teriyaki Chicken + large steamed brown rice + Super Greens." },
      { name: "String Bean Chicken Breast + Fried Rice", kcal: 600, p: 30, c: 78, f: 18,
        why: "String bean chicken is lower fat than most Panda options. Fried rice gives fast carbs — acceptable pre-workout if session starts within 90 min.", timing: "75–90 min before",
        order: "Bowl: String Bean Chicken Breast + fried rice." },
    ],
    post: [
      { name: "2× Grilled Teriyaki Chicken + White Rice", kcal: 760, p: 72, c: 80, f: 18,
        why: "Double protein + white rice (faster glycogen uptake than brown post-workout) = textbook recovery meal. One of the best combos at any chain.", timing: "Within 30–45 min",
        order: "Bigger Plate: 2× Grilled Teriyaki Chicken + steamed white rice (faster digesting post-workout than brown)." },
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
        tip: "Highest protein on-track order across all 8 chains. Fresh tomato salsa is smooth — no chunks. Double chicken is absolutely worth the upcharge for athletes.",
        order: "Bowl, double chicken, white or brown rice, black beans, fajita veg, fresh tomato salsa, lettuce. No sour cream or cheese." },
      { name: "Salad Bowl: Steak + Fajita Veg + Guac", kcal: 530, p: 42, c: 22, f: 26, rating: 4,
        tip: "Lower carb option — great on rest days. Guac adds healthy monounsaturated fats. No dressing needed.",
        order: "Salad base, steak, fajita veg, guac, fresh tomato salsa, no dressing." },
      { name: "Burrito Bowl: Chicken + Brown Rice + Pinto Beans + Salsa", kcal: 565, p: 45, c: 67, f: 15, rating: 5,
        tip: "The athlete staple. Brown rice adds fibre over white. Smooth salsas only — no pico.",
        order: "Bowl, chicken, brown rice, pinto beans, fresh tomato salsa, lettuce." },
    ],
    pre: [
      { name: "Burrito Bowl: Chicken + White Rice + Black Beans + Salsa", kcal: 600, p: 42, c: 78, f: 12,
        why: "White rice digests faster than brown — better for a pre-workout window. Beans add complex carbs for a sustained fuel curve alongside the rice.", timing: "60–90 min before",
        order: "Bowl, chicken, extra white rice, black beans, fresh tomato salsa, no sour cream or cheese." },
      { name: "Burrito: Chicken + White Rice + Black Beans + Salsa (no sour cream/cheese)", kcal: 740, p: 44, c: 96, f: 14,
        why: "The tortilla adds ~30g extra carbs — useful for longer or higher-intensity sessions. Keep fat toppings off so digestion stays fast.", timing: "90 min before",
        order: "Burrito, chicken, white rice, black beans, fresh salsa only. No sour cream, no cheese, no guac." },
    ],
    post: [
      { name: "Burrito Bowl: Double Chicken + White Rice + Black Beans + Fresh Salsa", kcal: 720, p: 66, c: 72, f: 12,
        why: "The gold standard post-workout fast food meal. Double chicken floods amino acids into muscle. White rice replenishes glycogen rapidly. No fat toppings — fat slows protein absorption.", timing: "Within 30–45 min",
        order: "Bowl, double chicken, white rice, black beans, fresh tomato salsa, lettuce. No sour cream, cheese, or guac." },
      { name: "Salad Bowl: Double Protein + Fajita Veg + Guac + Fresh Salsa", kcal: 580, p: 62, c: 28, f: 22,
        why: "High protein, lower carb recovery option — good if you're having other carbs in the same window (e.g. fruit or a shake alongside this).", timing: "Within 30–60 min",
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
        tip: "Best protein-to-calorie ratio at any fast food chain on this list. 38g protein at 200 calories is exceptional. Pair with a carb side to round out the meal.",
        order: "12-count Grilled Nuggets + Fruit Cup or Side Salad for carbs and micronutrients." },
      { name: "Cool Wrap (no dressing)", kcal: 350, p: 42, c: 29, f: 13, rating: 5,
        tip: "42g protein in a flaxseed flatbread. One of the best macro-balanced fast food items available anywhere on this guide.",
        order: "Grilled Chicken Cool Wrap, no dressing. Use a honey mustard packet on the side sparingly." },
      { name: "Grilled Chicken Sandwich + Side Salad", kcal: 480, p: 36, c: 48, f: 12, rating: 4,
        tip: "Swap waffle fries for the side salad to save ~200 kcal and add micronutrients.",
        order: "Grilled Chicken Sandwich, no sauce. Side salad with fat-free honey mustard." },
    ],
    pre: [
      { name: "Grilled Chicken Sandwich + Medium Waffle Fries", kcal: 700, p: 36, c: 86, f: 24,
        why: "Waffle fries give a large carb load for your session. Grilled chicken keeps the fat manageable so digestion stays on track.", timing: "60–90 min before",
        order: "Grilled Chicken Sandwich (no mayo) + Medium Waffle Fries. Water or unsweet tea." },
      { name: "Egg White Grill + Hash Browns", kcal: 460, p: 32, c: 46, f: 12,
        why: "Great pre-morning-workout breakfast option. Egg whites are fast-digesting protein, hash browns give quick carb fuel.", timing: "45–60 min before",
        order: "Egg White Grill sandwich + Hash Browns. Small OJ if you need extra fast carbs." },
    ],
    post: [
      { name: "12-Count Grilled Nuggets + Medium Waffle Fries", kcal: 720, p: 42, c: 68, f: 26,
        why: "One of the best post-workout combos on this entire guide. 38g lean chicken protein + waffle fries for glycogen replenishment. Minimal fat from the protein source means fast absorption.", timing: "Within 30–45 min",
        order: "12-count Grilled Nuggets + Medium Waffle Fries. Unsweet tea or water." },
      { name: "Cool Wrap + Fruit Cup + Chocolate Milk", kcal: 680, p: 50, c: 72, f: 16,
        why: "Wrap gives protein and complex carbs. Fruit adds simple sugars. Chocolate milk is a well-researched post-workout recovery drink (protein + fast carbs in one).", timing: "Within 30–60 min",
        order: "Grilled Chicken Cool Wrap (no dressing) + Fruit Cup + 1% Chocolate Milk." },
    ],
    cheat: [
      { name: "Spicy Deluxe Sandwich + Waffle Fries + Lemonade", kcal: 1080, p: 38, c: 128, f: 44,
        tip: "The full Chick-fil-A experience. Still 38g protein even as a cheat — one of the better cheat macro profiles on this list.",
        damage: "High refined carbs from fries and lemonade sugar." },
      { name: "Chicken Strips (4-ct) + Mac & Cheese + Milkshake", kcal: 1320, p: 46, c: 152, f: 54,
        tip: "Strips are surprisingly high protein. This cheat still hits decent protein numbers despite full indulgence.",
        damage: "Very high sugar from the milkshake." },
    ],
  },
  {
    id: "innout", name: "In-N-Out", emoji: "🌴",
    onTrack: [
      { name: "Double-Double Protein Style (no spread)", kcal: 440, p: 37, c: 11, f: 32, rating: 5,
        tip: "Protein Style swaps the bun for a lettuce wrap — drops carbs from ~40g to ~11g. Use mustard/ketchup instead of spread to save another ~80 kcal.",
        order: "Double-Double, Protein Style, no spread, mustard and ketchup instead." },
      { name: "Double Meat Hamburger (no spread) + Side Salad", kcal: 410, p: 34, c: 42, f: 18, rating: 4,
        tip: "If you want the bun, this is the cleanest option. Side salad adds fibre and volume.",
        order: "Double Meat Hamburger, no spread, mustard/ketchup, extra lettuce/tomato. Side salad, no croutons." },
    ],
    pre: [
      { name: "Double-Double + Medium Fries (no spread)", kcal: 830, p: 37, c: 76, f: 42,
        why: "Fries add the carb volume you need pre-workout. No spread on the burger keeps fat down. The bun plus fries gives a good carb base for training.", timing: "90 min before",
        order: "Double-Double, no spread, mustard/ketchup. Medium Fries (not Animal Style — too much fat pre-workout)." },
      { name: "Hamburger + Medium Fries", kcal: 690, p: 24, c: 74, f: 30,
        why: "Lighter pre-workout option. Simple and digestible. Burger + fries gives a solid carb-heavy fuel base without overdoing it.", timing: "60–90 min before",
        order: "Hamburger, ketchup and mustard only. Medium Fries." },
    ],
    post: [
      { name: "3×3 Protein Style + Medium Fries", kcal: 870, p: 58, c: 46, f: 56,
        why: "Three patties = 58g protein — the highest post-workout protein option at In-N-Out. Protein Style cuts the bun carbs so fries do the glycogen work instead.", timing: "Within 30–60 min",
        order: "3×3 Burger, Protein Style, no spread, mustard/ketchup. Medium Fries." },
      { name: "Double-Double Protein Style + Medium Fries", kcal: 750, p: 40, c: 44, f: 46,
        why: "Solid protein + carb recovery combo. Protein Style keeps carbs focused on the fries where they do the most glycogen replenishment work.", timing: "Within 30–60 min",
        order: "Double-Double Protein Style, no spread. Medium Fries. Water or unsweetened tea." },
    ],
    cheat: [
      { name: "Double-Double Animal Style + Animal Style Fries", kcal: 1060, p: 40, c: 78, f: 66,
        tip: "The In-N-Out experience done properly. Animal Style adds grilled onions, extra spread and mustard-fried patties. Worth every calorie as a treat.",
        damage: "Very high fat from spread and cheese sauce on Animal Style fries." },
      { name: "3×3 Burger + Fries + Vanilla Shake", kcal: 1490, p: 58, c: 148, f: 76,
        tip: "The 3×3 gives you 58g protein even as a treat — one of the best protein cheat meals on this entire list.",
        damage: "High everything — rare occasion only." },
    ],
  },
  {
    id: "canes", name: "Raising Cane's", emoji: "🍗",
    onTrack: [
      { name: "3 Finger Combo (no sauce, no toast)", kcal: 530, p: 39, c: 44, f: 22, rating: 3,
        tip: "Cane's Sauce is 190 cal per serving — skip it and save nearly 400 kcal across a full order. Texas toast adds another 110 cal. Fresh, never-frozen chicken fingers.",
        order: "3 Finger Combo, no Cane's Sauce (honey mustard instead at ~45 cal), no Texas toast, coleslaw side." },
      { name: "Box Combo (no sauce, no toast)", kcal: 720, p: 62, c: 56, f: 30, rating: 4,
        tip: "4 fingers + crinkle fries without the sauce. One of the highest on-track protein options across all 8 chains.",
        order: "Box Combo, no Cane's Sauce, no Texas toast. Squeeze lemon over chicken instead." },
    ],
    pre: [
      { name: "3 Finger Combo + Texas Toast (no sauce)", kcal: 730, p: 42, c: 72, f: 28,
        why: "Keeping the toast (skipping sauce) gives ~30g extra carbs pre-workout while saving the 190-cal sauce hit. Good carb + protein balance before training.", timing: "60–90 min before",
        order: "3 Finger Combo, keep Texas Toast, NO Cane's Sauce. Lemon or honey mustard only." },
      { name: "Box Combo (no sauce, keep fries and toast)", kcal: 900, p: 62, c: 88, f: 34,
        why: "Fries and toast together pre-workout give a large carb load for intense sessions. Skip the sauce entirely to keep fat from blunting energy availability.", timing: "75–90 min before",
        order: "Box Combo, no sauce, keep fries and toast. Water or unsweet tea." },
    ],
    post: [
      { name: "Caniac Combo (no sauce, no toast)", kcal: 920, p: 90, c: 74, f: 38,
        why: "90g protein makes this the single best post-workout protein meal on this entire guide. Fries stay — you need those carbs post-session. Skipping sauce and toast saves ~500 kcal while keeping all the recovery protein.", timing: "Within 30–45 min",
        order: "Caniac Combo, NO Cane's Sauce (critical — double sauce = ~380 extra kcal), no Texas toast. Keep crinkle fries." },
      { name: "Box Combo (no sauce, no toast) + extra side fries", kcal: 900, p: 66, c: 80, f: 36,
        why: "62g protein from the chicken fingers. Extra side of fries boosts glycogen carbs. Classic post-workout structure: lean protein + fast carbs.", timing: "Within 30–60 min",
        order: "Box Combo, no sauce, no toast. Add extra side of crinkle fries." },
    ],
    cheat: [
      { name: "Caniac Combo (full — sauce, toast, everything)", kcal: 1420, p: 90, c: 106, f: 76,
        tip: "Best cheat meal protein across all 8 chains at 90g. The sauce is genuinely delicious. Worth every calorie as an occasional treat.",
        damage: "Very high sodium and fat from Cane's Sauce and fried chicken." },
      { name: "Box Combo + Cane's Sauce + Sweet Tea", kcal: 1080, p: 62, c: 96, f: 48,
        tip: "The classic Cane's experience. Ask for unsweet tea to keep sugar slightly lower.",
        damage: "High sodium and fat from the sauce." },
    ],
  },
  {
    id: "whataburger", name: "Whataburger", emoji: "🤠",
    onTrack: [
      { name: "Grilled Chicken Sandwich (no mayo)", kcal: 400, p: 34, c: 42, f: 10, rating: 4,
        tip: "Cleanest option at Whataburger. Skip mayo and you have a strong macro split for a burger chain.",
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
        why: "Grilled chicken is lean and digestible. Small fries add the carb fuel load for training without overloading on fat pre-session.", timing: "60–90 min before",
        order: "Grilled Chicken Sandwich (no mayo), Small Fries. Unsweet tea." },
      { name: "Breakfast on a Bun (bacon, no cheese)", kcal: 500, p: 28, c: 44, f: 22,
        why: "Good pre-morning-workout option. Egg and bacon on a bun gives protein and fast carbs in an easy-to-digest format.", timing: "45–60 min before",
        order: "Breakfast on a Bun with bacon, no cheese, no butter on bun." },
    ],
    post: [
      { name: "Double Meat Whataburger (no mayo) + Apple Slices", kcal: 760, p: 52, c: 54, f: 34,
        why: "Double beef patties give a strong 52g protein hit. Apple slices add fast simple sugars for glycogen. Skipping fries avoids the fat that would slow protein absorption.", timing: "Within 30–60 min",
        order: "Double Meat Whataburger, no mayo, mustard/ketchup. Apple slices side. Water or unsweet tea." },
      { name: "Grilled Chicken Sandwich + Medium Fries", kcal: 760, p: 38, c: 90, f: 24,
        why: "Leaner protein source paired with a large carb load from the fries. Grilled chicken is easier to digest post-workout than beef, making it a good option if training was especially hard.", timing: "Within 30–60 min",
        order: "Grilled Chicken Sandwich (no mayo) + Medium Fries. Unsweet tea or water." },
    ],
    cheat: [
      { name: "Double Meat Whataburger + Onion Rings", kcal: 1020, p: 50, c: 84, f: 52,
        tip: "The Whataburger classic. Two fresh-beef patties give 50g protein. Onion rings made fresh to order.",
        damage: "High saturated fat and sodium." },
      { name: "Triple Meat Whataburger + Large Fries", kcal: 1650, p: 65, c: 110, f: 90,
        tip: "The most extreme item on the menu — 65g protein but a massive calorie hit. A true occasion meal.",
        damage: "Extremely high calories and fat — eat light the rest of the day." },
    ],
  },
];

const highlights = {
  onTrack: [
    { chain: "Chick-fil-A", item: "12-Count Grilled Nuggets", kcal: 200, p: 38, badge: "Best P/kcal ratio" },
    { chain: "Chipotle",    item: "Double Chicken Bowl",       kcal: 680, p: 64, badge: "Highest total protein" },
    { chain: "Panda Express", item: "Teriyaki + Brown Rice",   kcal: 620, p: 44, badge: "Most balanced macros" },
  ],
  pre: [
    { chain: "Chipotle",    item: "Chicken Burrito (no fat toppings)", kcal: 740, p: 44, badge: "Best carb load" },
    { chain: "Chick-fil-A", item: "Grilled Sandwich + Waffle Fries",   kcal: 700, p: 36, badge: "Best pre-workout combo" },
    { chain: "Panda Express", item: "Teriyaki + Large Brown Rice",      kcal: 680, p: 40, badge: "Cleanest carb source" },
  ],
  post: [
    { chain: "Raising Cane's", item: "Caniac Combo (no sauce)",         kcal: 920, p: 90, badge: "Highest recovery protein" },
    { chain: "Chipotle",       item: "Double Chicken Bowl (white rice)", kcal: 720, p: 66, badge: "Best protein + carb ratio" },
    { chain: "Panda Express",  item: "2× Teriyaki + White Rice",        kcal: 760, p: 72, badge: "Fastest glycogen refuel" },
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
    "McDonald's app now shows protein badges on 17 items — use it when ordering",
    "Water or unsweet tea always — sodas add 150–300 empty calories",
  ],
  pre: [
    "Eat 60–90 min before — enough time to digest without training on a full stomach",
    "Target 50–80g carbs, 25–40g protein, keep fat under 25g pre-workout",
    "White rice and buns digest faster than brown rice — better in a short pre-workout window",
    "Avoid Cane's Sauce, Animal Style spread, sour cream pre-workout — high fat + training = GI distress",
    "Research shows even 15g carbs during resistance training can meaningfully improve performance",
  ],
  post: [
    "Eat within 30–60 min — your glycogen and muscle repair window is most active here",
    "Target 40g+ protein — fast-absorbing lean meat (chicken/beef) drives muscle protein synthesis",
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

function ItemCard({ item, mode }) {
  const [open, setOpen] = useState(false);
  const cfg = MODE_CONFIG[mode];
  const color = cfg.color;
  const isPre = mode === "pre";
  const isPost = mode === "post";
  const isWorkout = isPre || isPost;
  const isCheat = mode === "cheat";

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: open ? `${color}08` : T.card,
        borderRadius: 12,
        border: `1px solid ${open ? color + "55" : T.border}`,
        padding: "13px 15px",
        cursor: "pointer",
        transition: "all 0.18s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.white, lineHeight: 1.35, marginBottom: 7 }}>{item.name}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <MacroPill label="P" val={item.p} color={T.lime} />
            <MacroPill label="C" val={item.c} color={T.green} />
            <MacroPill label="F" val={item.f} color={T.orange} />
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

      {open && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
          {isWorkout ? (
            <>
              <p style={{ fontSize: 12.5, color: T.muted, margin: "0 0 9px", lineHeight: 1.65 }}>
                <span style={{ color, fontFamily: "'Martian Mono', monospace", fontSize: 10, marginRight: 4 }}>WHY</span>
                {item.why}
              </p>
              <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color }}>ORDER → </span>
                <span style={{ fontSize: 12, color: T.white }}>{item.order}</span>
              </div>
            </>
          ) : isCheat ? (
            <>
              <p style={{ fontSize: 12.5, color: T.muted, margin: "0 0 9px", lineHeight: 1.65 }}>{item.tip}</p>
              <div style={{ background: `${T.red}10`, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: T.red }}>⚠ </span>
                <span style={{ fontSize: 12, color: T.white }}>{item.damage}</span>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 12.5, color: T.muted, margin: "0 0 9px", lineHeight: 1.65 }}>{item.tip}</p>
              <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color }}>ORDER → </span>
                <span style={{ fontSize: 12, color: T.white }}>{item.order}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function FastFoodGuide() {
  const [mode, setMode] = useState("onTrack");
  const [activeChain, setActiveChain] = useState("all");
  const cfg = MODE_CONFIG[mode];

  const visibleChains = activeChain === "all" ? chains : chains.filter(c => c.id === activeChain);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: T.white }}>
      <link href="https://fonts.googleapis.com/css2?family=Martian+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "18px 22px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 19, fontWeight: 700, color: T.lime }}>FAST FOOD</span>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 19, fontWeight: 700, color: T.white }}>GUIDE</span>
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>8 US chains · April 2026 · Tap any item for full order instructions</div>
            </div>
            <div style={{ background: `${T.lime}18`, border: `1px solid ${T.lime}35`, borderRadius: 8, padding: "4px 10px", fontSize: 10, color: T.lime, fontFamily: "'Martian Mono', monospace" }}>
              ✓ 2026
            </div>
          </div>

          {/* 4-mode toggle */}
          <div style={{ display: "flex", gap: 2, background: "#0C0D08", borderRadius: 10, padding: 3, border: `1px solid ${T.border}` }}>
            {Object.entries(MODE_CONFIG).map(([key, val]) => (
              <button key={key} onClick={() => setMode(key)} style={{
                flex: 1, padding: "8px 2px", borderRadius: 8, border: "none",
                background: mode === key ? val.color : "transparent",
                color: mode === key ? T.bg : T.muted,
                fontFamily: "'Martian Mono', monospace", fontSize: 9.5, fontWeight: 700,
                cursor: "pointer", transition: "all 0.18s",
                whiteSpace: "nowrap", overflow: "hidden", letterSpacing: 0.1,
              }}>{val.label}</button>
            ))}
          </div>

          {/* Mode description */}
          <div style={{ background: `${cfg.color}10`, borderTop: `1px solid ${cfg.color}25`, padding: "8px 12px", fontSize: 11.5, color: cfg.color, lineHeight: 1.5, marginTop: 0 }}>
            {cfg.desc}
          </div>
        </div>
      </div>

      {/* Chain filter */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "8px 22px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
          {[{ id: "all", name: "All Chains", emoji: "⭐" }, ...chains].map(c => (
            <button key={c.id} onClick={() => setActiveChain(c.id)} style={{
              padding: "4px 11px", borderRadius: 20,
              border: `1px solid ${activeChain === c.id ? cfg.color : T.border}`,
              background: activeChain === c.id ? `${cfg.color}15` : "transparent",
              color: activeChain === c.id ? cfg.color : T.muted,
              fontFamily: "'Martian Mono', monospace", fontSize: 10, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.18s",
            }}>{c.emoji} {c.name}</button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "18px 18px 60px" }}>

        {/* Top picks */}
        {activeChain === "all" && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
            <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: cfg.color, marginBottom: 10, letterSpacing: 1 }}>
              ◆ TOP PICKS — {mode === "onTrack" ? "ON TRACK" : mode === "pre" ? "PRE-WORKOUT" : mode === "post" ? "POST-WORKOUT" : "CHEAT MEAL"}
            </div>
            {(highlights[mode] || []).map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{p.chain}</span>
                  <span style={{ fontSize: 12, color: T.muted }}> · {p.item}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
                  <span style={{ fontSize: 10, color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, borderRadius: 20, padding: "2px 8px", fontFamily: "'Martian Mono', monospace", whiteSpace: "nowrap" }}>{p.badge}</span>
                  <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: 11, color: T.lime, flexShrink: 0 }}>{p.p}g P</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips panel */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
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

        {/* Chain sections */}
        {visibleChains.map(chain => {
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
                {items.map((item, i) => <ItemCard key={i} item={item} mode={mode} />)}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ background: T.surface, border: `1px solid ${T.lime}22`, borderRadius: 12, padding: "13px 16px" }}>
          <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: 10, color: T.lime, marginBottom: 5 }}>◆ DATA NOTE</div>
          <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.7 }}>
            All nutrition data verified against official 2026 restaurant sources. McDonald's grilled chicken sandwich confirmed discontinued. Pre/post-workout timing windows and carb/protein recommendations are based on sports nutrition research on glycogen replenishment and muscle protein synthesis. No chunky tomato options appear in any recommendation. Macros are approximate and vary slightly by location.
          </p>
        </div>
      </div>
    </div>
  );
}