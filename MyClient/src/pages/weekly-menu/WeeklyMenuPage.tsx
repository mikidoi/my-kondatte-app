import React, { useEffect, useRef, useState } from "react";
import "./WeeklyMenuPage.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MealEntry { url: string; name: string; }
type MealMap = Record<string, MealEntry[]>; // keyed by day abbreviation

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAYS_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_COLORS = ["#d4e8a0", "#c8d890", "#b8cc7a"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeekDates(offset = 0): Date[] {
  const now = new Date();
  const dow = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dow + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getWeekLabel(dates: Date[]): string {
  return `${dates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${dates[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
}

function getTodayIdx(): number {
  return (new Date().getDay() + 6) % 7; // 0 = Mon
}

function initMealMap(): MealMap {
  return Object.fromEntries(DAYS.map((d) => [d, []]));
}

// ─── Breakpoint hook ──────────────────────────────────────────────────────────

function useBreakpoint() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  if (w < 640) return "mobile" as const;
  if (w < 1024) return "tablet" as const;
  return "desktop" as const;
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const ChevronLeft = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.6" fill="none" />
    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="1.6" fill="none" />
  </svg>
);

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" fill="none" />
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="1.6" fill="none" />
  </svg>
);

const ListIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─── Shared primitives ────────────────────────────────────────────────────────

const BottomNav: React.FC<{ activeIndex?: number }> = ({ activeIndex = 2 }) => {
  const items = [
    { label: "Home", Icon: HomeIcon },
    { label: "Discover", Icon: SearchIcon },
    { label: "Recipes", Icon: BookIcon },
    { label: "Shopping", Icon: ListIcon },
  ];
  return (
    <div style={{ background: "var(--white)", borderTop: "1px solid var(--border)", display: "flex", padding: "10px 0 14px" }}>
      {items.map(({ label, Icon }, i) => (
        <button key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: i === activeIndex ? "var(--olive)" : "var(--text-soft)" }}>
          <Icon />
          <span style={{ fontSize: 10, fontWeight: i === activeIndex ? 600 : 400 }}>{label}</span>
        </button>
      ))}
    </div>
  );
};

const NavBar: React.FC<{ totalMeals?: number; compact?: boolean }> = ({ totalMeals = 0, compact = false }) => (
  <nav style={{ height: compact ? 54 : 60, background: "var(--white)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: compact ? "0 20px" : "0 32px", position: "sticky", top: 0, zIndex: 10 }}>
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 10 }}>
      <div style={{ width: compact ? 28 : 32, height: compact ? 28 : 32, borderRadius: compact ? 7 : 8, background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={compact ? 15 : 18} height={compact ? 15 : 18} viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#fff" strokeWidth="1.8" fill="none" />
          <polyline points="9,22 9,12 15,12 15,22" stroke="#fff" strokeWidth="1.8" fill="none" />
        </svg>
      </div>
      <span style={{ fontFamily: "DM Serif Display, serif", fontSize: compact ? 18 : 20, color: "var(--text)", letterSpacing: "-0.01em" }}>Kondate</span>
    </div>
    <div style={{ display: "flex", gap: compact ? 4 : 6 }}>
      {["Recipes", "Planner", "Shopping"].map((item, i) => (
        <button key={item} style={{ padding: compact ? "5px 12px" : "6px 14px", borderRadius: compact ? 7 : 8, fontSize: compact ? 12 : 13, fontWeight: 500, background: i === 1 ? "var(--olive-pale)" : "transparent", color: i === 1 ? "var(--olive)" : "var(--text-soft)" }}>
          {item}
        </button>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {!compact && totalMeals > 0 && (
        <div style={{ fontSize: 12, color: "var(--text-soft)", background: "var(--olive-faint)", borderRadius: 20, padding: "4px 12px", border: "1px solid var(--border)" }}>
          <span style={{ color: "var(--olive)", fontWeight: 700 }}>{totalMeals}</span> meal{totalMeals !== 1 ? "s" : ""} planned
        </div>
      )}
      <div style={{ width: compact ? 30 : 34, height: compact ? 30 : 34, borderRadius: "50%", background: "var(--olive-pale)", border: "2px solid var(--olive-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: compact ? 12 : 13, fontWeight: 700, color: "var(--olive)" }}>K</div>
    </div>
  </nav>
);

// ─── Desktop layout ────────────────────────────────────────────────────────────

const MealCell: React.FC<{
  day: string;
  meals: MealEntry[];
  onAdd: (url: string, name: string) => void;
  onRemove: (index: number) => void;
}> = ({ day, meals, onAdd, onRemove }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const isWeekend = day === "Sat" || day === "Sun";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAdd(URL.createObjectURL(file), file.name);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    onAdd(URL.createObjectURL(file), file.name);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 200, background: isWeekend ? "#f5f7ee" : "var(--white)", borderRight: "1px solid var(--border)" }}>
      <div
        style={{ flex: 1, padding: "10px 10px 8px", display: "flex", flexDirection: "column", gap: 8 }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {meals.map((meal, i) => (
          <div key={i} className="meal-pop" style={{ position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "4/3" }}>
            <img src={meal.url} alt={meal.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <button
              onClick={() => onRemove(i)}
              style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(30,31,26,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}
            >×</button>
            {meal.name && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)", padding: "12px 6px 4px", fontSize: 10, color: "#fff", fontWeight: 500, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {meal.name.replace(/\.[^.]+$/, "")}
              </div>
            )}
          </div>
        ))}

        {dragOver ? (
          <div style={{ flex: 1, border: "2px dashed var(--olive-light)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--olive)", fontSize: 12, fontWeight: 500, minHeight: 60, background: "var(--olive-faint)" }}>
            Drop image here
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: "1.5px dashed var(--border)", borderRadius: 10, padding: "10px 0", color: "var(--text-soft)", width: "100%", transition: "all 0.15s" }}
            onMouseEnter={(e) => { const b = e.currentTarget; b.style.borderColor = "var(--olive-light)"; b.style.color = "var(--olive)"; b.style.background = "var(--olive-faint)"; }}
            onMouseLeave={(e) => { const b = e.currentTarget; b.style.borderColor = "var(--border)"; b.style.color = "var(--text-soft)"; b.style.background = "none"; }}
          >
            <PlusIcon size={16} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>Add meal</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
};

const DesktopPlanner: React.FC<{
  weekDates: Date[]; weekLabel: string; weekOffset: number;
  mealData: MealMap; totalMeals: number;
  onPrev: () => void; onNext: () => void;
  onAddMeal: (day: string, url: string, name: string) => void;
  onRemoveMeal: (day: string, index: number) => void;
}> = ({ weekDates, weekLabel, weekOffset, mealData, totalMeals, onPrev, onNext, onAddMeal, onRemoveMeal }) => (
  <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
    <NavBar totalMeals={totalMeals} />

    {/* Page header */}
    <div style={{ padding: "36px 32px 24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div>
        <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 36, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}>
          Kondate Hyo
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-soft)", marginTop: 4 }}>{weekLabel}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onPrev} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--border)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-soft)" }}>
          <ChevronLeft />
        </button>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)", padding: "0 4px" }}>
          {weekOffset === 0 ? "This week" : weekOffset > 0 ? `+${weekOffset}w` : `${weekOffset}w`}
        </span>
        <button onClick={onNext} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--border)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-soft)" }}>
          <ChevronRight />
        </button>
      </div>
    </div>

    {/* Grid */}
    <div style={{ margin: "0 32px 40px", flex: 1 }}>
      <div className="grid-fadein" style={{ background: "var(--white)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 2px 16px rgba(107,122,46,0.07)", display: "flex", flexDirection: "column" }}>
        {/* Day headers */}
        <div style={{ display: "flex", background: "var(--olive)" }}>
          {DAYS.map((day, i) => {
            const isWe = day === "Sat" || day === "Sun";
            return (
              <div key={day} style={{ flex: 1, padding: "14px 14px 12px", borderRight: i < 6 ? "1px solid rgba(255,255,255,0.15)" : "none", background: isWe ? "rgba(0,0,0,0.08)" : "transparent" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase" }}>{day}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{fmtDate(weekDates[i])}</div>
              </div>
            );
          })}
        </div>
        {/* Cells */}
        <div style={{ display: "flex", flex: 1 }}>
          {DAYS.map((day) => (
            <MealCell
              key={day}
              day={day}
              meals={mealData[day] ?? []}
              onAdd={(url, name) => onAddMeal(day, url, name)}
              onRemove={(idx) => onRemoveMeal(day, idx)}
            />
          ))}
        </div>
      </div>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "var(--text-soft)" }}>
        Click <strong style={{ color: "var(--olive)" }}>+ Add meal</strong> or drag &amp; drop an image into any day
      </p>
    </div>
  </div>
);

// ─── Tablet layout ─────────────────────────────────────────────────────────────

const TabletPlanner: React.FC<{
  weekDates: Date[]; weekLabel: string; weekOffset: number;
  mealData: MealMap;
  onPrev: () => void; onNext: () => void;
  onAddMeal: (day: string, url: string, name: string) => void;
  onRemoveMeal: (day: string, index: number) => void;
}> = ({ weekDates, weekLabel, weekOffset, mealData, onPrev, onNext, onAddMeal, onRemoveMeal }) => (
  <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
    <NavBar compact />

    {/* Header */}
    <div style={{ padding: "20px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div>
        <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 26, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.01em" }}>Kondate Hyo</h1>
        <p style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 3 }}>{weekLabel}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={onPrev} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid var(--border)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-soft)" }}>
          <ChevronLeft size={14} />
        </button>
        <button onClick={onNext} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid var(--border)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-soft)" }}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>

    {/* Grid */}
    <div style={{ margin: "0 20px", flex: 1, minHeight: 0 }}>
      <div style={{ background: "var(--white)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(107,122,46,0.07)" }}>
        {/* Day headers */}
        <div style={{ display: "flex", background: "var(--olive)", flexShrink: 0 }}>
          {DAYS.map((day, i) => {
            const isWe = day === "Sat" || day === "Sun";
            return (
              <div key={day} style={{ flex: 1, padding: "10px 10px 9px", borderRight: i < 6 ? "1px solid rgba(255,255,255,0.12)" : "none", background: isWe ? "rgba(0,0,0,0.1)" : "transparent" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>{day}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{fmtDate(weekDates[i])}</div>
              </div>
            );
          })}
        </div>
        {/* Cells (compact) */}
        <div style={{ display: "flex", flex: 1 }}>
          {DAYS.map((day) => {
            const isWe = day === "Sat" || day === "Sun";
            const meals = mealData[day] ?? [];
            return (
              <TabletMealCell key={day} day={day} meals={meals} isWeekend={isWe} onAdd={(url, name) => onAddMeal(day, url, name)} onRemove={(idx) => onRemoveMeal(day, idx)} />
            );
          })}
        </div>
      </div>
    </div>

    <div style={{ marginTop: 16, position: "sticky", bottom: 0 }}>
      <BottomNav />
    </div>
  </div>
);

const TabletMealCell: React.FC<{
  day: string; meals: MealEntry[]; isWeekend: boolean;
  onAdd: (url: string, name: string) => void;
  onRemove: (index: number) => void;
}> = ({ day, meals, isWeekend, onAdd, onRemove }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAdd(URL.createObjectURL(file), file.name);
    e.target.value = "";
  };

  return (
    <div style={{ flex: 1, borderRight: "1px solid var(--border)", background: isWeekend ? "#f5f7ee" : "var(--white)", display: "flex", flexDirection: "column", padding: "8px 7px", gap: 6 }}>
      {meals.map((meal, i) => (
        <div key={i} className="meal-pop" style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "4/3" }}>
          <img src={meal.url} alt={meal.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button onClick={() => onRemove(i)} style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, borderRadius: "50%", background: "rgba(30,31,26,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>×</button>
        </div>
      ))}
      <button
        onClick={() => fileRef.current?.click()}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "none", border: "1.5px dashed var(--border)", borderRadius: 8, padding: "7px 0", color: "var(--text-soft)", width: "100%", transition: "all 0.15s" }}
        onMouseEnter={(e) => { const b = e.currentTarget; b.style.borderColor = "var(--olive-light)"; b.style.color = "var(--olive)"; b.style.background = "var(--olive-faint)"; }}
        onMouseLeave={(e) => { const b = e.currentTarget; b.style.borderColor = "var(--border)"; b.style.color = "var(--text-soft)"; b.style.background = "none"; }}
      >
        <PlusIcon size={13} />
        <span style={{ fontSize: 10, fontWeight: 500 }}>Add meal</span>
      </button>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
};

// ─── Mobile layout ─────────────────────────────────────────────────────────────

const MobilePlanner: React.FC<{
  weekDates: Date[]; weekLabel: string; weekOffset: number;
  mealData: MealMap;
  onPrev: () => void; onNext: () => void;
  onAddMeal: (day: string, url: string, name: string) => void;
  onRemoveMeal: (day: string, index: number) => void;
}> = ({ weekDates, weekLabel, weekOffset, mealData, onPrev, onNext, onAddMeal, onRemoveMeal }) => {
  const [activeDay, setActiveDay] = useState(getTodayIdx());
  const fileRef = useRef<HTMLInputElement>(null);
  const todayIdx = getTodayIdx();
  const activeKey = DAYS[activeDay];
  const dayMeals = mealData[activeKey] ?? [];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAddMeal(activeKey, URL.createObjectURL(file), file.name);
    e.target.value = "";
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ height: 44, background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>9:41</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <svg width="16" height="12" viewBox="0 0 16 12">
            <rect x="0" y="4" width="3" height="8" fill="rgba(255,255,255,0.9)" rx="1" />
            <rect x="4.5" y="2.5" width="3" height="9.5" fill="rgba(255,255,255,0.9)" rx="1" />
            <rect x="9" y="0.5" width="3" height="11.5" fill="rgba(255,255,255,0.9)" rx="1" />
          </svg>
          <svg width="18" height="12" viewBox="0 0 18 12">
            <rect x="0.5" y="0.5" width="15" height="11" rx="2" stroke="rgba(255,255,255,0.8)" strokeWidth="1" fill="none" />
            <rect x="1.5" y="1.5" width="11" height="9" rx="1.5" fill="rgba(255,255,255,0.9)" />
          </svg>
        </div>
      </div>

      {/* Olive header + day picker */}
      <div style={{ background: "var(--olive)", padding: "14px 20px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, fontWeight: 400, color: "#fff", lineHeight: 1 }}>Kondate Hyo</h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>{weekLabel}</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onPrev} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={13} color="#fff" />
            </button>
            <button onClick={onNext} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={13} color="#fff" />
            </button>
          </div>
        </div>

        {/* Day picker strip */}
        <div style={{ display: "flex", gap: 6 }}>
          {DAYS.map((day, i) => {
            const isActive = activeDay === i;
            const isToday = todayIdx === i;
            const hasMeals = (mealData[day] ?? []).length > 0;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(i)}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: isActive ? "#fff" : "rgba(255,255,255,0.12)", border: `1.5px solid ${isToday && !isActive ? "rgba(255,255,255,0.5)" : "transparent"}`, borderRadius: 12, padding: "8px 4px", transition: "all 0.15s" }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: isActive ? "var(--olive)" : "rgba(255,255,255,0.75)" }}>{day}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? "var(--olive)" : "#fff" }}>{weekDates[i].getDate()}</span>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: hasMeals ? (isActive ? "var(--olive)" : "rgba(255,255,255,0.8)") : "transparent" }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Day content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px 100px" }}>
        {/* Day label */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, fontWeight: 400, color: "var(--text)" }}>{DAYS_FULL[activeDay]}</h2>
          <span style={{ fontSize: 12, color: "var(--text-soft)" }}>{fmtDate(weekDates[activeDay])}</span>
          {todayIdx === activeDay && (
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--olive)", background: "var(--olive-pale)", borderRadius: 20, padding: "2px 8px" }}>Today</span>
          )}
        </div>

        {/* Meal cards or empty state */}
        {dayMeals.length === 0 ? (
          <div style={{ background: "var(--white)", borderRadius: 16, border: "1px dashed var(--border)", padding: "40px 20px", textAlign: "center", marginBottom: 12 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ margin: "0 auto 10px", display: "block" }}>
              <circle cx="18" cy="18" r="16" fill="var(--olive-faint)" stroke="var(--border)" strokeWidth="1.5" />
              <line x1="18" y1="10" x2="18" y2="26" stroke="var(--olive-light)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="10" y1="18" x2="26" y2="18" stroke="var(--olive-light)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p style={{ fontSize: 13, color: "var(--text-soft)", lineHeight: 1.5 }}>No meals planned yet.<br />Add one below!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {dayMeals.map((meal, i) => (
              <div key={i} className="meal-pop" style={{ background: "var(--white)", borderRadius: 14, border: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "stretch", minHeight: 100 }}>
                <div style={{ width: 100, flexShrink: 0, borderRadius: "10px 0 0 10px", overflow: "hidden" }}>
                  <img src={meal.url} alt={meal.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ flex: 1, padding: "10px 14px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{meal.name.replace(/\.[^.]+$/, "")}</div>
                  <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 2 }}>Tap to view recipe</div>
                </div>
                <button onClick={() => onRemoveMeal(activeKey, i)} style={{ padding: "0 14px", color: "var(--text-soft)", fontSize: 20 }}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* Add meal button */}
        <button
          onClick={() => fileRef.current?.click()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: "1.5px dashed var(--border)", borderRadius: 12, padding: "13px 0", color: "var(--text-soft)", width: "100%", transition: "all 0.15s" }}
          onMouseEnter={(e) => { const b = e.currentTarget; b.style.borderColor = "var(--olive-light)"; b.style.color = "var(--olive)"; b.style.background = "var(--olive-faint)"; }}
          onMouseLeave={(e) => { const b = e.currentTarget; b.style.borderColor = "var(--border)"; b.style.color = "var(--text-soft)"; b.style.background = "none"; }}
        >
          <PlusIcon size={15} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Add meal</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

        {/* Week overview strip */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-soft)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>Week overview</div>
          <div style={{ display: "flex", gap: 6 }}>
            {DAYS.map((day, i) => {
              const isActive = activeDay === i;
              const hasMeals = (mealData[day] ?? []).length > 0;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(i)}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: isActive ? "var(--olive-pale)" : "var(--white)", border: `1.5px solid ${isActive ? "var(--olive-light)" : "var(--border)"}`, borderRadius: 10, padding: "8px 4px", transition: "all 0.15s" }}
                >
                  <span style={{ fontSize: 9, fontWeight: 600, color: isActive ? "var(--olive)" : "var(--text-soft)", textTransform: "uppercase" }}>{day}</span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: hasMeals ? "var(--olive)" : "var(--border)" }} />
                  <span style={{ fontSize: 9, color: isActive ? "var(--olive)" : "var(--text-soft)" }}>
                    {(mealData[day] ?? []).length || "—"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "sticky", bottom: 0 }}>
        <BottomNav />
      </div>
    </div>
  );
};

// ─── Main export ───────────────────────────────────────────────────────────────

export const WeeklyMenuPage: React.FC = () => {
  const bp = useBreakpoint();
  const [weekOffset, setWeekOffset] = useState(0);
  const [mealData, setMealData] = useState<MealMap>(initMealMap);

  const weekDates = getWeekDates(weekOffset);
  const weekLabel = getWeekLabel(weekDates);
  const totalMeals = Object.values(mealData).reduce((sum, arr) => sum + arr.length, 0);

  const addMeal = (day: string, url: string, name: string) =>
    setMealData((prev) => ({ ...prev, [day]: [...(prev[day] ?? []), { url, name }] }));

  const removeMeal = (day: string, index: number) =>
    setMealData((prev) => ({ ...prev, [day]: (prev[day] ?? []).filter((_, i) => i !== index) }));

  const sharedProps = {
    weekDates, weekLabel, weekOffset, mealData,
    onPrev: () => setWeekOffset((o) => o - 1),
    onNext: () => setWeekOffset((o) => o + 1),
    onAddMeal: addMeal,
    onRemoveMeal: removeMeal,
  };

  return (
    <div className="kondate-menu">
      {bp === "mobile" && <MobilePlanner {...sharedProps} />}
      {bp === "tablet" && <TabletPlanner {...sharedProps} />}
      {bp === "desktop" && <DesktopPlanner {...sharedProps} totalMeals={totalMeals} />}
    </div>
  );
};
