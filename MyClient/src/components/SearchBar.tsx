import React from "react";
import IcoSearch from "./icons/IcoSearch";
import IcoClose from "./icons/IcoClose";

const SearchBar: React.FC<{ value: string; onChange: (v: string) => void }> = ({
  value,
  onChange,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "var(--olive-faint)",
      border: `1.5px solid ${value ? "var(--olive-light)" : "var(--border)"}`,
      borderRadius: 12,
      padding: "9px 14px",
      boxShadow: value ? "0 0 0 3px var(--olive-pale)" : "none",
      transition: "all 0.15s",
    }}
  >
    <span style={{ color: "var(--text-soft)" }}>
      <IcoSearch />
    </span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search recipes…"
      style={{
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: 14,
        fontFamily: "DM Sans, sans-serif",
        color: "var(--text)",
        background: "transparent",
      }}
    />
    {value && (
      <button
        onClick={() => onChange("")}
        style={{ color: "var(--text-soft)", display: "flex" }}
      >
        <IcoClose />
      </button>
    )}
  </div>
);

export default SearchBar;
