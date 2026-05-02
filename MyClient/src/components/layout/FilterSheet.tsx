import React from "react";
import IcoClose from "../icons/IcoClose";

type SortBy = "Recent" | "Rating" | "Quickest";

const SORT_OPTIONS: SortBy[] = ["Recent", "Rating", "Quickest"];

const FilterSheet: React.FC<{
  open: boolean;
  onClose: () => void;
  sortBy: SortBy;
  onSort: (s: SortBy) => void;
}> = ({ open, onClose, sortBy, onSort }) => (
  <>
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 200,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "all" : "none",
        transition: "opacity 0.2s",
      }}
    />
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 201,
        background: "var(--white)",
        borderRadius: "20px 20px 0 0",
        padding: "0 24px 40px",
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
        maxHeight: "65vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 10px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: 22,
            fontWeight: 400,
            color: "var(--text)",
          }}
        >
          Filter & Sort
        </h2>
        <button onClick={onClose} style={{ color: "var(--text-soft)", display: "flex" }}>
          <IcoClose />
        </button>
      </div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-soft)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 10,
        }}
      >
        Sort by
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SORT_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { onSort(s); onClose(); }}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              border: `1.5px solid ${sortBy === s ? "var(--olive)" : "var(--border)"}`,
              background: sortBy === s ? "var(--olive)" : "transparent",
              color: sortBy === s ? "#fff" : "var(--text-mid)",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  </>
);

export default FilterSheet;
