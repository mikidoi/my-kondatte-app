import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useBreakpoint from "../hooks/useBreakpoint";
import IcoBack from "./icons/IcoBack";
import IcoCamera from "./icons/IcoCamera";
import IcoCheck from "./icons/IcoCheck";
import IcoClose from "./icons/IcoClose";
import IcoPlus from "./icons/IcoPlus";
import "./CreateRecipeDialog.css";
import Card from "./layout/Card";
import SectionHead from "./layout/SectionHead";
import Field from "./form/Field";
import PhotoSlot from "./form/PhotoSlot";
import TextInput from "./form/TextInput";
import IngredientRows, { IngredientItem } from "./recipe/IngredientRows";
import InstructionSteps, { InstructionStep } from "./recipe/InstructionSteps";
import { recipeApi } from "../api/recipe-api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CreateRecipeDialogHandle {
  open: () => void;
}

interface CreateRecipeDialogProps {
  onSubmit: (recipe: {
    name: string;
    description: string;
    categories: string[];
    preparationTime: number;
    servesCount: number;
    ingredients: string;
    instructions: string;
    image: File | null;
  }) => void;
}

// ── Serialization ─────────────────────────────────────────────────────────────

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

function parseInstructions(text: string): InstructionStep[] {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
  if (lines.length === 0) return [{ id: Date.now(), text: "" }];
  return lines.map((t, i) => ({ id: Date.now() + i, text: t }));
}

function parseIngredients(_text: string): IngredientItem[] {
  const lines = _text.split("\n").filter((line) => line.trim());

  const ingredients = lines.map((line, index) => ({
    type: "ingredient" as const,
    id: Date.now() + index,
    qty: "",
    unit: "",
    name: line.trim(),
    note: "",
  }));
  return ingredients.length > 0
    ? ingredients
    : [
        {
          type: "ingredient" as const,
          id: Date.now(),
          qty: "",
          unit: "",
          name: "",
          note: "",
        },
      ];
}

// ── Main component ────────────────────────────────────────────────────────────

const CreateRecipeDialog = forwardRef<
  CreateRecipeDialogHandle,
  CreateRecipeDialogProps
