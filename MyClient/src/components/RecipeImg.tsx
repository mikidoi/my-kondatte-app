import React, { useState } from "react";
import getImageUrl from "../helpers/getImageUrl";
import getPlaceholderColors from "../helpers/getPlaceholderColors";

interface Recipe {
  id: number;
  name: string;
  imagePath?: string;
}

const RecipeImg: React.FC<{ recipe: Recipe; style?: React.CSSProperties }> = ({
  recipe,
  style: sx,
}) => {
  const [err, setErr] = useState(false);
  const url = getImageUrl(recipe);
  const [c1, c2] = getPlaceholderColors(recipe.id);
  const gid = `rg${recipe.id}`;

  if (url && !err) {
    return (
      <img
        src={url}
        alt={recipe.name}
        onError={() => setErr(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          ...sx,
        }}
      />
    );
  }
  return (
    <div style={{ width: "100%", height: "100%", ...sx }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 160"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width="200" height="160" fill={`url(#${gid})`} />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={i * 18 - 10}
            y1="0"
            x2={i * 18 + 140}
            y2="160"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="12"
          />
        ))}
        <text
          x="100"
          y="76"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="monospace"
          fontSize="9"
          fill="rgba(255,255,255,0.5)"
        >
          recipe photo
        </text>
        <text
          x="100"
          y="91"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="monospace"
          fontSize="8"
          fill="rgba(255,255,255,0.35)"
        >
          {recipe.name.toLowerCase()}
        </text>
      </svg>
    </div>
  );
};

export default RecipeImg;
