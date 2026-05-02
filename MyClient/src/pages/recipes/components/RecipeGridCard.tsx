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

const RecipeGridCard: React.FC<{
  recipe: Recipe;
  idx: number;
  compact?: boolean;
  liked: boolean;
  onToggleLike: () => void;
  onDelete: () => void;
}> = ({ recipe, idx, compact, liked, onToggleLike, onDelete }) => {
  const [hov, setHov] = useState(false);
  const card = (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="recipe-card-anim"
      style={{
        background: "var(--white)",
        borderRadius: compact ? 12 : 16,
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: hov
          ? "0 8px 24px rgba(107,122,46,0.18)"
          : "0 1px 6px rgba(0,0,0,0.06)",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all 0.2s",
        animationDelay: `${Math.min(idx, 8) * 50}ms`,
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
        <RecipeImg
          recipe={recipe}
          style={{
            transform: hov ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.3s",
          }}
        />
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(); }}
          style={{
            position: "absolute", top: 9, right: 9,
            width: 30, height: 30, borderRadius: "50%",
            background: liked ? "#e05c5c" : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.14)",
            color: liked ? "#fff" : "#999",
            transition: "background 0.15s",
          }}
        >
          <IcoHeart filled={liked} />
        </button>
        {hov && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
            style={{
              position: "absolute", top: 9, left: 9,
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.14)",
              color: "var(--text-soft)",
            }}
          >
            <IcoTrash />
          </button>
        )}
      </div>
      <div style={{ padding: compact ? "10px 12px 12px" : "13px 14px 15px" }}>
        <h3
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: compact ? 14 : 16,
            fontWeight: 400,
            color: "var(--text)",
            lineHeight: 1.3,
          }}
        >
          {recipe.name}
        </h3>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-soft)",
            marginTop: 4,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {recipe.ingredients.split("\n")[0]}
        </p>
      </div>
    </div>
  );
  return (
    <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: "none", display: "block" }}>
      {card}
    </Link>
  );
};

export default RecipeGridCard;
