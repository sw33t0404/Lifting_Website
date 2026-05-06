import { useState } from "react";

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

const ACCENT = "#E8FF47";
const DARK = "#0F1008";
const MID = "#1C1E0F";
const CARD = "#181A0C";
const MUTED = "#8A8F6A";
const WHITE = "#F5F5E8";
const GREEN = "#7EFF9A";
const ORANGE = "#FF9A47";
const BLUE = "#47D4FF";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

const catColor = { Breakfast: ACCENT, Lunch: GREEN, Dinner: ORANGE, Snack: BLUE };

const recipes = [
  // ── BREAKFAST ─────────────────────────────────────────────
  {
    id: 1, name: "Overnight Oats + Eggs", cat: "Breakfast",
    macros: { kcal: 620, p: 38, c: 72, f: 14 }, time: "5 min prep + overnight",
    servings: 1,
    ingredients: [
      { amount: 80, unit: "g", name: "rolled oats" },
      { amount: 250, unit: "ml", name: "whole milk" },
      { amount: 1, unit: "tbsp", name: "honey" },
      { amount: 100, unit: "g", name: "frozen mixed berries" },
      { amount: 3, unit: null, name: "large eggs" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Mix oats", body: "Combine oats and milk in a jar or bowl. Stir in honey. Cover and refrigerate overnight (or at least 4 hrs)." },
      { title: "Add berries", body: "In the morning, top cold oats with berries straight from frozen — they defrost quickly." },
      { title: "Scramble eggs", body: "Heat olive oil in a non-stick pan over medium heat. Crack in eggs, season, and scramble gently for 2–3 min until just set. Serve alongside the oats." },
    ],
    tips: "Prep a week's worth of oat jars on Sunday — just grab and go each morning.",
  },
  {
    id: 2, name: "Omelette + Sourdough Toast", cat: "Breakfast",
    macros: { kcal: 580, p: 34, c: 56, f: 18 }, time: "10 min",
    servings: 1,
    ingredients: [
      { amount: 3, unit: null, name: "large eggs" },
      { amount: 40, unit: "g", name: "spinach" },
      { amount: 30, unit: "g", name: "mixed peppers, diced" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 2, unit: null, name: "thick slices sourdough bread" },
      { amount: 1, unit: "pinch", name: "salt, pepper & paprika" },
    ],
    steps: [
      { title: "Prep filling", body: "Dice peppers. Whisk eggs with salt, pepper, and paprika in a bowl." },
      { title: "Cook omelette", body: "Heat oil in a non-stick pan over medium heat. Add peppers and cook 2 min, then add spinach until wilted. Pour eggs over, cook undisturbed 1–2 min until mostly set, then fold in half." },
      { title: "Toast bread", body: "Toast sourdough slices until golden. Serve alongside omelette." },
    ],
    tips: "Add cottage cheese or left-over chicken to the filling to boost protein further.",
  },
  {
    id: 3, name: "Performance Smoothie", cat: "Breakfast",
    macros: { kcal: 640, p: 42, c: 80, f: 12 }, time: "5 min",
    servings: 1,
    ingredients: [
      { amount: 1, unit: null, name: "large banana (frozen is best)" },
      { amount: 60, unit: "g", name: "rolled oats" },
      { amount: 1, unit: null, name: "scoop whey protein (vanilla or unflavoured)" },
      { amount: 300, unit: "ml", name: "whole milk" },
      { amount: 40, unit: "g", name: "spinach (optional — barely affects flavour)" },
      { amount: 1, unit: "tbsp", name: "peanut butter" },
    ],
    steps: [
      { title: "Blend", body: "Add all ingredients to a blender. Blend on high for 45–60 seconds until completely smooth." },
      { title: "Adjust", body: "If too thick, add a splash more milk. Drink immediately or store in a shaker for up to 4 hrs in the fridge." },
    ],
    tips: "Swap banana for frozen mango for a tropical variation (Week 2 Wednesday). Pre-measure dry ingredients the night before to save time.",
  },
  {
    id: 4, name: "Oat Flour Pancakes + Eggs", cat: "Breakfast",
    macros: { kcal: 680, p: 36, c: 88, f: 16 }, time: "20 min",
    servings: 1,
    ingredients: [
      { amount: 100, unit: "g", name: "oat flour (or blend rolled oats)" },
      { amount: 1, unit: "tsp", name: "baking powder" },
      { amount: 1, unit: "pinch", name: "salt" },
      { amount: 150, unit: "ml", name: "whole milk" },
      { amount: 2, unit: null, name: "large eggs (1 in batter, 1 fried alongside)" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 2, unit: "tbsp", name: "maple syrup" },
      { amount: 80, unit: "g", name: "fresh or frozen berries (to serve)" },
    ],
    steps: [
      { title: "Make batter", body: "Whisk oat flour, baking powder and salt. Beat in 1 egg and milk until smooth. Rest 5 min." },
      { title: "Cook pancakes", body: "Heat a non-stick pan over medium heat with a little oil. Pour in roughly ¼ of the batter per pancake. Cook 2–3 min per side until golden and cooked through. Makes ~3 pancakes." },
      { title: "Fry egg", body: "In the same pan, fry or scramble the remaining egg." },
      { title: "Serve", body: "Stack pancakes, top with berries and maple syrup. Serve fried egg on the side." },
    ],
    tips: "Batch-cook pancakes and freeze between sheets of baking paper — reheat in a toaster straight from frozen.",
  },
  {
    id: 5, name: "Egg Muffins + Whole-grain Toast", cat: "Breakfast",
    macros: { kcal: 580, p: 36, c: 54, f: 18 }, time: "25 min",
    servings: 1,
    ingredients: [
      { amount: 4, unit: null, name: "large eggs" },
      { amount: 50, unit: "g", name: "spinach, chopped" },
      { amount: 40, unit: "g", name: "mixed peppers, diced" },
      { amount: 30, unit: "g", name: "spring onion, sliced" },
      { amount: 1, unit: "pinch", name: "salt, pepper & paprika" },
      { amount: 2, unit: null, name: "thick slices whole-grain toast" },
    ],
    steps: [
      { title: "Preheat & prep", body: "Preheat oven to 180°C / 350°F. Lightly grease a 4-cup muffin tin." },
      { title: "Mix", body: "Whisk eggs with seasoning. Divide spinach, peppers and spring onion between cups. Pour egg mixture over the top." },
      { title: "Bake", body: "Bake 18–20 minutes until set and lightly golden on top." },
      { title: "Serve", body: "Serve 4 egg muffins with toasted whole-grain bread." },
    ],
    tips: "Make 12 at once and refrigerate for 4 days — grab 4 each morning for a no-cook breakfast all week.",
  },

  // ── LUNCH ──────────────────────────────────────────────────
  {
    id: 6, name: "Chicken Rice Bowl", cat: "Lunch",
    macros: { kcal: 750, p: 52, c: 88, f: 15 }, time: "25 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "chicken breast" },
      { amount: 150, unit: "g", name: "cooked white or brown rice (approx. 60g dry)" },
      { amount: 100, unit: "g", name: "broccoli florets" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "ginger, grated" },
      { amount: 1, unit: "pinch", name: "chilli flakes (optional)" },
    ],
    steps: [
      { title: "Cook rice", body: "Cook rice according to packet. Keep warm." },
      { title: "Sear chicken", body: "Slice chicken breast into strips. Heat oil in a pan over high heat. Cook chicken 5–6 min per side until golden and cooked through (internal temp 75°C / 165°F)." },
      { title: "Steam broccoli", body: "Steam or microwave broccoli 3–4 min until just tender." },
      { title: "Sauce & serve", body: "In the same pan, briefly fry garlic and ginger 30 sec. Add soy sauce and a splash of water. Toss chicken to coat. Serve over rice with broccoli." },
    ],
    tips: "Cook a double batch of chicken on Sunday — slice and refrigerate for easy bowls Mon–Tue.",
  },
  {
    id: 7, name: "Tuna Pasta (passata sauce)", cat: "Lunch",
    macros: { kcal: 720, p: 48, c: 86, f: 12 }, time: "20 min",
    servings: 1,
    ingredients: [
      { amount: 100, unit: "g", name: "pasta (penne or spaghetti, dry weight)" },
      { amount: 2, unit: null, name: "cans tuna in water, drained (2 × 80g)" },
      { amount: 200, unit: "ml", name: "passata (smooth, no chunks)" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "pinch", name: "chilli flakes" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Boil pasta", body: "Cook pasta in well-salted boiling water until al dente. Reserve a cup of pasta water before draining." },
      { title: "Make sauce", body: "While pasta cooks, heat oil in a pan over medium heat. Fry garlic and chilli 1 min. Add passata and oregano, simmer 8 min." },
      { title: "Add tuna", body: "Stir in drained tuna, breaking up gently. Season to taste." },
      { title: "Combine", body: "Toss drained pasta into the sauce, adding a splash of pasta water to loosen if needed. Serve immediately." },
    ],
    tips: "This keeps well for 2 days in the fridge — make a double portion for easy meal prep.",
  },
  {
    id: 8, name: "Chicken Wrap + Avocado", cat: "Lunch",
    macros: { kcal: 730, p: 46, c: 74, f: 22 }, time: "15 min",
    servings: 1,
    ingredients: [
      { amount: 180, unit: "g", name: "cooked chicken breast, sliced" },
      { amount: 2, unit: null, name: "large whole-grain wraps" },
      { amount: 1, unit: null, name: "ripe avocado" },
      { amount: 60, unit: "g", name: "mixed salad leaves" },
      { amount: 2, unit: null, name: "spring onions, sliced" },
      { amount: 1, unit: "tbsp", name: "lemon juice" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "pinch", name: "salt, pepper & paprika" },
    ],
    steps: [
      { title: "Prep avocado", body: "Halve and pit avocado. Scoop flesh, mash with lemon juice, salt and pepper." },
      { title: "Assemble wraps", body: "Lay wraps flat. Spread mashed avocado over each. Top with salad leaves, chicken slices and spring onion. Drizzle with olive oil and paprika." },
      { title: "Wrap & serve", body: "Fold in sides, then roll tightly. Slice diagonally and serve." },
    ],
    tips: "Use leftover roasted or poached chicken. The lemon in the avocado stops browning if you're packing it to go.",
  },
  {
    id: 9, name: "Beef + Potato Stew (passata base)", cat: "Lunch",
    macros: { kcal: 760, p: 50, c: 80, f: 18 }, time: "40 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "lean beef mince" },
      { amount: 200, unit: "g", name: "potatoes, diced into 2cm cubes" },
      { amount: 200, unit: "ml", name: "passata" },
      { amount: 200, unit: "ml", name: "beef or chicken stock" },
      { amount: 100, unit: "g", name: "carrots, diced" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "cumin" },
      { amount: 1, unit: "tsp", name: "paprika" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Brown beef", body: "Heat oil in a deep pan over high heat. Add mince, breaking up, and cook until browned all over (5–6 min). Season well." },
      { title: "Add aromatics", body: "Add garlic, cumin and paprika. Stir 1 min." },
      { title: "Add veg & sauce", body: "Add carrots, potatoes, passata and stock. Stir to combine. Bring to a boil." },
      { title: "Simmer", body: "Reduce heat to low, cover and simmer 25–30 min until potatoes are fully tender and sauce has thickened." },
    ],
    tips: "Makes excellent leftovers — make a double batch and refrigerate for 3 days. Freezes well too.",
  },
  {
    id: 10, name: "Tuna Rice Bowl + Edamame", cat: "Lunch",
    macros: { kcal: 740, p: 52, c: 80, f: 14 }, time: "15 min",
    servings: 1,
    ingredients: [
      { amount: 150, unit: "g", name: "cooked rice (approx. 60g dry)" },
      { amount: 2, unit: null, name: "cans tuna in water, drained" },
      { amount: 100, unit: "g", name: "frozen edamame" },
      { amount: 40, unit: "g", name: "spring onions, sliced" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "sesame oil (or olive oil)" },
      { amount: 1, unit: "tsp", name: "ginger, grated" },
      { amount: 1, unit: "tsp", name: "lemon juice" },
    ],
    steps: [
      { title: "Cook edamame", body: "Microwave frozen edamame with a splash of water for 3–4 min, or cook per packet instructions. Drain." },
      { title: "Make dressing", body: "Mix soy sauce, oil, ginger and lemon juice together." },
      { title: "Assemble bowl", body: "Layer rice, tuna (broken into chunks) and edamame in a bowl. Pour dressing over. Top with spring onions." },
    ],
    tips: "Keep cooked rice in the fridge for 3 days — makes this bowl a 5-min lunch when prepped ahead.",
  },
  {
    id: 11, name: "Turkey Rice Bowl + Spinach", cat: "Lunch",
    macros: { kcal: 740, p: 52, c: 82, f: 14 }, time: "20 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "turkey mince" },
      { amount: 150, unit: "g", name: "cooked brown rice (approx. 60g dry)" },
      { amount: 80, unit: "g", name: "fresh spinach" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "cumin" },
      { amount: 1, unit: "pinch", name: "chilli flakes" },
    ],
    steps: [
      { title: "Cook turkey", body: "Heat oil in a pan over high heat. Add turkey mince and cook, breaking up, 6–8 min until cooked through and golden." },
      { title: "Season", body: "Add garlic, cumin and chilli. Cook 1 min. Add soy sauce and stir to coat." },
      { title: "Wilt spinach", body: "Add spinach directly to the pan. Stir until just wilted (1–2 min)." },
      { title: "Serve", body: "Serve turkey and spinach over cooked brown rice." },
    ],
  },
  {
    id: 12, name: "Chicken Caesar Wrap", cat: "Lunch",
    macros: { kcal: 720, p: 46, c: 72, f: 20 }, time: "15 min",
    servings: 1,
    ingredients: [
      { amount: 180, unit: "g", name: "cooked chicken breast, sliced" },
      { amount: 2, unit: null, name: "large whole-grain wraps" },
      { amount: 60, unit: "g", name: "romaine or cos lettuce, chopped" },
      { amount: 20, unit: "g", name: "parmesan, grated (optional)" },
      { amount: 2, unit: "tbsp", name: "Greek yogurt (Caesar dressing base)" },
      { amount: 1, unit: "tsp", name: "lemon juice" },
      { amount: 1, unit: null, name: "garlic clove, grated" },
      { amount: 1, unit: "tsp", name: "Worcestershire sauce" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Make dressing", body: "Mix Greek yogurt, lemon juice, grated garlic, Worcestershire sauce, salt and pepper. Taste and adjust." },
      { title: "Assemble", body: "Lay wraps flat. Spread dressing generously over each. Top with lettuce, chicken slices and parmesan." },
      { title: "Wrap & slice", body: "Fold in sides, roll tightly, and cut diagonally." },
    ],
    tips: "The yogurt dressing is just as creamy as mayo-based Caesar but adds extra protein.",
  },
  {
    id: 13, name: "Salmon + Rice + Edamame Bowl", cat: "Lunch",
    macros: { kcal: 760, p: 50, c: 82, f: 20 }, time: "20 min",
    servings: 1,
    ingredients: [
      { amount: 150, unit: "g", name: "salmon fillet" },
      { amount: 150, unit: "g", name: "cooked rice" },
      { amount: 100, unit: "g", name: "frozen edamame, cooked" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "sesame oil" },
      { amount: 1, unit: "tsp", name: "honey" },
      { amount: 1, unit: "tsp", name: "ginger, grated" },
      { amount: 1, unit: null, name: "lemon, juice of" },
      { amount: 30, unit: "g", name: "spring onions" },
    ],
    steps: [
      { title: "Cook salmon", body: "Season salmon with salt and pepper. Pan-fry skin-side down in a dry non-stick pan over medium-high heat for 4 min. Flip and cook 2–3 min more until cooked through." },
      { title: "Make sauce", body: "Mix soy sauce, sesame oil, honey, ginger and lemon juice." },
      { title: "Assemble", body: "Flake salmon over rice. Add edamame. Drizzle with sauce and top with spring onions." },
    ],
  },
  {
    id: 14, name: "Beef Taco Bowl", cat: "Lunch",
    macros: { kcal: 800, p: 52, c: 84, f: 20 }, time: "25 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "lean beef mince" },
      { amount: 150, unit: "g", name: "cooked rice" },
      { amount: 150, unit: "ml", name: "passata (smooth — no chunks)" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "cumin" },
      { amount: 1, unit: "tsp", name: "paprika" },
      { amount: 0.5, unit: "tsp", name: "chilli powder" },
      { amount: 0.5, unit: null, name: "avocado, sliced" },
      { amount: 40, unit: "g", name: "mixed salad leaves" },
      { amount: 2, unit: "tbsp", name: "Greek yogurt (sour cream sub)" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Cook beef", body: "Brown mince in a dry pan over high heat, breaking up well, 5–6 min. Drain excess fat if needed." },
      { title: "Season & sauce", body: "Add garlic, cumin, paprika and chilli powder. Stir 1 min. Add passata, season. Simmer 8–10 min until thick and saucy." },
      { title: "Build bowl", body: "Layer rice, then seasoned beef in a bowl. Top with salad leaves, sliced avocado and a dollop of Greek yogurt." },
    ],
    tips: "This is your tomato-preference-friendly taco bowl — smooth passata gives all the flavour with zero chunks.",
  },
  {
    id: 15, name: "Beef + Potato Hash", cat: "Lunch",
    macros: { kcal: 770, p: 50, c: 82, f: 18 }, time: "30 min",
    servings: 1,
    ingredients: [
      { amount: 180, unit: "g", name: "lean beef mince" },
      { amount: 220, unit: "g", name: "potatoes, diced small" },
      { amount: 100, unit: "ml", name: "passata" },
      { amount: 80, unit: "g", name: "mixed peppers, diced" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "paprika" },
      { amount: 1, unit: "tsp", name: "cumin" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Par-cook potatoes", body: "Microwave diced potatoes 4–5 min until nearly tender, or boil 8 min. Drain." },
      { title: "Fry hash", body: "Heat oil in a large pan over high heat. Add potatoes and cook undisturbed 3–4 min to crisp. Add peppers and cook 3 more min." },
      { title: "Add beef", body: "Push veg to the side. Add beef mince, cook breaking up 5 min until browned. Mix everything together." },
      { title: "Season & finish", body: "Add garlic, paprika, cumin and passata. Stir to combine and cook 5 min until sauce thickens. Season to taste." },
    ],
  },

  // ── DINNER ─────────────────────────────────────────────────
  {
    id: 16, name: "Salmon + Sweet Potato + Broccoli", cat: "Dinner",
    macros: { kcal: 740, p: 46, c: 72, f: 22 }, time: "35 min",
    servings: 1,
    ingredients: [
      { amount: 180, unit: "g", name: "salmon fillet" },
      { amount: 300, unit: "g", name: "sweet potato, cubed" },
      { amount: 150, unit: "g", name: "broccoli florets" },
      { amount: 1, unit: "tbsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "paprika" },
      { amount: 1, unit: null, name: "lemon, halved" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Roast sweet potato", body: "Preheat oven to 200°C / 390°F. Toss sweet potato cubes with ½ tbsp olive oil, paprika, salt and pepper. Roast on a tray 25 min, flipping halfway." },
      { title: "Add broccoli", body: "Add broccoli to the tray after 15 min, drizzle with a little oil, toss and roast together the remaining 10 min." },
      { title: "Cook salmon", body: "Season salmon with salt and pepper. Heat remaining oil in an oven-proof pan over high heat. Sear salmon skin-side up 2 min. Flip, top with garlic and a squeeze of lemon, then finish in the oven 8–10 min until cooked through." },
      { title: "Serve", body: "Plate the roasted veg alongside salmon. Squeeze remaining lemon over everything." },
    ],
    tips: "All three components go in the oven at the same time — minimal washing up.",
  },
  {
    id: 17, name: "Turkey Stir-Fry + Brown Rice", cat: "Dinner",
    macros: { kcal: 760, p: 54, c: 84, f: 16 }, time: "25 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "turkey mince" },
      { amount: 150, unit: "g", name: "cooked brown rice" },
      { amount: 100, unit: "g", name: "broccoli florets" },
      { amount: 80, unit: "g", name: "mixed peppers, sliced" },
      { amount: 60, unit: "g", name: "courgette, sliced" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "ginger, grated" },
      { amount: 2, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "honey" },
    ],
    steps: [
      { title: "Cook rice", body: "Cook brown rice per packet or use pre-cooked. Keep warm." },
      { title: "Make sauce", body: "Mix soy sauce, honey, garlic and ginger together in a small bowl." },
      { title: "Stir-fry", body: "Heat oil in a wok or large pan over very high heat. Add turkey mince and cook 5–6 min breaking up until golden. Add peppers, broccoli and courgette. Stir-fry 4–5 min until veg is just tender." },
      { title: "Finish", body: "Pour sauce over everything. Toss well and cook 1–2 min more. Serve immediately over rice." },
    ],
  },
  {
    id: 18, name: "Baked Cod + Quinoa + Green Beans", cat: "Dinner",
    macros: { kcal: 720, p: 52, c: 72, f: 14 }, time: "30 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "cod fillet" },
      { amount: 80, unit: "g", name: "quinoa, dry" },
      { amount: 150, unit: "g", name: "green beans, trimmed" },
      { amount: 1, unit: "tbsp", name: "olive oil" },
      { amount: 1, unit: null, name: "lemon, zested and juiced" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "paprika" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Cook quinoa", body: "Rinse quinoa. Add to a pot with 180ml water and a pinch of salt. Bring to boil, reduce heat, cover and cook 15 min until water is absorbed. Fluff with a fork." },
      { title: "Bake cod", body: "Preheat oven to 200°C. Place cod on a baking tray. Mix olive oil, lemon zest, lemon juice, garlic, paprika, salt and pepper. Spoon over cod. Bake 12–15 min until fish flakes easily." },
      { title: "Steam beans", body: "Steam or boil green beans 4–5 min until bright green and just tender." },
      { title: "Serve", body: "Plate quinoa, top with cod and serve green beans on the side. Spoon any pan juices over." },
    ],
  },
  {
    id: 19, name: "Chicken Thighs + Roasted Veg + Rice", cat: "Dinner",
    macros: { kcal: 770, p: 52, c: 82, f: 20 }, time: "40 min",
    servings: 1,
    ingredients: [
      { amount: 220, unit: "g", name: "boneless chicken thighs (skin-off)" },
      { amount: 150, unit: "g", name: "cooked rice" },
      { amount: 100, unit: "g", name: "mixed peppers, chunked" },
      { amount: 80, unit: "g", name: "courgette, chunked" },
      { amount: 80, unit: "g", name: "carrot, chunked" },
      { amount: 1.5, unit: "tbsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "paprika" },
      { amount: 1, unit: "tsp", name: "cumin" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Marinate", body: "Mix 1 tbsp olive oil with paprika, cumin, oregano, garlic, salt and pepper. Coat chicken thighs and set aside (even 10 min helps)." },
      { title: "Roast veg", body: "Preheat oven to 210°C. Toss peppers, courgette and carrot with remaining oil and seasoning on a baking tray. Roast 15 min." },
      { title: "Add chicken", body: "Place marinated chicken thighs on the same tray amongst the veg. Roast a further 22–25 min until chicken is golden and cooked through (internal temp 75°C)." },
      { title: "Serve", body: "Plate rice, top with chicken and roasted veg." },
    ],
  },
  {
    id: 20, name: "Lean Beef Mince Bolognese", cat: "Dinner",
    macros: { kcal: 800, p: 54, c: 86, f: 18 }, time: "35 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "lean beef mince" },
      { amount: 100, unit: "g", name: "pasta (dry weight)" },
      { amount: 300, unit: "ml", name: "passata (smooth)" },
      { amount: 1, unit: "tbsp", name: "tomato paste" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 60, unit: "g", name: "carrot, grated (adds sweetness)" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
      { amount: 1, unit: "tsp", name: "Worcestershire sauce (optional)" },
    ],
    steps: [
      { title: "Brown mince", body: "Heat oil in a deep pan over high heat. Add mince, breaking up with a spoon. Cook 6–7 min until browned and any moisture evaporated." },
      { title: "Add aromatics", body: "Add garlic and grated carrot. Cook 2–3 min, stirring." },
      { title: "Build sauce", body: "Add passata, tomato paste, oregano and Worcestershire sauce. Season well. Bring to a simmer, reduce heat to low and cook 20 min, stirring occasionally, until sauce is rich and thick." },
      { title: "Cook pasta", body: "Cook pasta in salted boiling water to al dente. Reserve a ladle of pasta water, then drain." },
      { title: "Combine & serve", body: "Toss pasta with sauce, adding a splash of pasta water to loosen. Serve immediately." },
    ],
    tips: "Grating the carrot into the sauce keeps it smooth (no chunks) while adding natural sweetness that balances the passata perfectly.",
  },
  {
    id: 21, name: "Baked Salmon + Sweet Potato Mash", cat: "Dinner",
    macros: { kcal: 760, p: 48, c: 72, f: 24 }, time: "35 min",
    servings: 1,
    ingredients: [
      { amount: 180, unit: "g", name: "salmon fillet" },
      { amount: 350, unit: "g", name: "sweet potato" },
      { amount: 1, unit: "tbsp", name: "whole milk (for mash)" },
      { amount: 1, unit: "tsp", name: "butter or olive oil (for mash)" },
      { amount: 1, unit: "tbsp", name: "olive oil (for salmon)" },
      { amount: 1, unit: "tsp", name: "honey" },
      { amount: 1, unit: "tsp", name: "Dijon mustard" },
      { amount: 1, unit: null, name: "lemon, halved" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Cook sweet potato", body: "Peel and cube sweet potato. Boil 15–18 min until very tender. Drain and mash with milk, butter, salt and pepper until smooth." },
      { title: "Glaze salmon", body: "Mix olive oil, honey and mustard. Brush over salmon. Season with salt and pepper." },
      { title: "Bake salmon", body: "Preheat oven to 200°C. Place salmon on a lined tray. Bake 12–15 min until just cooked through and glaze is caramelised." },
      { title: "Serve", body: "Plate mash, top with salmon. Squeeze lemon over." },
    ],
  },
  {
    id: 22, name: "Salmon Stir-Fry + Noodles", cat: "Dinner",
    macros: { kcal: 760, p: 46, c: 82, f: 22 }, time: "20 min",
    servings: 1,
    ingredients: [
      { amount: 180, unit: "g", name: "salmon fillet, cut into chunks" },
      { amount: 100, unit: "g", name: "egg noodles or udon, dry" },
      { amount: 80, unit: "g", name: "broccoli florets" },
      { amount: 80, unit: "g", name: "mixed peppers, sliced" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "ginger, grated" },
      { amount: 2, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "sesame oil" },
      { amount: 1, unit: "tsp", name: "honey" },
    ],
    steps: [
      { title: "Cook noodles", body: "Cook noodles per packet. Drain and toss with a little sesame oil to prevent sticking." },
      { title: "Make sauce", body: "Mix soy sauce, honey, garlic and ginger." },
      { title: "Cook salmon", body: "Heat a wok or large pan over high heat. Add salmon chunks and cook 2–3 min per side until golden. Remove and set aside." },
      { title: "Stir-fry veg", body: "In the same pan, add peppers and broccoli. Stir-fry 3–4 min." },
      { title: "Finish", body: "Add noodles and sauce to the pan. Toss everything together. Gently fold salmon back in. Serve immediately." },
    ],
  },
  {
    id: 23, name: "Cod + Quinoa + Roasted Peppers", cat: "Dinner",
    macros: { kcal: 720, p: 50, c: 74, f: 14 }, time: "30 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "cod fillet" },
      { amount: 80, unit: "g", name: "quinoa, dry" },
      { amount: 150, unit: "g", name: "mixed peppers, sliced" },
      { amount: 1, unit: "tbsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "smoked paprika" },
      { amount: 1, unit: "tsp", name: "cumin" },
      { amount: 1, unit: null, name: "lemon, juice of" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Roast peppers", body: "Preheat oven to 200°C. Toss sliced peppers with ½ tbsp olive oil, cumin and seasoning. Roast 20–22 min until soft and slightly charred." },
      { title: "Cook quinoa", body: "Rinse quinoa, cook in 180ml salted water for 15 min. Fluff with a fork." },
      { title: "Season & bake cod", body: "Mix remaining oil with smoked paprika, garlic, lemon and seasoning. Coat cod. Place on a lined tray and bake 12–15 min until flaky." },
      { title: "Serve", body: "Plate quinoa topped with roasted peppers. Lay cod on top." },
    ],
  },
  {
    id: 24, name: "Turkey Mince + Pasta (passata sauce)", cat: "Dinner",
    macros: { kcal: 790, p: 54, c: 88, f: 16 }, time: "30 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "turkey mince" },
      { amount: 100, unit: "g", name: "pasta (dry)" },
      { amount: 300, unit: "ml", name: "passata" },
      { amount: 1, unit: "tbsp", name: "tomato paste" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "oregano" },
      { amount: 0.5, unit: "tsp", name: "chilli flakes" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Brown turkey", body: "Heat oil in a pan. Add turkey mince, cook 6–7 min breaking up until cooked through and golden." },
      { title: "Build sauce", body: "Add garlic and chilli, cook 1 min. Add passata, tomato paste and oregano. Season. Simmer 15 min." },
      { title: "Cook & combine", body: "Cook pasta in salted water. Drain (reserving a little pasta water). Toss pasta with sauce." },
    ],
  },
  {
    id: 25, name: "Baked Salmon + Brown Rice + Broccoli", cat: "Dinner",
    macros: { kcal: 760, p: 48, c: 76, f: 22 }, time: "30 min",
    servings: 1,
    ingredients: [
      { amount: 180, unit: "g", name: "salmon fillet" },
      { amount: 70, unit: "g", name: "brown rice, dry" },
      { amount: 150, unit: "g", name: "broccoli florets" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "honey" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: null, name: "garlic clove, minced" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Cook rice", body: "Cook brown rice per packet (usually 25–30 min)." },
      { title: "Glaze & bake salmon", body: "Preheat oven to 200°C. Mix soy sauce, honey, oil and garlic. Brush over salmon. Bake on a lined tray 12–15 min." },
      { title: "Steam broccoli", body: "Steam or boil broccoli 4–5 min until just tender." },
      { title: "Serve", body: "Plate rice, broccoli and salmon. Spoon any pan glaze over salmon." },
    ],
  },
  {
    id: 26, name: "Salmon Pasta (passata, capers & olives)", cat: "Dinner",
    macros: { kcal: 780, p: 48, c: 84, f: 20 }, time: "25 min",
    servings: 1,
    ingredients: [
      { amount: 180, unit: "g", name: "salmon fillet" },
      { amount: 100, unit: "g", name: "pasta (dry)" },
      { amount: 200, unit: "ml", name: "passata (smooth)" },
      { amount: 1, unit: "tbsp", name: "capers" },
      { amount: 30, unit: "g", name: "olives, pitted and halved" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: null, name: "lemon, zested" },
      { amount: 1, unit: "pinch", name: "chilli flakes" },
    ],
    steps: [
      { title: "Cook pasta", body: "Cook pasta in well-salted boiling water to al dente. Reserve a cup of pasta water, then drain." },
      { title: "Cook salmon", body: "Season salmon and pan-fry in oil 3–4 min per side until cooked through. Remove and flake into large chunks." },
      { title: "Make sauce", body: "In the same pan, fry garlic and chilli 1 min. Add passata, capers, olives and oregano. Simmer 8 min." },
      { title: "Combine", body: "Add pasta and flaked salmon to the sauce. Toss gently, adding pasta water to loosen. Finish with lemon zest." },
    ],
    tips: "A Mediterranean-style dish — the capers and olives bring a great briny punch that makes this one feel like a treat.",
  },
  {
    id: 27, name: "Chicken Thigh + Sweet Potato + Green Beans", cat: "Dinner",
    macros: { kcal: 760, p: 52, c: 78, f: 20 }, time: "40 min",
    servings: 1,
    ingredients: [
      { amount: 220, unit: "g", name: "boneless chicken thighs (skin-off)" },
      { amount: 300, unit: "g", name: "sweet potato, cubed" },
      { amount: 150, unit: "g", name: "green beans, trimmed" },
      { amount: 1.5, unit: "tbsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "paprika" },
      { amount: 1, unit: "tsp", name: "garlic powder" },
      { amount: 1, unit: "tsp", name: "dried thyme" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Roast sweet potato", body: "Preheat oven to 210°C. Toss sweet potato with ½ tbsp oil, paprika and salt. Roast 25 min, flipping halfway." },
      { title: "Cook chicken", body: "Season thighs with garlic powder, thyme, salt and pepper. Heat 1 tbsp oil in an oven-proof pan over high heat. Sear chicken 3 min per side until golden. Finish in the oven for the last 15 min alongside the sweet potato." },
      { title: "Steam beans", body: "Steam green beans 4–5 min until just tender." },
      { title: "Serve", body: "Plate everything together." },
    ],
  },
  {
    id: 28, name: "Chicken Thigh + Quinoa + Roasted Veg", cat: "Dinner",
    macros: { kcal: 770, p: 52, c: 80, f: 20 }, time: "40 min",
    servings: 1,
    ingredients: [
      { amount: 220, unit: "g", name: "boneless chicken thighs" },
      { amount: 80, unit: "g", name: "quinoa, dry" },
      { amount: 80, unit: "g", name: "courgette, chunked" },
      { amount: 80, unit: "g", name: "mixed peppers, chunked" },
      { amount: 80, unit: "g", name: "carrot, chunked" },
      { amount: 1.5, unit: "tbsp", name: "olive oil" },
      { amount: 1, unit: "tsp", name: "cumin" },
      { amount: 1, unit: "tsp", name: "paprika" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "pinch", name: "salt & pepper" },
    ],
    steps: [
      { title: "Roast veg", body: "Preheat oven to 210°C. Toss veg with ½ tbsp oil, cumin and salt. Roast 15 min." },
      { title: "Add chicken", body: "Season thighs with paprika, garlic, oregano, oil, salt and pepper. Place on the tray with veg. Roast 22–25 min more until golden and cooked through." },
      { title: "Cook quinoa", body: "Meanwhile, rinse quinoa and cook in 180ml salted water 15 min. Fluff." },
      { title: "Serve", body: "Plate quinoa, top with roasted veg and chicken. Drizzle with any pan juices." },
    ],
  },

  // ── SNACK ──────────────────────────────────────────────────
  {
    id: 29, name: "Greek Yogurt + Banana + Honey", cat: "Snack",
    macros: { kcal: 340, p: 22, c: 56, f: 4 }, time: "2 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "plain Greek yogurt" },
      { amount: 1, unit: null, name: "large banana, sliced" },
      { amount: 1, unit: "tbsp", name: "honey" },
    ],
    steps: [
      { title: "Assemble", body: "Spoon Greek yogurt into a bowl. Top with sliced banana and drizzle honey over. Eat immediately." },
    ],
    tips: "One of the best post-workout snacks — fast carbs from banana, slow-digesting protein from Greek yogurt.",
  },
  {
    id: 30, name: "Cottage Cheese + Berries", cat: "Snack",
    macros: { kcal: 290, p: 28, c: 32, f: 4 }, time: "2 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "low-fat cottage cheese" },
      { amount: 120, unit: "g", name: "mixed berries (fresh or defrosted from frozen)" },
      { amount: 1, unit: "tsp", name: "honey (optional)" },
    ],
    steps: [
      { title: "Defrost berries", body: "If using frozen berries, microwave 60 seconds or leave at room temp 15 min to defrost." },
      { title: "Assemble", body: "Spoon cottage cheese into a bowl. Top with berries. Drizzle honey if desired." },
    ],
    tips: "Cottage cheese is extremely high in casein protein, which digests slowly — making this ideal as an evening snack.",
  },
  {
    id: 31, name: "Rice Cakes + Peanut Butter", cat: "Snack",
    macros: { kcal: 320, p: 10, c: 38, f: 14 }, time: "2 min",
    servings: 1,
    ingredients: [
      { amount: 4, unit: null, name: "plain rice cakes" },
      { amount: 2, unit: "tbsp", name: "natural peanut butter (no added sugar)" },
    ],
    steps: [
      { title: "Spread & eat", body: "Spread peanut butter evenly over rice cakes. Simple as that." },
    ],
    tips: "A great pre-workout snack — easy carbs from rice cakes + healthy fats and protein from peanut butter for sustained energy.",
  },
  {
    id: 32, name: "Greek Yogurt + Mixed Nuts", cat: "Snack",
    macros: { kcal: 340, p: 20, c: 22, f: 18 }, time: "2 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "plain Greek yogurt" },
      { amount: 30, unit: "g", name: "mixed nuts (cashews, almonds, walnuts)" },
    ],
    steps: [
      { title: "Assemble", body: "Spoon yogurt into a bowl or cup. Top with a handful of mixed nuts." },
    ],
  },
  {
    id: 33, name: "Banana + Whey Shake", cat: "Snack",
    macros: { kcal: 340, p: 30, c: 42, f: 4 }, time: "3 min",
    servings: 1,
    ingredients: [
      { amount: 1, unit: null, name: "large banana" },
      { amount: 1, unit: null, name: "scoop whey protein powder" },
      { amount: 250, unit: "ml", name: "water or milk" },
    ],
    steps: [
      { title: "Blend or shake", body: "Add all ingredients to a blender or shaker bottle. Blend until smooth or shake vigorously until well-mixed." },
    ],
    tips: "Ideal within 30 min post-workout — fast-absorbing whey protein + banana carbs for recovery.",
  },
  {
    id: 34, name: "Cottage Cheese + Honey + Walnuts", cat: "Snack",
    macros: { kcal: 320, p: 22, c: 22, f: 14 }, time: "2 min",
    servings: 1,
    ingredients: [
      { amount: 200, unit: "g", name: "low-fat cottage cheese" },
      { amount: 1, unit: "tbsp", name: "honey" },
      { amount: 20, unit: "g", name: "walnuts, roughly chopped" },
    ],
    steps: [
      { title: "Assemble", body: "Spoon cottage cheese into a bowl. Drizzle honey over and top with walnuts." },
    ],
  },
  {
    id: 35, name: "Whey Shake + Oats", cat: "Snack",
    macros: { kcal: 360, p: 32, c: 46, f: 6 }, time: "5 min",
    servings: 1,
    ingredients: [
      { amount: 1, unit: null, name: "scoop whey protein" },
      { amount: 50, unit: "g", name: "rolled oats" },
      { amount: 250, unit: "ml", name: "milk" },
    ],
    steps: [
      { title: "Quick oats", body: "Microwave oats with milk for 2–3 min, stirring halfway, until thick." },
      { title: "Mix in protein", body: "Stir in whey protein immediately while oats are hot. Mix well until dissolved. Eat warm." },
    ],
    tips: "Stirring whey into hot oats rather than blending gives a thick, protein-packed porridge consistency.",
  },
  {
    id: 36, name: "Banana + Peanut Butter", cat: "Snack",
    macros: { kcal: 310, p: 10, c: 40, f: 14 }, time: "1 min",
    servings: 1,
    ingredients: [
      { amount: 1, unit: null, name: "large banana" },
      { amount: 2, unit: "tbsp", name: "natural peanut butter" },
    ],
    steps: [
      { title: "Eat", body: "Peel banana and dip into peanut butter, or slice and top with peanut butter. No cooking required." },
    ],
  },
  {
    id: 37, name: "Whey Shake + Rice Cakes", cat: "Snack",
    macros: { kcal: 340, p: 30, c: 36, f: 6 }, time: "3 min",
    servings: 1,
    ingredients: [
      { amount: 1, unit: null, name: "scoop whey protein" },
      { amount: 250, unit: "ml", name: "water or milk" },
      { amount: 4, unit: null, name: "plain rice cakes" },
    ],
    steps: [
      { title: "Mix shake", body: "Add whey and water/milk to a shaker. Shake 20 seconds until smooth." },
      { title: "Eat", body: "Drink shake alongside rice cakes." },
    ],
  },
];

function MacroPill({ label, val, color }) {
  return (
    <span style={{ background: `${color}18`, color: color, border: `1px solid ${color}40`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontFamily: "'Space Mono', monospace" }}>
      {label}: {val}g
    </span>
  );
}

function RecipeCard({ recipe, onClick }) {
  const color = catColor[recipe.cat];
  return (
    <div
      onClick={onClick}
      style={{ background: CARD, borderRadius: 14, border: "1px solid #2A2D18", padding: "16px 18px", cursor: "pointer", transition: "border-color 0.2s", display: "flex", flexDirection: "column", gap: 10 }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#2A2D18"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, paddingRight: 10 }}>
          <span style={{ background: color, color: DARK, fontSize: 9, fontWeight: 700, fontFamily: "'Space Mono', monospace", padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1, display: "inline-block", marginBottom: 8 }}>
            {recipe.cat}
          </span>
          <div style={{ fontSize: 15, fontWeight: 600, color: WHITE, lineHeight: 1.3 }}>{recipe.name}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color }}>{recipe.macros.kcal}</div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: "'Space Mono', monospace" }}>kcal</div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        <MacroPill label="P" val={recipe.macros.p} color={ACCENT} />
        <MacroPill label="C" val={recipe.macros.c} color={GREEN} />
        <MacroPill label="F" val={recipe.macros.f} color={ORANGE} />
      </div>
      <div style={{ fontSize: 12, color: MUTED }}>⏱ {recipe.time}</div>
    </div>
  );
}

function RecipeDetail({ recipe, onBack }) {
  const color = catColor[recipe.cat];
  return (
    <div>
      <button onClick={onBack} style={{ background: "transparent", border: `1px solid #2A2D18`, color: MUTED, fontFamily: "'Space Mono', monospace", fontSize: 12, padding: "6px 16px", borderRadius: 8, cursor: "pointer", marginBottom: 20 }}>
        ← BACK
      </button>
      <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${color}55`, overflow: "hidden" }}>
        {/* Hero */}
        <div style={{ background: `${color}12`, borderBottom: `1px solid ${color}33`, padding: "22px 24px" }}>
          <span style={{ background: color, color: DARK, fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono', monospace", padding: "2px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>
            {recipe.cat}
          </span>
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, color: WHITE, margin: "10px 0 6px" }}>{recipe.name}</h2>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: MUTED }}>
            <span>⏱ {recipe.time}</span>
            <span>👤 {recipe.servings} serving</span>
          </div>
        </div>

        {/* Macros bar */}
        <div style={{ background: MID, borderBottom: "1px solid #2A2D18", padding: "14px 24px", display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Calories", val: `${recipe.macros.kcal} kcal`, color: color },
            { label: "Protein", val: `${recipe.macros.p}g`, color: ACCENT },
            { label: "Carbs", val: `${recipe.macros.c}g`, color: GREEN },
            { label: "Fat", val: `${recipe.macros.f}g`, color: ORANGE },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "'Space Mono', monospace" }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: m.color, fontFamily: "'Space Mono', monospace" }}>{m.val}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "24px" }}>
          {/* Ingredients */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color, marginBottom: 12, letterSpacing: 1 }}>INGREDIENTS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, borderRadius: 10, overflow: "hidden", border: "1px solid #2A2D18" }}>
              {recipe.ingredients.map((ing, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: i % 2 === 0 ? "#13150A" : "transparent" }}>
                  <span style={{ fontSize: 14, color: WHITE }}>{ing.name}</span>
                  <span style={{ fontSize: 13, color: MUTED, fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>
                    {ing.amount}{ing.unit ? ` ${ing.unit}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: recipe.tips ? 24 : 0 }}>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color, marginBottom: 14, letterSpacing: 1 }}>METHOD</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recipe.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: color, color: DARK, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: WHITE, marginBottom: 4 }}>{step.title}</div>
                    <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 12, padding: "14px 18px", marginTop: 24 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color, marginBottom: 6 }}>💡 ATHLETE'S TIP</div>
              <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.7 }}>{recipe.tips}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipeBook() {
  const [activeCat, setActiveCat] = useLocalStorage("rb-cat", "All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = recipes.filter(r => {
    const catMatch = activeCat === "All" || r.cat === activeCat;
    const searchMatch = r.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: WHITE }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: MID, borderBottom: "1px solid #2A2D18", padding: "20px 24px 16px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: ACCENT, margin: 0 }}>RECIPE</h1>
            <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: WHITE, margin: 0 }}>BOOK</h1>
          </div>
          <p style={{ color: MUTED, fontSize: 13, margin: "0 0 16px" }}>{recipes.length} recipes from your bi-weekly performance plan</p>

          {/* Search */}
          {!selected && (
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes..."
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#13150A", border: "1px solid #2A2D18", borderRadius: 10,
                color: WHITE, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                padding: "10px 16px", outline: "none", marginBottom: 12,
              }}
            />
          )}

          {/* Category filter */}
          {!selected && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  style={{
                    padding: "5px 14px", borderRadius: 20,
                    border: `1px solid ${activeCat === cat ? (catColor[cat] || ACCENT) : "#2A2D18"}`,
                    background: "transparent",
                    color: activeCat === cat ? (catColor[cat] || ACCENT) : MUTED,
                    fontFamily: "'Space Mono', monospace", fontSize: 11, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {cat} {cat !== "All" ? `(${recipes.filter(r => r.cat === cat).length})` : `(${recipes.length})`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 20px 40px" }}>
        {selected ? (
          <RecipeDetail recipe={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: MUTED, padding: "40px 0", fontFamily: "'Space Mono', monospace" }}>No recipes found</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {filtered.map(r => <RecipeCard key={r.id} recipe={r} onClick={() => setSelected(r)} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
