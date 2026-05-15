import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useBreakpoint from "../hooks/useBreakpoint";
import IcoBack from "./icons/IcoBack";
import IcoCheck from "./icons/IcoCheck";
import IcoClose from "./icons/IcoClose";
import IcoTrash from "./icons/IcoTrash";
import "./CreateRecipeDialog.css";
import Card from "./layout/Card";
import SectionHead from "./layout/SectionHead";
import Field from "./form/Field";
import PhotoSlot from "./form/PhotoSlot";
import TextInput from "./form/TextInput";
import IngredientRows, { IngredientItem } from "./recipe/IngredientRows";
import InstructionSteps, { InstructionStep } from "./recipe/InstructionSteps";
import { recipeApi } from "../api/recipe-api";
import type { Recipe } from "../types/recipe";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EditRecipeDialogHandle {
  open: (recipe: Recipe) => void;
}

interface EditRecipeDialogProps {
  onSaved?: () => void;
}

// ── Serialization / parsing ───────────────────────────────────────────────────

function serializeIngredients(items: IngredientItem[]): string {
  return items
    .filter((item) => item.type === "group" || item.name.trim())
    .map((item) => {
      if (item.type === "group") return `[${item.label.trim() || "Group"}]`;
      const qty = [item.qty, item.unit].filter(Boolean).join("");
      const base = [qty, item.name.trim()].filter(Boolean).join(" ");
      return item.note.trim() ? `${base} (${item.note.trim()})` : base;
    })
    .join("\n");
}

function serializeInstructions(steps: InstructionStep[]): string {
  return steps
    .filter((s) => s.text.trim())
    .map((s, i) => `${i + 1}. ${s.text.trim()}`)
    .join("\n");
}

function parseIngredients(text: string): IngredientItem[] {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length === 0)
    return [
      {
        type: "ingredient" as const,
        id: Date.now(),
        qty: "",
        unit: "",
        name: "",
        note: "",
      },
    ];
  return lines.map((line, i) => ({
    type: "ingredient" as const,
    id: Date.now() + i,
    qty: "",
    unit: "",
    name: line.trim(),
    note: "",
  }));
}

function parseInstructions(text: string): InstructionStep[] {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
  if (lines.length === 0) return [{ id: Date.now(), text: "" }];
  return lines.map((t, i) => ({ id: Date.now() + i, text: t }));
}

// ── Existing image slot ───────────────────────────────────────────────────────

