import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RecipeDetailPage.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Recipe {
  id: number;
  name: string;
  ingredients: string;
  instructions: string;
  imagePath?: string;
}

interface IngLine {
  amount: string;
  rest: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_SERVES = 4;

const ACTIONS = [
  { id: "cook", icon: "cook", label: "Cook" },
  { id: "plan", icon: "plan", label: "Plan" },
  { id: "shop", icon: "shop", label: "Shop" },
  { id: "rate", icon: "star", label: "Rate" },
  { id: "print", icon: "print", label: "Print" },
  { id: "edit", icon: "pencil", label: "Edit" },
];

const MOBILE_ACTIONS = ACTIONS.filter((a) => a.id !== "print");

const BOTTOM_NAV = [
  { icon: "home", label: "Home" },
  { icon: "search", label: "Discover" },
  { icon: "book", label: "Recipes" },
  { icon: "list", label: "Shopping" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseIngLine(line: string): IngLine {
  const m = line.match(/^(\d+(?:\.\d+)?)\s+(.*)/);
  return m ? { amount: m[1], rest: m[2] } : { amount: "", rest: line };
}

function scaleAmt(amount: string, servings: number): string {
  const n = parseFloat(amount);
  if (!amount || isNaN(n)) return amount;
  const v = (n / BASE_SERVES) * servings;
  return v % 1 === 0 ? String(v) : v.toFixed(1);
}

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

// ─── Icon ─────────────────────────────────────────────────────────────────────

const Ic: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 18,
  color = "currentColor",
}) => {
  const p: Record<string, React.ReactNode> = {
    back: (
      <path
        d="M15 18l-6-6 6-6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    heart: (
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
      />
    ),
    pin: (
      <>
        <path
          d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <circle
          cx="12"
          cy="8"
          r="2"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
      </>
    ),
    share: (
      <path
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    edit: (
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    cook: (
      <>
        <rect
          x="2"
          y="7"
          width="20"
          height="14"
          rx="2"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M16 7V5a4 4 0 00-8 0v2"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
    plan: (
      <>
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M16 2v4M8 2v4M3 10h18"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
    shop: (
      <>
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M3 6h18M16 10a4 4 0 01-8 0"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
    star: (
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
      />
    ),
    print: (
      <>
        <polyline
          points="6,9 6,2 18,2 18,9"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <rect
          x="6"
          y="14"
          width="12"
          height="8"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
      </>
    ),
    pencil: (
      <>
        <path
          d="M12 20h9"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
    clock: (
      <>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <polyline
          points="12,6 12,12 16,14"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
    users: (
      <>
        <path
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <circle
          cx="9"
          cy="7"
          r="4"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
    check: (
      <polyline
        points="20,6 9,17 4,12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    plus: (
      <>
        <line
          x1="12"
          y1="5"
          x2="12"
          y2="19"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
    minus: (
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ),
    home: (
      <>
        <path
          d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <polyline
          points="9,22 9,12 15,12 15,22"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
      </>
    ),
    search: (
      <>
        <circle
          cx="11"
          cy="11"
          r="8"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M21 21l-4.35-4.35"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
    book: (
      <>
        <path
          d="M4 19.5A2.5 2.5 0 016.5 17H20"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
      </>
    ),
    list: (
      <>
        <line
          x1="8"
          y1="6"
          x2="21"
          y2="6"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="12"
          x2="21"
          y2="12"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="18"
          x2="21"
          y2="18"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line
          x1="3"
          y1="6"
          x2="3.01"
          y2="6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="3"
          y1="12"
          x2="3.01"
          y2="12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="3"
          y1="18"
          x2="3.01"
          y2="18"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    settings: (
      <>
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {p[name]}
    </svg>
  );
};

// ─── Shared primitives ────────────────────────────────────────────────────────

const ImagePlaceholder: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(135deg, #c5d98a 0%, #a8c06e 40%, #d4e89a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle
        cx="30"
        cy="30"
        r="28"
        fill="rgba(255,255,255,0.2)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      <path
        d="M20 38 C20 38 22 24 30 24 C38 24 40 38 40 38"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="30" cy="20" r="4" fill="rgba(255,255,255,0.5)" />
      <path
        d="M16 42 L44 42"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
    <span
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "monospace",
        letterSpacing: "0.05em",
      }}
    >
      recipe photo
    </span>
  </div>
);

const ActionBtn: React.FC<{
  id: string;
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  btnSize?: number;
  iconSize?: number;
  fontSize?: number;
}> = ({
  icon,
  label,
  active,
  onClick,
  btnSize = 44,
  iconSize = 18,
  fontSize = 11,
}) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      color: active ? "var(--olive)" : "var(--text-soft)",
      padding: "6px 4px",
    }}
  >
    <div
      style={{
        width: btnSize,
        height: btnSize,
        borderRadius: "50%",
        background: active ? "var(--olive-pale)" : "#f0f0ec",
        border: `1.5px solid ${active ? "var(--olive-light)" : "transparent"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ic
        name={icon}
        size={iconSize}
        color={active ? "var(--olive)" : "#888"}
      />
    </div>
    <span style={{ fontSize, fontWeight: 500 }}>{label}</span>
  </button>
);

const ServingsRow: React.FC<{
  servings: number;
  setServings: (v: number) => void;
  btnSize?: number;
  iconSize?: number;
}> = ({ servings, setServings, btnSize = 26, iconSize = 11 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "var(--text-soft)",
        fontSize: 13,
      }}
    >
      <Ic name="users" size={14} color="var(--text-soft)" />
      <span>Serves</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        onClick={() => setServings(Math.max(1, servings - 1))}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: "50%",
          border: "1.5px solid var(--border)",
          background: "var(--white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ic name="minus" size={iconSize} color="var(--olive)" />
      </button>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--olive)",
          minWidth: 22,
          textAlign: "center",
        }}
      >
        {servings}
      </span>
      <button
        onClick={() => setServings(servings + 1)}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: "50%",
          border: "1.5px solid var(--border)",
          background: "var(--white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ic name="plus" size={iconSize} color="var(--olive)" />
      </button>
    </div>
  </div>
);

const IngItem: React.FC<{
  ing: IngLine;
  index: number;
  servings: number;
  checked: boolean;
  onToggle: () => void;
  circleSize?: number;
  fontSize?: number;
}> = ({
  ing,
  index,
  servings,
  checked,
  onToggle,
  circleSize = 18,
  fontSize = 13,
}) => (
  <div
    onClick={onToggle}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 16px",
      cursor: "pointer",
      background: checked ? "var(--olive-faint)" : "transparent",
    }}
  >
    <div
      style={{
        width: circleSize,
        height: circleSize,
        borderRadius: "50%",
        flexShrink: 0,
        border: checked ? "none" : "1.5px solid var(--border)",
        background: checked ? "var(--olive)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked && <Ic name="check" size={circleSize - 7} color="#fff" />}
    </div>
    <span
      style={{
        fontSize,
        color: checked ? "var(--text-soft)" : "var(--text)",
        textDecoration: checked ? "line-through" : "none",
        flex: 1,
      }}
    >
      {ing.amount && (
        <strong
          style={{
            color: checked ? "var(--text-soft)" : "var(--olive)",
            marginRight: 4,
          }}
        >
          {scaleAmt(ing.amount, servings)}
        </strong>
      )}
      {ing.rest}
    </span>
  </div>
);

const BottomNav: React.FC<{ activeIndex?: number }> = ({ activeIndex = 2 }) => (
  <div
    style={{
      background: "var(--white)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      padding: "10px 0 14px",
    }}
  >
    {BOTTOM_NAV.map(({ icon, label }, i) => (
      <button
        key={icon}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: i === activeIndex ? "var(--olive)" : "var(--text-soft)",
        }}
      >
        <Ic
          name={icon}
          size={22}
          color={i === activeIndex ? "var(--olive)" : "var(--text-soft)"}
        />
        <span
          style={{ fontSize: 10, fontWeight: i === activeIndex ? 600 : 400 }}
        >
          {label}
        </span>
      </button>
    ))}
  </div>
);

// ─── Desktop layout ────────────────────────────────────────────────────────────

const DesktopDetail: React.FC<{
  recipe: Recipe;
  ingredients: IngLine[];
  steps: string[];
  imageUrl: string | null;
  liked: boolean;
  setLiked: (v: boolean) => void;
  pinned: boolean;
  setPinned: (v: boolean) => void;
  servings: number;
  setServings: (v: number) => void;
  checkedIng: number[];
  toggleIng: (i: number) => void;
  checkedSteps: number[];
  toggleStep: (i: number) => void;
  activeAction: string | null;
  toggleAction: (a: string) => void;
  rating: number;
  setRating: (v: number) => void;
  onBack: () => void;
}> = ({
  recipe,
  ingredients,
  steps,
  imageUrl,
  liked,
  setLiked,
  pinned,
  setPinned,
  servings,
  setServings,
  checkedIng,
  toggleIng,
  checkedSteps,
  toggleStep,
  activeAction,
  toggleAction,
  rating,
  setRating,
  onBack,
}) => (
  <div
    style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Top bar */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "var(--olive)",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        <Ic name="back" size={16} color="var(--olive)" /> Back
      </button>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-soft)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Kondate
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ padding: 6 }}>
          <Ic name="edit" size={18} color="var(--text-soft)" />
        </button>
        <button style={{ padding: 6 }}>
          <Ic name="share" size={18} color="var(--text-soft)" />
        </button>
      </div>
    </div>

    {/* Two-column grid */}
    <div
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "340px 1fr",
        maxWidth: 1412,
        margin: "0 auto",
        width: "100%",
        padding: "24px 24px 40px",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingRight: 20,
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            aspectRatio: "4/3",
            background: "#c8d8a0",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={recipe.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <ImagePlaceholder />
          )}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            Kondate
          </div>
          <button
            onClick={() => setPinned(!pinned)}
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}
          >
            <Ic name="pin" size={16} color={pinned ? "var(--olive)" : "#888"} />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: liked ? "#e05c5c" : "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}
          >
            <Ic name="heart" size={16} color={liked ? "#fff" : "#888"} />
          </button>
        </div>

        {/* Ingredients card */}
        <div
          style={{
            background: "var(--white)",
            borderRadius: 16,
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "13px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span
              style={{ fontSize: 13, fontWeight: 600, color: "var(--olive)" }}
            >
              Ingredients
            </span>
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <ServingsRow servings={servings} setServings={setServings} />
          </div>
          <div style={{ paddingBottom: 4 }}>
            {ingredients.map((ing, i) => (
              <div
                key={i}
                style={{
                  borderBottom:
                    i < ingredients.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <IngItem
                  ing={ing}
                  index={i}
                  servings={servings}
                  checked={checkedIng.includes(i)}
                  onToggle={() => toggleIng(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header card */}
        <div
          style={{
            background: "var(--white)",
            borderRadius: 16,
            border: "1px solid var(--border)",
            padding: "28px 28px 24px",
          }}
        >
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: 32,
              fontWeight: 400,
              color: "var(--text)",
              marginBottom: 20,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {recipe.name}
          </h1>
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            {ACTIONS.map((a) => (
              <ActionBtn
                key={a.id}
                {...a}
                active={activeAction === a.id}
                onClick={() => toggleAction(a.id)}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 4px",
              }}
            >
              <Ic name="users" size={13} color="var(--text-soft)" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-mid)",
                }}
              >
                {servings} serves
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 4px",
              }}
            >
              <Ic name="clock" size={13} color="var(--text-soft)" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-mid)",
                }}
              >
                Prep: —
              </span>
            </div>
            <div style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  style={{ padding: 2 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <polygon
                      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                      fill={s <= rating ? "var(--olive)" : "none"}
                      stroke={s <= rating ? "var(--olive)" : "var(--border)"}
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions card */}
        <div
          style={{
            background: "var(--white)",
            borderRadius: 16,
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
              Instructions
            </h2>
          </div>
          <div>
            {steps.map((step, i) => (
              <div
                key={i}
                onClick={() => toggleStep(i)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "16px 24px",
                  cursor: "pointer",
                  background: checkedSteps.includes(i)
                    ? "var(--olive-faint)"
                    : "transparent",
                  borderBottom:
                    i < steps.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginTop: 1,
                    background: checkedSteps.includes(i)
                      ? "var(--olive)"
                      : "var(--olive-pale)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: checkedSteps.includes(i) ? "#fff" : "var(--olive)",
                  }}
                >
                  {checkedSteps.includes(i) ? (
                    <Ic name="check" size={13} color="#fff" />
                  ) : (
                    i + 1
                  )}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: checkedSteps.includes(i)
                      ? "var(--text-soft)"
                      : "var(--text)",
                    textDecoration: checkedSteps.includes(i)
                      ? "line-through"
                      : "none",
                    margin: 0,
                  }}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 4,
                background: "var(--border)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "var(--olive)",
                  width: `${
                    steps.length
                      ? (checkedSteps.length / steps.length) * 100
                      : 0
                  }%`,
                  borderRadius: 4,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-soft)",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {checkedSteps.length}/{steps.length} steps
            </span>
          </div>
        </div>

        {/* Bottom image */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            height: 180,
            background:
              "linear-gradient(135deg, #b8cc7a 0%, #94ae50 60%, #c8dc90 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="rgba(255,255,255,0.2)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <path
              d="M12 28 C12 28 15 18 20 18 C25 18 28 28 28 28"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="20" cy="15" r="3" fill="rgba(255,255,255,0.5)" />
          </svg>
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.8)",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            finished dish photo
          </span>
        </div>
      </div>
    </div>

    {/* FAB */}
    <button
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: "var(--olive)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(107,122,46,0.4)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      <Ic name="settings" size={20} color="#fff" />
    </button>
  </div>
);

// ─── Tablet layout ─────────────────────────────────────────────────────────────

const TabletDetail: React.FC<{
  recipe: Recipe;
  ingredients: IngLine[];
  steps: string[];
  imageUrl: string | null;
  liked: boolean;
  setLiked: (v: boolean) => void;
  servings: number;
  setServings: (v: number) => void;
  checkedIng: number[];
  toggleIng: (i: number) => void;
  checkedSteps: number[];
  toggleStep: (i: number) => void;
  activeAction: string | null;
  toggleAction: (a: string) => void;
  onBack: () => void;
}> = ({
  recipe,
  ingredients,
  steps,
  imageUrl,
  liked,
  setLiked,
  servings,
  setServings,
  checkedIng,
  toggleIng,
  checkedSteps,
  toggleStep,
  activeAction,
  toggleAction,
  onBack,
}) => (
  <div
    style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Top bar */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "var(--olive)",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        <Ic name="back" size={16} color="var(--olive)" /> Back
      </button>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-soft)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Kondate
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ padding: 6 }}>
          <Ic name="share" size={18} color="var(--text-soft)" />
        </button>
        <button style={{ padding: 6 }}>
          <Ic name="edit" size={18} color="var(--text-soft)" />
        </button>
      </div>
    </div>

    {/* Hero */}
    <div style={{ position: "relative", height: 280, flexShrink: 0 }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={recipe.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <ImagePlaceholder />
      )}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          background: "rgba(255,255,255,0.92)",
          borderRadius: 8,
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        Kondate
      </div>
      <button
        onClick={() => setLiked(!liked)}
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: liked ? "#e05c5c" : "rgba(255,255,255,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Ic name="heart" size={18} color={liked ? "#fff" : "#888"} />
      </button>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background:
            "linear-gradient(to top, rgba(250,250,247,0.6), transparent)",
        }}
      />
    </div>

    {/* Scrollable */}
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 80px" }}>
      {/* Title card */}
      <div
        style={{
          background: "var(--white)",
          borderRadius: 16,
          border: "1px solid var(--border)",
          padding: "20px 20px 18px",
          marginBottom: 16,
        }}
      >
        <h1
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: 26,
            fontWeight: 400,
            marginBottom: 16,
            color: "var(--text)",
            lineHeight: 1.2,
          }}
        >
          {recipe.name}
        </h1>
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 16,
            justifyContent: "space-between",
          }}
        >
          {ACTIONS.map((a) => (
            <ActionBtn
              key={a.id}
              {...a}
              active={activeAction === a.id}
              onClick={() => toggleAction(a.id)}
              btnSize={40}
              iconSize={17}
              fontSize={10}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(
            [
              ["users", `${servings} serves`],
              ["clock", "Prep: —"],
            ] as [string, string][]
          ).map(([ic, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 4px",
              }}
            >
              <Ic name={ic} size={12} color="var(--text-soft)" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-mid)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Ingredients */}
        <div
          style={{
            background: "var(--white)",
            borderRadius: 16,
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "2px solid var(--olive)",
            }}
          >
            <span
              style={{ fontSize: 13, fontWeight: 600, color: "var(--olive)" }}
            >
              Ingredients
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "1.5px solid var(--border)",
                  background: "var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic name="minus" size={10} color="var(--olive)" />
              </button>
              <span
                style={{ fontSize: 12, fontWeight: 700, color: "var(--olive)" }}
              >
                {servings}
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "1.5px solid var(--border)",
                  background: "var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic name="plus" size={10} color="var(--olive)" />
              </button>
            </div>
          </div>
          {ingredients.map((ing, i) => (
            <div
              key={i}
              style={{
                borderBottom:
                  i < ingredients.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <IngItem
                ing={ing}
                index={i}
                servings={servings}
                checked={checkedIng.includes(i)}
                onToggle={() => toggleIng(i)}
                circleSize={16}
                fontSize={12}
              />
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div
          style={{
            background: "var(--white)",
            borderRadius: 16,
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>Instructions</span>
          </div>
          {steps.map((step, i) => (
            <div
              key={i}
              onClick={() => toggleStep(i)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom:
                  i < steps.length - 1 ? "1px solid var(--border)" : "none",
                background: checkedSteps.includes(i)
                  ? "var(--olive-faint)"
                  : "transparent",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: checkedSteps.includes(i)
                    ? "var(--olive)"
                    : "var(--olive-pale)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: checkedSteps.includes(i) ? "#fff" : "var(--olive)",
                }}
              >
                {checkedSteps.includes(i) ? (
                  <Ic name="check" size={11} color="#fff" />
                ) : (
                  i + 1
                )}
              </div>
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: checkedSteps.includes(i)
                    ? "var(--text-soft)"
                    : "var(--text)",
                  textDecoration: checkedSteps.includes(i)
                    ? "line-through"
                    : "none",
                  margin: 0,
                }}
              >
                {step}
              </p>
            </div>
          ))}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 3,
                background: "var(--border)",
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "var(--olive)",
                  width: `${
                    steps.length
                      ? (checkedSteps.length / steps.length) * 100
                      : 0
                  }%`,
                  borderRadius: 3,
                  transition: "width 0.3s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: "var(--text-soft)",
                fontWeight: 500,
              }}
            >
              {checkedSteps.length}/{steps.length}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom nav */}
    <div style={{ position: "sticky", bottom: 0 }}>
      <BottomNav />
    </div>
  </div>
);

// ─── Mobile layout ─────────────────────────────────────────────────────────────

const MobileDetail: React.FC<{
  recipe: Recipe;
  ingredients: IngLine[];
  steps: string[];
  imageUrl: string | null;
  liked: boolean;
  setLiked: (v: boolean) => void;
  servings: number;
  setServings: (v: number) => void;
  checkedIng: number[];
  toggleIng: (i: number) => void;
  checkedSteps: number[];
  toggleStep: (i: number) => void;
  activeAction: string | null;
  toggleAction: (a: string) => void;
  tab: "ingredients" | "steps";
  setTab: (t: "ingredients" | "steps") => void;
  onBack: () => void;
}> = ({
  recipe,
  ingredients,
  steps,
  imageUrl,
  liked,
  setLiked,
  servings,
  setServings,
  checkedIng,
  toggleIng,
  checkedSteps,
  toggleStep,
  activeAction,
  toggleAction,
  tab,
  setTab,
  onBack,
}) => (
  <div
    style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Hero */}
    <div style={{ position: "relative", height: 300, flexShrink: 0 }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={recipe.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <ImagePlaceholder />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(30,31,26,0.7) 0%, transparent 50%)",
        }}
      />
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ic name="back" size={16} color="var(--text)" />
      </button>
      <button
        onClick={() => setLiked(!liked)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: liked ? "#e05c5c" : "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ic name="heart" size={16} color={liked ? "#fff" : "#888"} />
      </button>
      {/* Title overlay */}
      <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
        <h1
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: 24,
            fontWeight: 400,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 8,
            textShadow: "0 1px 6px rgba(0,0,0,0.3)",
          }}
        >
          {recipe.name}
        </h1>
        <div style={{ display: "flex", gap: 6 }}>
          {(
            [
              ["clock", "—"],
              ["users", String(servings)],
            ] as [string, string][]
          ).map(([ic, label]) => (
            <div
              key={ic}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              <Ic name={ic} size={11} color="#fff" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Scrollable content */}
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Action strip */}
      <div
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-around",
          padding: "12px 0 10px",
        }}
      >
        {MOBILE_ACTIONS.map((a) => (
          <ActionBtn
            key={a.id}
            {...a}
            active={activeAction === a.id}
            onClick={() => toggleAction(a.id)}
            btnSize={42}
            iconSize={18}
            fontSize={10}
          />
        ))}
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          margin: "16px 18px 0",
          background: "#f0f0ec",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {(["ingredients", "steps"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 9,
              background: tab === t ? "var(--white)" : "transparent",
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? "var(--olive)" : "var(--text-soft)",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Servings */}
      <div
        style={{
          margin: "12px 18px 4px",
          padding: "10px 14px",
          background: "var(--white)",
          borderRadius: 12,
          border: "1px solid var(--border)",
        }}
      >
        <ServingsRow
          servings={servings}
          setServings={setServings}
          btnSize={28}
          iconSize={12}
        />
      </div>

      {/* Tab content */}
      <div
        style={{
          margin: "8px 18px 100px",
          background: "var(--white)",
          borderRadius: 14,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {tab === "ingredients" ? (
          ingredients.map((ing, i) => (
            <div
              key={i}
              style={{
                borderBottom:
                  i < ingredients.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <IngItem
                ing={ing}
                index={i}
                servings={servings}
                checked={checkedIng.includes(i)}
                onToggle={() => toggleIng(i)}
                circleSize={20}
                fontSize={14}
              />
            </div>
          ))
        ) : (
          <>
            {steps.map((step, i) => (
              <div
                key={i}
                onClick={() => toggleStep(i)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 16px",
                  cursor: "pointer",
                  borderBottom:
                    i < steps.length - 1 ? "1px solid var(--border)" : "none",
                  background: checkedSteps.includes(i)
                    ? "var(--olive-faint)"
                    : "transparent",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: checkedSteps.includes(i)
                      ? "var(--olive)"
                      : "var(--olive-pale)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: checkedSteps.includes(i) ? "#fff" : "var(--olive)",
                  }}
                >
                  {checkedSteps.includes(i) ? (
                    <Ic name="check" size={12} color="#fff" />
                  ) : (
                    i + 1
                  )}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: checkedSteps.includes(i)
                      ? "var(--text-soft)"
                      : "var(--text)",
                    textDecoration: checkedSteps.includes(i)
                      ? "line-through"
                      : "none",
                    margin: 0,
                  }}
                >
                  {step}
                </p>
              </div>
            ))}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 4,
                  background: "var(--border)",
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "var(--olive)",
                    width: `${
                      steps.length
                        ? (checkedSteps.length / steps.length) * 100
                        : 0
                    }%`,
                    borderRadius: 4,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-soft)",
                  fontWeight: 500,
                }}
              >
                {checkedSteps.length}/{steps.length} steps
              </span>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Bottom nav */}
    <div style={{ position: "sticky", bottom: 0 }}>
      <BottomNav />
    </div>
  </div>
);

// ─── Main export ───────────────────────────────────────────────────────────────

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bp = useBreakpoint();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [servings, setServings] = useState(BASE_SERVES);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [checkedIng, setCheckedIng] = useState<number[]>([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [tab, setTab] = useState<"ingredients" | "steps">("ingredients");

  useEffect(() => {
    fetch(`/api/recipe/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(setRecipe)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  const toggleStep = (i: number) =>
    setCheckedSteps((p) =>
      p.includes(i) ? p.filter((x) => x !== i) : [...p, i]
    );
  const toggleIng = (i: number) =>
    setCheckedIng((p) =>
      p.includes(i) ? p.filter((x) => x !== i) : [...p, i]
    );
  const toggleAction = (a: string) =>
    setActiveAction((p) => (p === a ? null : a));

  if (error) {
    return (
      <div
        className="kondate-detail"
        style={{ padding: 40, fontSize: 14, color: "red" }}
      >
        Error loading recipe: {error}
      </div>
    );
  }

  if (!recipe) {
    return (
      <div
        className="kondate-detail"
        style={{ padding: 40, fontSize: 14, color: "#8a8d7a" }}
      >
        Loading…
      </div>
    );
  }

  const ingredients = parseLines(recipe.ingredients).map(parseIngLine);
  const steps = parseLines(recipe.instructions);
  const imageUrl = recipe.imagePath
    ? `http://localhost:5109/images/${recipe.imagePath}`
    : null;

  const shared = {
    recipe,
    ingredients,
    steps,
    imageUrl,
    liked,
    setLiked,
    servings,
    setServings,
    checkedIng,
    toggleIng,
    checkedSteps,
    toggleStep,
    activeAction,
    toggleAction,
    onBack: () => navigate("/recipes"),
  };

  return (
    <div className="kondate-detail">
      {bp === "mobile" && (
        <MobileDetail {...shared} tab={tab} setTab={setTab} />
      )}
      {bp === "tablet" && <TabletDetail {...shared} />}
      {bp === "desktop" && (
        <DesktopDetail
          {...shared}
          pinned={pinned}
          setPinned={setPinned}
          rating={rating}
          setRating={setRating}
        />
      )}
    </div>
  );
};
