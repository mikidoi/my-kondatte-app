import React from "react";

const SectionHead: React.FC<{ title: string; count?: number }> = ({
  title,
  count,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginBottom: 14,
    }}
  >
    <h3
      style={{
        fontFamily: "DM Serif Display, serif",
        fontSize: 18,
        fontWeight: 400,
        color: "var(--text)",
      }}
    >
      {title}
    </h3>
    {count != null && (
      <span
        style={{
          fontSize: 12,
          color: "var(--text-soft)",
          background: "var(--olive-faint)",
          padding: "2px 8px",
          borderRadius: 20,
          border: "1px solid #e8ebd8",
        }}
      >
        {count}
      </span>
    )}
  </div>
);

export default SectionHead;