const ExistingPhotoSlot: React.FC<{
  url: string;
  onReplace: () => void;
  onRemove: () => void;
}> = ({ url, onReplace, onRemove }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: 120,
        height: 120,
        borderRadius: 12,
        overflow: "hidden",
        border: "1.5px solid var(--olive)",
      }}
    >
      <img
        src={url}
        alt="Recipe"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          padding: "3px 8px",
          borderRadius: 20,
          background: "var(--olive)",
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        Cover
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 6,
          background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.15s",
          display: "flex",
          gap: 4,
        }}
      >
        <button
          type="button"
          onClick={onReplace}
          style={{
            flex: 1,
            padding: "5px 6px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.94)",
            color: "var(--text)",
            fontSize: 10,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          Change
        </button>
        <button
          type="button"
          onClick={onRemove}
          style={{
            padding: "5px 6px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.94)",
            color: "#c44a3a",
            fontSize: 10,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          <IcoTrash size={11} />
        </button>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const EditRecipeDialog = forwardRef<
  EditRecipeDialogHandle,
  EditRecipeDialogProps
>(({ onSaved }, ref) => {
  const bp = useBreakpoint();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [recipeId, setRecipeId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [preparationTime, setPreparationTime] = useState(0);
  const [servesCount, setServesCount] = useState(1);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { type: "ingredient", id: 1, qty: "", unit: "", name: "", note: "" },
  ]);
  const [instructions, setInstructions] = useState<InstructionStep[]>([
    { id: 1, text: "" },
  ]);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(
    null
  );
  const [newImage, setNewImage] = useState<File | null>(null);
  const [tab, setTab] = useState<"about" | "ingredients" | "steps">("about");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    open: (recipe: Recipe) => {
      setRecipeId(recipe.id);
      setName(recipe.name);
      setDescription(recipe.description);
      setCategory(recipe.category);
      setPreparationTime(recipe.preparationTime);
      setServesCount(recipe.servesCount);
      setIngredients(parseIngredients(recipe.ingredients));
      setInstructions(parseInstructions(recipe.instructions));
      setExistingImagePath(recipe.imagePath ?? null);
      setNewImage(null);
      setTab("about");
      setError(null);
      dialogRef.current?.showModal();
    },
  }));

  const close = () => dialogRef.current?.close();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setSaving(true);
      e.preventDefault();
      if (!name.trim()) return;
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category.trim());
      formData.append("preparationTime", preparationTime.toString());
      formData.append("servesCount", servesCount.toString());
      formData.append("ingredients", serializeIngredients(ingredients));
      formData.append("instructions", serializeInstructions(instructions));
      if (newImage) {
        formData.append("file", newImage);
      }
      await recipeApi.editRecipe(recipeId, formData);
      close();
      onSaved?.();
    } catch (error) {
      setError("Failed to save recipe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isMobile = bp === "mobile";
  const ingCount = ingredients.filter(
    (r) => r.type === "ingredient" && r.name.trim()
  ).length;
  const stepCount = instructions.filter((s) => s.text.trim()).length;

  const tabs = [
    { id: "about" as const, label: "About", count: null },
    { id: "ingredients" as const, label: "Ingredients", count: ingCount },
    { id: "steps" as const, label: "Steps", count: stepCount },
  ];

  const photoSection = (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setNewImage(e.target.files[0]);
            setExistingImagePath(null);
          }
          e.target.value = "";
        }}
      />
      {newImage ? (
        <PhotoSlot
          file={newImage}
          onSelect={setNewImage}
          onRemove={() => setNewImage(null)}
        />
      ) : existingImagePath ? (
        <ExistingPhotoSlot
          url={`/images/${existingImagePath}`}
          onReplace={() => imageInputRef.current?.click()}
          onRemove={() => setExistingImagePath(null)}
        />
      ) : (
        <PhotoSlot
          file={null}
          onSelect={setNewImage}
          onRemove={() => setNewImage(null)}
        />
      )}
    </>
  );

  const dialogStyle: React.CSSProperties = isMobile
    ? {
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: 0,
        margin: 0,
        padding: 0,
        border: "none",
        background: "var(--bg)",
        overflow: "hidden",
      }
    : {
        width: "min(1180px, 95vw)",
        maxHeight: "90vh",
        borderRadius: 18,
        padding: 0,
        border: "none",
        background: "var(--bg)",
        overflow: "hidden",
        boxShadow:
          "0 30px 80px rgba(20,22,12,0.35), 0 0 0 1px rgba(255,255,255,0.06)",
      };

  return (
    <dialog
      ref={dialogRef}
      className="create-recipe-dialog"
      style={dialogStyle}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {isMobile ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "var(--white)",
                borderBottom: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={close}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background: "var(--olive-faint)",
                  color: "var(--text-mid)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IcoBack size={18} />
              </button>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: 18,
                  fontWeight: 400,
                  color: "var(--text)",
                }}
              >
                Edit recipe
              </h2>
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "8px 14px",
                  borderRadius: 9,
                  background: saving ? "var(--border)" : "var(--olive)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <IcoCheck size={13} /> {saving ? "Saving…" : "Save"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                background: "var(--white)",
                borderBottom: "1px solid var(--border)",
                padding: "0 14px",
                flexShrink: 0,
              }}
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    color: tab === t.id ? "var(--olive)" : "var(--text-soft)",
                    fontSize: 13,
                    fontWeight: tab === t.id ? 700 : 500,
                    borderBottom: `2px solid ${
                      tab === t.id ? "var(--olive)" : "transparent"
                    }`,
                    marginBottom: -1,
                  }}
                >
                  {t.label}
                  {t.count != null && t.count > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        background:
                          tab === t.id ? "var(--olive-pale)" : "var(--border)",
                        color:
                          tab === t.id ? "var(--olive)" : "var(--text-soft)",
                        padding: "1px 6px",
                        borderRadius: 20,
                      }}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div
              className="crd-scroll"
              style={{ flex: 1, overflowY: "auto", padding: "14px 14px 40px" }}
            >
              {tab === "about" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-mid)",
                        letterSpacing: "0.01em",
                        marginBottom: 8,
                      }}
                    >
                      Photo
                    </p>
                    {photoSection}
                  </div>
                  <Field label="Recipe name" hint={`${name.length}/80`}>
                    <TextInput
                      value={name}
                      onChange={setName}
                      placeholder="e.g. Sunday roast chicken"
                    />
                  </Field>
                  <Field label="Description">
                    <TextInput
                      value={description}
                      onChange={setDescription}
                      placeholder="A short note about this recipe…"
                      multiline
                      rows={2}
                    />
                  </Field>
                  <Field label="Category">
                    <TextInput
                      value={category}
                      onChange={setCategory}
                      placeholder="e.g. Dinner"
                    />
                  </Field>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <Field label="Prep time (min)">
                      <input
                        type="number"
                        min={0}
                        value={preparationTime}
                        onChange={(e) =>
                          setPreparationTime(Number(e.target.value))
                        }
                        style={{
                          width: "100%",
                          padding: "10px 13px",
                          background: "var(--white)",
                          border: "1.5px solid var(--border)",
                          borderRadius: 10,
                          fontSize: 14,
                          color: "var(--text)",
                          fontFamily: "DM Sans, sans-serif",
                          outline: "none",
                        }}
                      />
                    </Field>
                    <Field label="Serves">
                      <input
                        type="number"
                        min={1}
                        value={servesCount}
                        onChange={(e) => setServesCount(Number(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "10px 13px",
                          background: "var(--white)",
                          border: "1.5px solid var(--border)",
                          borderRadius: 10,
                          fontSize: 14,
                          color: "var(--text)",
                          fontFamily: "DM Sans, sans-serif",
                          outline: "none",
                        }}
                      />
                    </Field>
                  </div>
                  {error && (
                    <p style={{ fontSize: 12, color: "#c44a3a" }}>{error}</p>
                  )}
                </div>
              )}
              {tab === "ingredients" && (
                <IngredientRows
                  rows={ingredients}
                  onChange={setIngredients}
                  mobile
                />
              )}
              {tab === "steps" && (
                <InstructionSteps
                  steps={instructions}
                  onChange={setInstructions}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
                background: "var(--white)",
                borderBottom: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: "var(--text)",
                }}
              >
                Edit recipe
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {error && (
                  <span style={{ fontSize: 12, color: "#c44a3a" }}>
                    {error}
                  </span>
                )}
                <button
                  type="button"
                  onClick={close}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 9,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-mid)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 18px",
                    borderRadius: 9,
                    background: saving ? "var(--border)" : "var(--olive)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  <IcoCheck size={14} /> {saving ? "Saving…" : "Save changes"}
                </button>
                <div
                  style={{
                    width: 1,
                    height: 24,
                    background: "var(--border)",
                    margin: "0 4px",
                  }}
                />
                <button
                  type="button"
                  onClick={close}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "transparent",
                    color: "var(--text-soft)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IcoClose size={18} />
                </button>
              </div>
            </div>

            <div
              className="crd-scroll"
              style={{ flex: 1, overflowY: "auto", padding: 24 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    minWidth: 0,
                  }}
                >
                  <Card>
                    <SectionHead title="About" />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      <Field label="Recipe name" hint={`${name.length}/80`}>
                        <TextInput
                          value={name}
                          onChange={setName}
                          placeholder="e.g. Sunday roast chicken"
                        />
                      </Field>
                      <Field label="Description">
                        <TextInput
                          value={description}
                          onChange={setDescription}
                          placeholder="A short note about this recipe…"
                          multiline
                          rows={2}
                        />
                      </Field>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                      >
                        <Field label="Category">
                          <TextInput
                            value={category}
                            onChange={setCategory}
                            placeholder="e.g. Dinner"
                          />
                        </Field>
                        <Field label="Prep time (min)">
                          <input
                            type="number"
                            min={0}
                            value={preparationTime}
                            onChange={(e) =>
                              setPreparationTime(Number(e.target.value))
                            }
                            style={{
                              width: "100%",
                              padding: "10px 13px",
                              background: "var(--white)",
                              border: "1.5px solid var(--border)",
                              borderRadius: 10,
                              fontSize: 14,
                              color: "var(--text)",
                              fontFamily: "DM Sans, sans-serif",
                              outline: "none",
                            }}
                          />
                        </Field>
                      </div>
                      <Field label="Serves">
                        <input
                          type="number"
                          min={1}
                          value={servesCount}
                          onChange={(e) =>
                            setServesCount(Number(e.target.value))
                          }
                          style={{
                            width: "100%",
                            padding: "10px 13px",
                            background: "var(--white)",
                            border: "1.5px solid var(--border)",
                            borderRadius: 10,
                            fontSize: 14,
                            color: "var(--text)",
                            fontFamily: "DM Sans, sans-serif",
                            outline: "none",
                          }}
                        />
                      </Field>
                    </div>
                  </Card>
                  <Card>
                    <SectionHead title="Photo" />
                    {photoSection}
                  </Card>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    minWidth: 0,
                  }}
                >
                  <Card>
                    <SectionHead title="Ingredients" count={ingCount} />
                    <IngredientRows
                      rows={ingredients}
                      onChange={setIngredients}
                    />
                  </Card>
                  <Card>
                    <SectionHead title="Instructions" count={stepCount} />
                    <InstructionSteps
                      steps={instructions}
                      onChange={setInstructions}
                    />
                  </Card>
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </dialog>
  );
});

EditRecipeDialog.displayName = "EditRecipeDialog";

export default EditRecipeDialog;
