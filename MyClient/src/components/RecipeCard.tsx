import "./RecipeCard.css";
import React from "react";
import IconButton from "./buttons/IconButton";

const TrashIcon = ({ stroke = "currentColor" }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    stroke={stroke}
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="1,4 14,4" />
    <path d="M5.5,4V3a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V4" />
    <path d="M3,4l.8,8.5a.5.5,0,0,0,.5.5h6.4a.5.5,0,0,0,.5-.5L12,4" />
    <line x1="5.5" y1="6.5" x2="5.5" y2="11" />
    <line x1="7.5" y1="6.5" x2="7.5" y2="11" />
    <line x1="9.5" y1="6.5" x2="9.5" y2="11" />
  </svg>
);

interface RecipeCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  description,
  imageUrl,
}) => {
  const deleteRecipe = async (id: number) => {
    const response = await fetch(`/api/recipe/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete recipe");
    }
  };
  return (
    <div className="recipe-card">
      <img src={imageUrl} alt={title} className="recipe-card-image" />
      <div className="recipe-card-content">
        <h2 className="recipe-card-title">{title}</h2>
        <p className="recipe-card-description">{description}</p>

        <IconButton icon={<TrashIcon />} onClick={() => deleteRecipe(id)} />
      </div>
    </div>
  );
};

export default RecipeCard;
