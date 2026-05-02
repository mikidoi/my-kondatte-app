import React from "react";

const Logo: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 7,
        background: "var(--olive)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    </div>
    <span
      style={{
        fontFamily: "DM Serif Display, serif",
        fontSize: 19,
        color: "var(--text)",
        letterSpacing: "-0.01em",
      }}
    >
      Kondate
    </span>
  </div>
);

export default Logo;
