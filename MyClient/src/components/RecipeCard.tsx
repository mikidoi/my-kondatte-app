import "./RecipeCard.css";
import React from "react";

interface RecipeCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <div className="recipe-card">
      <img src={imageUrl} alt={title} className="recipe-card-image" />
      <div className="recipe-card-content">
        <h2 className="recipe-card-title">{title}</h2>
        <p className="recipe-card-description">{description}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
