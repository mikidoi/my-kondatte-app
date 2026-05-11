import React, {
  forwardRef,
  useEffect,
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
import IcoTrash from "./icons/IcoTrash";
import "./RecipeForm.css";

// ── Types ─────────────────────────────────────────────────────────────────────

interface IngredientRow {
  id: number;
  qty: string;
  unit: string;
  name: string;
  note: string;
}

interface InstructionStep {
  id: number;
  text: string;
}

export interface RecipeFormHandle {
  open: () => void;
}

interface RecipeFormProps {
  onSubmit: (recipe: {
    name: string;
    ingredients: string;
    instructions: string;
    image: File | null;
  }) => void;
}

// ── Primitive sub-components ──────────────────────────────────────────────────

function TextInput({
  value,
  onChange,
  placeholder,
  multiline,
  rows = 3,
  size: sz = "md",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  size?: "sm" | "md";
}) {
  const [focus, setFocus] = useState(false);
  const style: React.CSSProperties = {
    width: "100%",
    padding: sz === "sm" ? "7px 10px" : "10px 13px",
    background: "var(--white)",
    border: `1.5px solid ${focus ? "var(--olive)" : "var(--border)"}`,
    borderRadius: 10,
    fontSize: 14,
    color: "var(--text)",
    fontFamily: "DM Sans, sans-serif",
    boxShadow: focus ? "0 0 0 3px var(--olive-pale)" : "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    resize: multiline ? "vertical" : "none",
    outline: "none",
  };
  if (multiline) {
    return (
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={style}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={style}
    />
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-mid)",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </label>
        {hint && (
          <span style={{ fontSize: 11, color: "var(--text-soft)" }}>{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Card({
  children,
  padding = 18,
}: {
  children: React.ReactNode;
  padding?: number;
}) {
  return (
    <div
      style={{
        background: "var(--white)",
        border: "1px solid #e8ebd8",
        borderRadius: 14,
        padding,
        boxShadow: "0 1px 0 rgba(107,122,46,0.04)",
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <h3
        style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: 18,
          fontWeight: 400,
          color: "var(--text)",
        }}
      >
        {title}
      </h3>
      {count != null && (
        <span
          style={{
            fontSize: 12,
            color: "var(--text-soft)",
            background: "var(--olive-faint)",
            padding: "2px 8px",
            borderRadius: 20,
            border: "1px solid #e8ebd8",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

// ── Photo slot ────────────────────────────────────────────────────────────────

function PhotoSlot({
  file,
  onSelect,
  onRemove,
}: {
  file: File | null;
  onSelect: (f: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (file && preview) {
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
          src={preview}
          alt="Recipe"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
          }}
        >
          <button
            type="button"
            onClick={onRemove}
            style={{
              width: "100%",
              padding: "5px 8px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.94)",
              color: "#c44a3a",
              fontSize: 10,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <IcoTrash size={11} /> Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.[0]) onSelect(e.target.files[0]);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--olive)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--olive)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-soft)";
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 12,
          border: "1.5px dashed var(--border)",
          background: "var(--olive-faint)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          color: "var(--text-soft)",
          transition: "border-color 0.15s, color 0.15s",
        }}
      >
        <IcoCamera size={20} />
        <span style={{ fontSize: 11, fontWeight: 600 }}>Add photo</span>
      </button>
    </>
  );
}

// ── Ingredient rows ───────────────────────────────────────────────────────────

function IngredientRows({
  rows,
  onChange,
  mobile,
}: {
  rows: IngredientRow[];
  onChange: (rows: IngredientRow[]) => void;
  mobile?: boolean;
}) {
  const update = (id: number, field: keyof IngredientRow, val: string) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  const remove = (id: number) => onChange(rows.filter((r) => r.id !== id));
  const add = () =>
    onChange([...rows, { id: Date.now(), qty: "", unit: "", name: "", note: "" }]);

  if (mobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((ing) => (
          <div
            key={ing.id}
            style={{
              background: "var(--white)",
              border: "1px solid #e8ebd8",
              borderRadius: 10,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 60px 1fr 32px",
                gap: 6,
                alignItems: "center",
              }}
            >
              <TextInput value={ing.qty} onChange={(v) => update(ing.id, "qty", v)} placeholder="1" size="sm" />
              <TextInput value={ing.unit} onChange={(v) => update(ing.id, "unit", v)} placeholder="g" size="sm" />
              <TextInput value={ing.name} onChange={(v) => update(ing.id, "name", v)} placeholder="Ingredient" size="sm" />
              <button
                type="button"
                onClick={() => remove(ing.id)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  background: "#f8e8e3",
                  border: "none",
                  color: "#c44a3a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IcoTrash size={13} />
              </button>
            </div>
            <TextInput value={ing.note} onChange={(v) => update(ing.id, "note", v)} placeholder="Note (optional)" size="sm" />
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          style={{
            padding: "12px",
            borderRadius: 10,
            border: "1.5px dashed var(--border)",
            background: "transparent",
            color: "var(--olive)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <IcoPlus size={14} /> Add ingredient
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "70px 70px 1fr 1fr 28px",
          gap: 8,
          padding: "0 6px",
          fontSize: 10,
          fontWeight: 700,
          color: "#b3b5a3",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        <span>Qty</span>
        <span>Unit</span>
        <span>Ingredient</span>
        <span>Note</span>
        <span />
      </div>
      {rows.map((ing) => (
        <div
          key={ing.id}
          style={{
            display: "grid",
            gridTemplateColumns: "70px 70px 1fr 1fr 28px",
            gap: 8,
            alignItems: "center",
          }}
        >
          <TextInput value={ing.qty} onChange={(v) => update(ing.id, "qty", v)} placeholder="1" size="sm" />
          <TextInput value={ing.unit} onChange={(v) => update(ing.id, "unit", v)} placeholder="g" size="sm" />
          <TextInput value={ing.name} onChange={(v) => update(ing.id, "name", v)} placeholder="Ingredient" size="sm" />
          <TextInput value={ing.note} onChange={(v) => update(ing.id, "note", v)} placeholder="optional" size="sm" />
          <button
            type="button"
            onClick={() => remove(ing.id)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "transparent",
              border: "none",
              color: "#b3b5a3",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IcoTrash size={14} />
          </button>
        </div>
      ))}
      <div style={{ marginTop: 6 }}>
        <button
          type="button"
          onClick={add}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 9,
            border: "1.5px dashed var(--border)",
            background: "transparent",
            color: "var(--olive)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <IcoPlus size={14} /> Add ingredient
        </button>
      </div>
    </div>
  );
}

// ── Instruction steps ─────────────────────────────────────────────────────────

function InstructionSteps({
  steps,
  onChange,
}: {
  steps: InstructionStep[];
  onChange: (steps: InstructionStep[]) => void;
}) {
  const update = (id: number, text: string) =>
    onChange(steps.map((s) => (s.id === id ? { ...s, text } : s)));
  const remove = (id: number) => onChange(steps.filter((s) => s.id !== id));
  const add = () => onChange([...steps, { id: Date.now(), text: "" }]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s, i) => (
        <div key={s.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--olive)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 6,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <TextInput
              value={s.text}
              onChange={(v) => update(s.id, v)}
              placeholder={`Describe step ${i + 1}…`}
              multiline
              rows={2}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(s.id)}
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: "transparent",
              border: "none",
              color: "#b3b5a3",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 5,
            }}
          >
            <IcoTrash size={14} />
          </button>
        </div>
      ))}
      <div style={{ marginTop: 4 }}>
        <button
          type="button"
          onClick={add}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 9,
            border: "1.5px dashed var(--border)",
            background: "transparent",
            color: "var(--olive)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <IcoPlus size={14} /> Add step
        </button>
      </div>
    </div>
  );
}

// ── Serialization ─────────────────────────────────────────────────────────────

function serializeIngredients(rows: IngredientRow[]): string {
  return rows
    .filter((r) => r.name.trim())
    .map((r) => {
      const qty = [r.qty, r.unit].filter(Boolean).join("");
      const base = [qty, r.name.trim()].filter(Boolean).join(" ");
      return r.note.trim() ? `${base} (${r.note.trim()})` : base;
    })
    .join("\n");
}

function serializeInstructions(steps: InstructionStep[]): string {
  return steps
    .filter((s) => s.text.trim())
    .map((s, i) => `${i + 1}. ${s.text.trim()}`)
    .join("\n");
}

// ── Main component ────────────────────────────────────────────────────────────

const RecipeForm = forwardRef<RecipeFormHandle, RecipeFormProps>(
  ({ onSubmit }, ref) => {
    const bp = useBreakpoint();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState<IngredientRow[]>([
      { id: 1, qty: "", unit: "", name: "", note: "" },
    ]);
    const [instructions, setInstructions] = useState<InstructionStep[]>([
      { id: 1, text: "" },
    ]);
    const [image, setImage] = useState<File | null>(null);
    const [tab, setTab] = useState<"about" | "ingredients" | "steps">("about");

    useImperativeHandle(ref, () => ({
      open: () => {
        setTab("about");
        dialogRef.current?.showModal();
      },
    }));

    const reset = () => {
      setName("");
      setIngredients([{ id: Date.now(), qty: "", unit: "", name: "", note: "" }]);
      setInstructions([{ id: Date.now(), text: "" }]);
      setImage(null);
    };

    const close = () => dialogRef.current?.close();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!name.trim()) return;
      onSubmit({
        name: name.trim(),
        ingredients: serializeIngredients(ingredients),
        instructions: serializeInstructions(instructions),
        image,
      });
      reset();
      close();
    };

    const isMobile = bp === "mobile";

    const ingCount = ingredients.filter((r) => r.name.trim()).length;
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
      <dialog ref={dialogRef} className="recipe-form-dialog" style={dialogStyle}>
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
                  type="submit"
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
                      borderBottom: `2px solid ${tab === t.id ? "var(--olive)" : "transparent"}`,
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
                className="rf-scroll"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "14px 14px 40px",
                }}
              >
                {tab === "about" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                  </div>
                )}
                {tab === "ingredients" && (
                  <IngredientRows rows={ingredients} onChange={setIngredients} mobile />
                )}
                {tab === "steps" && (
                  <InstructionSteps steps={instructions} onChange={setInstructions} />
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
                    type="submit"
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
                className="rf-scroll"
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
                    <Card>
                      <SectionHead title="About" />
                      <Field label="Recipe name" hint={`${name.length}/80`}>
                        <TextInput
                          value={name}
                          onChange={setName}
                          placeholder="e.g. Sunday roast chicken"
                        />
                      </Field>
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
                      <IngredientRows rows={ingredients} onChange={setIngredients} />
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
  }
);

RecipeForm.displayName = "RecipeForm";

export default RecipeForm;
