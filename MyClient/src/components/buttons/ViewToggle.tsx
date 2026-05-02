import React from "react";
import IcoGrid from "../icons/IcoGrid";
import IcoList from "../icons/IcoList";

type ViewMode = "grid" | "list";

const ViewToggle: React.FC<{
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
  small?: boolean;
}> = ({ mode, onChange, small }) => {
  const sz = small
    ? { w: 28, h: 24, r: 5, p: 2 }
    : { w: 30, h: 26, r: 6, p: 3 };
  return (
    <div
      style={{
        display: "flex",
        background: "var(--olive-faint)",
        borderRadius: 8,
        padding: sz.p,
        border: "1px solid var(--border)",
      }}
    >
      {(["grid", "list"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            width: sz.w,
            height: sz.h,
            borderRadius: sz.r,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: mode === m ? "var(--white)" : "transparent",
            color: mode === m ? "var(--olive)" : "var(--text-soft)",
            boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s",
          }}
        >
          {m === "grid" ? <IcoGrid /> : <IcoList />}
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
