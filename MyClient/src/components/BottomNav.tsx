import React from "react";
import IcoHome from "./icons/IcoHome";
import IcoBook from "./icons/IcoBook";
import IcoCart from "./icons/IcoCart";

const ITEMS = [
  { label: "Home", Icon: IcoHome },
  { label: "Recipes", Icon: IcoBook },
  { label: "Shopping", Icon: IcoCart },
];

const BottomNav: React.FC<{ activeIndex?: number }> = ({ activeIndex = 1 }) => (
  <div
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "var(--white)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      paddingBottom: 10,
      zIndex: 100,
    }}
  >
    {ITEMS.map(({ label, Icon }, i) => (
      <button
        key={label}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "10px 0 0",
          color: i === activeIndex ? "var(--olive)" : "var(--text-soft)",
        }}
      >
        <Icon />
        <span style={{ fontSize: 10, fontWeight: i === activeIndex ? 600 : 400 }}>
          {label}
        </span>
        {i === activeIndex && (
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "var(--olive)",
              marginTop: 1,
            }}
          />
        )}
      </button>
    ))}
  </div>
);

export default BottomNav;
