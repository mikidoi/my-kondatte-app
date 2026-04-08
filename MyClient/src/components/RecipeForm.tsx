import React, { useRef, useState } from "react";

interface RecipeFormProps {
  onSubmit: (recipe: Recipe) => void;
}

interface Recipe {
  name: string;
  ingredients: string;
  instructions: string;
  image: File | null;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    onSubmit({ name, ingredients, instructions, image });
    setName("");
    setIngredients("");
    setInstructions("");
    setImage(null);

    dialogRef.current?.close();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <button onClick={openDialog}>Add Recipe</button>
      <dialog ref={dialogRef}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <button type="button" onClick={closeDialog}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="ingredients">Ingredients:</label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="instructions">Instructions:</label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="image">Image:</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </form>
      </dialog>
    </>
  );
};

export default RecipeForm;
