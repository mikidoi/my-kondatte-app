import React from "react";

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-mid)",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </label>
      {hint && (
        <span style={{ fontSize: 11, color: "var(--text-soft)" }}>{hint}</span>
      )}
    </div>
    {children}
  </div>
);

export default Field;
