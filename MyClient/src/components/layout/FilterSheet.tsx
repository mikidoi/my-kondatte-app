import React from "react";

type SortBy = "Recent" | "Rating" | "Quickest";

const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    style={{
      width: 48,
      height: 28,
      borderRadius: 14,
      background: value ? "var(--olive)" : "#d1d5c8",
      position: "relative",
      border: "none",
      cursor: "pointer",
      transition: "background 0.2s",
      flexShrink: 0,
    }}
  >
    <div style={{
      position: "absolute",
      top: 3,
      left: value ? 23 : 3,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      transition: "left 0.2s",
    }} />
  </button>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid var(--border)",
  }}>
    <span style={{ fontSize: 15, color: "var(--text)" }}>{label}</span>
    {children}
  </div>
);

const selectStyle: React.CSSProperties = {
  fontSize: 14,
  color: "var(--text-mid)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  outline: "none",
  fontFamily: "DM Sans, sans-serif",
};

const FilterSheet: React.FC<{
  open: boolean;
  onClose: () => void;
  total: number;
  filteredCount: number;
  sortBy: SortBy;
  onSortBy: (s: SortBy) => void;
  favoritesOnly: boolean;
  onFavoritesOnly: (v: boolean) => void;
  maxPrepTime: number;
  onMaxPrepTime: (v: number) => void;
}> = ({ open, onClose, total, filteredCount, sortBy, onSortBy, favoritesOnly, onFavoritesOnly, maxPrepTime, onMaxPrepTime }) => (
  <>
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200,
        opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity 0.2s",
      }}
    />
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201,
      background: "var(--white)", borderRadius: "20px 20px 0 0",
      padding: "0 24px 48px",
      transform: open ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
      maxHeight: "70vh", overflowY: "auto",
    }}>
      {/* Drag handle */}
      <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 10px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, fontWeight: 400, color: "var(--text)" }}>
          Filter Recipes
        </h2>
        <button
          onClick={onClose}
          style={{ fontSize: 13, fontWeight: 600, color: "var(--olive)", background: "transparent", border: "none", cursor: "pointer", padding: "6px 0" }}
        >
          Done
        </button>
      </div>

      {/* Count */}
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-soft)", marginBottom: 8 }}>
        Showing {filteredCount} of {total} recipes
      </p>

      {/* Sort by */}
      <Row label="Sort by">
        <select value={sortBy} onChange={(e) => onSortBy(e.target.value as SortBy)} style={selectStyle}>
          <option value="Recent">Recent</option>
          <option value="Rating">Name</option>
          <option value="Quickest">Quickest</option>
        </select>
      </Row>

      {/* Favorites */}
      <Row label="Favorites">
        <Toggle value={favoritesOnly} onChange={onFavoritesOnly} />
      </Row>

      {/* Prep time */}
      <div style={{ padding: "14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 15, color: "var(--text)" }}>Prep time</span>
          <span style={{ fontSize: 14, color: "var(--text-mid)" }}>
            {maxPrepTime === 0 ? "All" : `≤ ${maxPrepTime} min`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={120}
          step={10}
          value={maxPrepTime}
          onChange={(e) => onMaxPrepTime(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--olive)" }}
        />
      </div>
    </div>
  </>
);

export default FilterSheet;