>(({ onSubmit }, ref) => {
  const bp = useBreakpoint();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  console.log("category", category);
  const [preparationTime, setPreparationTime] = useState(0);
  const [servesCount, setServesCount] = useState(1);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { type: "ingredient", id: 1, qty: "", unit: "", name: "", note: "" },
  ]);
  const [instructions, setInstructions] = useState<InstructionStep[]>([
    { id: 1, text: "" },
  ]);
  const [image, setImage] = useState<File | null>(null);
  const [tab, setTab] = useState<"about" | "ingredients" | "steps">("about");
  const scanInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scanLanguage, setScanLanguage] = useState("English");
  const [scanError, setScanError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setTab("about");
      dialogRef.current?.showModal();
    },
  }));

  const reset = () => {
    setName("");
    setDescription("");
    setCategory([]);
    setPreparationTime(0);
    setServesCount(1);
    setIngredients([
      {
        type: "ingredient",
        id: Date.now(),
        qty: "",
        unit: "",
        name: "",
        note: "",
      },
    ]);
    setInstructions([{ id: Date.now(), text: "" }]);
    setImage(null);
  };

  const close = () => dialogRef.current?.close();

  const handleScanFile = async (file: File) => {
    setImage(file);
    setScanning(true);
    setScanError(null);
    try {
      const result = await recipeApi.scanRecipe(file, scanLanguage);
      setName(result.name);
      setDescription(result.description);
      setCategory(
        result.category
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
      setIngredients(parseIngredients(result.ingredients));
      setInstructions(parseInstructions(result.instructions));
    } catch {
      setScanError("Could not scan the recipe. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  interface SubmitEvent extends React.FormEvent<HTMLFormElement> {}

  interface RecipeData {
    name: string;
    description: string;
    categories: string[];
    preparationTime: number;
    servesCount: number;
    ingredients: string;
    instructions: string;
    image: File | null;
  }

  const handleSubmit = (e: SubmitEvent): void => {
    e.preventDefault();
    if (!name.trim()) return;
    const recipe: RecipeData = {
      name: name.trim(),
      description: description.trim(),
      categories: category,
      preparationTime,
      servesCount,
      ingredients: serializeIngredients(ingredients),
      instructions: serializeInstructions(instructions),
      image,
    };
    onSubmit(recipe);
    reset();
    close();
  };

  const isMobile = bp === "mobile";

  const scanBanner = (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--olive-faint)",
        border: "1.5px solid var(--olive-pale)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IcoCamera size={15} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
          Scan &amp; translate recipe
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-soft)",
            whiteSpace: "nowrap",
          }}
        >
          Translate to
        </span>
        <select
          value={scanLanguage}
          onChange={(e) => setScanLanguage(e.target.value)}
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: 8,
            border: "1.5px solid var(--border)",
            background: "var(--white)",
            fontSize: 13,
            color: "var(--text)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          <option value="English">English</option>
          <option value="Japanese">Japanese</option>
          <option value="Swedish">Swedish</option>
        </select>
        <button
          type="button"
          disabled={scanning}
          onClick={() => scanInputRef.current?.click()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 8,
            background: scanning ? "var(--border)" : "var(--olive)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: scanning ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <IcoCamera size={12} /> {scanning ? "Scanning…" : "Choose photo"}
        </button>
      </div>
      {scanError && (
        <p style={{ fontSize: 11, color: "#c44a3a", margin: 0 }}>{scanError}</p>
      )}
    </div>
  );

  const ingCount = ingredients.filter(
    (r) => r.type === "ingredient" && r.name.trim()
  ).length;
  const stepCount = instructions.filter((s) => s.text.trim()).length;

  const tabs = [
    { id: "about" as const, label: "About", count: null },
    { id: "ingredients" as const, label: "Ingredients", count: ingCount },
    { id: "steps" as const, label: "Steps", count: stepCount },
  ];

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
        <input
          ref={scanInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.[0]) handleScanFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
        {isMobile ? (
          <>
            {/* ── Mobile header ── */}
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
                New recipe
              </h2>
              <button
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "8px 14px",
                  borderRadius: 9,
                  background: "var(--olive)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <IcoCheck size={13} /> Save
              </button>
            </div>

            {/* ── Mobile tabs ── */}
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

            {/* ── Mobile body ── */}
            <div
              className="crd-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px 14px 40px",
              }}
            >
              {tab === "about" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {scanBanner}
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
                    <PhotoSlot
                      file={image}
                      onSelect={setImage}
                      onRemove={() => setImage(null)}
                    />
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
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {category.map((c) => (
                        <span
                          key={c}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: "var(--olive-pale)",
                            fontSize: 13,
                          }}
                        >
                          {c}{" "}
                          <span
                            onClick={() =>
                              setCategory(category.filter((item) => item !== c))
                            }
                            style={{ cursor: "pointer" }}
                          >
                            x
                          </span>
                        </span>
                      ))}
                    </div>
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
            {/* ── Desktop header ── */}
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
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "var(--olive-pale)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--olive)",
                  }}
                >
                  <IcoPlus size={20} />
                </div>
                <h2
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: 22,
                    fontWeight: 400,
                    color: "var(--text)",
                  }}
                >
                  New recipe
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e as unknown as SubmitEvent);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 18px",
                    borderRadius: 9,
                    background: "var(--olive)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <IcoCheck size={14} /> Save recipe
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

            {/* ── Desktop body ── */}
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
                {/* Left: About + Photo */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    minWidth: 0,
                  }}
                >
                  <Card>{scanBanner}</Card>
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
                          gap: 12,
                        }}
                      >
                        <Field label="Category">
                          <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                              <TextInput
                                id="add-new-category"
                                value={newCategory}
                                onChange={setNewCategory}
                                placeholder="Add a new Category"
                                onEnter={() => {
                                  setCategory((prev) =>
                                    prev.includes(newCategory)
                                      ? prev
                                      : [...prev, newCategory]
                                  );
                                  setNewCategory("");
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flex: 1,
                                flexWrap: "wrap",
                                gap: 6,
                                alignItems: "flex-start",
                              }}
                            >
                              {category.map((c) => (
                                <span
                                  key={c}
                                  style={{
                                    padding: "3px 10px",
                                    borderRadius: 20,
                                    background: "var(--olive-pale)",
                                    fontSize: 13,
                                  }}
                                >
                                  {c}{" "}
                                  <span
                                    onClick={() =>
                                      setCategory(
                                        category.filter((item) => item !== c)
                                      )
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    x
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>
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
                    <PhotoSlot
                      file={image}
                      onSelect={setImage}
                      onRemove={() => setImage(null)}
                    />
                  </Card>
                </div>

                {/* Right: Ingredients + Instructions */}
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

CreateRecipeDialog.displayName = "CreateRecipeDialog";

export default CreateRecipeDialog;
