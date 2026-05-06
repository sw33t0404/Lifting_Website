import { useState } from "react";
import MealPlan from "./biweekly-meal-plan";
import RecipeBook from "./performance-recipes";
import WorkoutProgram from "./WorkoutProgram";
import FastFoodGuide from "./fastfood-guide";

const ACCENT = "#E8FF47";
const DARK = "#0F1008";
const MID = "#1C1E0F";
const MUTED = "#8A8F6A";

export default function App() {
  const [view, setView] = useState("plan");

  return (
    <div style={{ background: DARK, minHeight: "100vh" }}>
      <nav style={{
        background: MID,
        borderBottom: "2px solid #2A2D18",
        display: "flex",
        justifyContent: "center",
        padding: "0 24px",
      }}>
        {[
          { key: "plan", label: "MEAL PLAN" },
          { key: "recipes", label: "RECIPES" },
          { key: "workout", label: "WORKOUT" },
          { key: "fastfood", label: "FAST FOOD" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: `3px solid ${view === key ? ACCENT : "transparent"}`,
              color: view === key ? ACCENT : MUTED,
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              padding: "14px 28px 11px",
              cursor: "pointer",
              letterSpacing: 1,
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      {view === "plan" && <MealPlan />}
      {view === "recipes" && <RecipeBook />}
      {view === "workout" && <WorkoutProgram />}
      {view === "fastfood" && <FastFoodGuide />}
    </div>
  );
}
