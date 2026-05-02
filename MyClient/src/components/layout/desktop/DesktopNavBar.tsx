import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../Logo";
import Avatar from "../../Avatar";

const DesktopNavBar: React.FC<{ recipeCount: number }> = ({ recipeCount }) => (
  <nav
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      height: 60,
      background: "var(--white)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}
  >
    <Logo />
    <div style={{ display: "flex", gap: 4 }}>
      {(["Weekly Kondate", "Recipes"] as const).map((label, i) => (
        <Link
          key={label}
          to={i === 0 ? "/" : "#"}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            background: i === 1 ? "var(--olive-pale)" : "transparent",
            color: i === 1 ? "var(--olive)" : "var(--text-soft)",
          }}
        >
          {label}
        </Link>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          fontSize: 12,
          color: "var(--text-soft)",
          background: "var(--olive-faint)",
          borderRadius: 20,
          padding: "4px 12px",
          border: "1px solid var(--border)",
        }}
      >
        <span style={{ color: "var(--olive)", fontWeight: 700 }}>
          {recipeCount}
        </span>{" "}
        recipes
      </div>
      <Avatar />
    </div>
  </nav>
);

export default DesktopNavBar;
