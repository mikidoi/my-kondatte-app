import React, { useState } from "react";
import { Link } from "react-router-dom";
import RecipeImg from "../../../components/RecipeImg";
import IcoHeart from "../../../components/icons/IcoHeart";
import IcoTrash from "../../../components/icons/IcoTrash";

interface Recipe {
  id: number;
  name: string;
  ingredients: string;
  instructions: string;
  imagePath?: string;
}

const RecipeListRow: React.FC<{
  recipe: Recipe;
  idx: number;
  liked: boolean;
  onToggleLike: () => void;
  onDelete: () => void;
}> = ({ recipe, idx, liked, onToggleLike, onDelete }) => {
  const [hov, setHov] = useState(false);
  const row = (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="recipe-card-anim"
      style={{
        display: "flex",
        background: "var(--white)",
        borderRadius: 14,
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: hov
          ? "0 4px 14px rgba(107,122,46,0.14)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        transform: hov ? "translateX(2px)" : "none",
        transition: "all 0.2s",
        animationDelay: `${Math.min(idx, 8) * 40}ms`,
        cursor: "pointer",
      }}
    >
      <div style={{ width: 88, flexShrink: 0, overflow: "hidden" }}>
        <RecipeImg
          recipe={recipe}
          style={{
            height: "100%",
            transform: hov ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.3s",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          padding: "11px 13px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          <h3
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: 14,
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.3,
            }}
          >
            {recipe.name}
          </h3>
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
              style={{ padding: 4, color: "var(--text-soft)", display: "flex" }}
            >
              <IcoTrash />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(); }}
              style={{
                padding: 2,
                color: liked ? "#e05c5c" : "var(--text-soft)",
                display: "flex",
              }}
            >
              <IcoHeart filled={liked} />
            </button>
          </div>
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-soft)",
            marginTop: 4,
            lineHeight: 1.4,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {recipe.ingredients.split("\n")[0]}
        </p>
      </div>
    </div>
  );
  return (
    <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: "none", display: "block" }}>
      {row}
    </Link>
  );
};

export default RecipeListRow;
