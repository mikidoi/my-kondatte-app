import React, { useState } from "react";
import IcoPlus from "../icons/IcoPlus";
import IcoTrash from "../icons/IcoTrash";
import TextInput from "../form/TextInput";

export interface IngredientRow {
  type: "ingredient";
  id: number;
  qty: string;
  unit: string;
  name: string;
  note: string;
}

export interface IngredientGroup {
  type: "group";
  id: number;
  label: string;
}

export type IngredientItem = IngredientRow | IngredientGroup;

const addBtnStyle: React.CSSProperties = {
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
};

const DragHandle: React.FC = () => (
  <div
    style={{
      cursor: "grab",
      color: "var(--border)",
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    }}
  >
    <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
      <circle cx="3" cy="4" r="1.4" />
      <circle cx="9" cy="4" r="1.4" />
      <circle cx="3" cy="8" r="1.4" />
      <circle cx="9" cy="8" r="1.4" />
      <circle cx="3" cy="12" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
    </svg>
  </div>
);

const IngredientRows: React.FC<{
  rows: IngredientItem[];
  onChange: (rows: IngredientItem[]) => void;
  mobile?: boolean;
}> = ({ rows, onChange, mobile }) => {
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const remove = (id: number) => onChange(rows.filter((r) => r.id !== id));

  const updateIngredient = (
    id: number,
    field: keyof Omit<IngredientRow, "type" | "id">,
    val: string
  ) =>
    onChange(
      rows.map((r) =>
        r.id === id && r.type === "ingredient" ? { ...r, [field]: val } : r
      )
    );

  const updateGroup = (id: number, label: string) =>
    onChange(
      rows.map((r) => (r.id === id && r.type === "group" ? { ...r, label } : r))
    );

  const addIngredient = () =>
    onChange([
      ...rows,
      {
        type: "ingredient",
        id: Date.now(),
        qty: "",
        unit: "",
        name: "",
        note: "",
      },
    ]);

  const addGroup = () =>
    onChange([...rows, { type: "group", id: Date.now(), label: "" }]);

  // TODO(human): implement handleDrop — reorder rows by moving the dragged item to the target position.
  // dragId is the id of the item being dragged, targetId is where it's dropped.
  // Hint: use findIndex to find both positions, splice to move, then call onChange and reset dragId/dragOverId.
  const handleDrop = (targetId: number) => {
    const dragIndex = rows.findIndex((r) => r.id === dragId);
    const targetIndex = rows.findIndex((r) => r.id === targetId);
    if (dragIndex === -1 || targetIndex === -1) return;
    if (dragIndex === targetIndex) return;

    const updatedRows = [...rows];
    const [draggedItem] = updatedRows.splice(dragIndex, 1);
    updatedRows.splice(targetIndex, 0, draggedItem);
    onChange(updatedRows);
    setDragId(null);
    setDragOverId(null);
  };

  interface DragProps {
    draggable: true;
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
    onDragEnd: () => void;
    style: React.CSSProperties;
  }

  const dragProps = (id: number): DragProps => ({
    draggable: true as const,
    onDragStart: () => setDragId(id),
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverId(id);
    },
    onDrop: () => handleDrop(id),
    onDragEnd: () => {
      setDragId(null);
      setDragOverId(null);
    },
    style: {
      opacity: dragId === id ? 0.4 : 1,
      outline:
        dragOverId === id && dragId !== id ? "2px solid var(--olive)" : "none",
      outlineOffset: 2,
      borderRadius: 10,
      transition: "opacity 0.15s",
    },
  });

  if (mobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((item) => {
          const dp = dragProps(item.id);
          if (item.type === "group") {
            return (
              <div
                key={item.id}
                {...dp}
                style={{
                  ...dp.style,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <DragHandle />
                <input
                  value={item.label}
                  onChange={(e) => updateGroup(item.id, e.target.value)}
                  placeholder="Group name…"
                  style={{
                    flex: 1,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--olive)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1.5px solid var(--olive-light)",
                    outline: "none",
                    padding: "4px 0",
                  }}
                />
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#b3b5a3",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  <IcoTrash size={13} />
                </button>
              </div>
            );
          }
          return (
            <div
              key={item.id}
              {...dp}
              style={{
                ...dp.style,
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
                  gridTemplateColumns: "16px 60px 60px 1fr 32px",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <DragHandle />
                <TextInput
                  value={item.qty}
                  onChange={(v) => updateIngredient(item.id, "qty", v)}
                  placeholder="1"
                  size="sm"
                />
                <TextInput
                  value={item.unit}
                  onChange={(v) => updateIngredient(item.id, "unit", v)}
                  placeholder="g"
                  size="sm"
                />
                <TextInput
                  value={item.name}
                  onChange={(v) => updateIngredient(item.id, "name", v)}
                  placeholder="Ingredient"
                  size="sm"
                />
                <button
                  type="button"
                  onClick={() => remove(item.id)}
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
              <TextInput
                value={item.note}
                onChange={(v) => updateIngredient(item.id, "note", v)}
                placeholder="Note (optional)"
                size="sm"
              />
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={addIngredient}
            style={{ ...addBtnStyle, flex: 1, padding: "12px" }}
          >
            <IcoPlus size={14} /> Add ingredient
          </button>
          <button
            type="button"
            onClick={addGroup}
            style={{
              ...addBtnStyle,
              padding: "12px 14px",
              color: "var(--text-mid)",
            }}
          >
            + Header
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "16px 70px 70px 1fr 1fr 28px",
          gap: 8,
          padding: "0 6px",
          fontSize: 10,
          fontWeight: 700,
          color: "#b3b5a3",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        <span />
        <span>Qty</span>
        <span>Unit</span>
        <span>Ingredient</span>
        <span>Note</span>
        <span />
      </div>
      {rows.map((item) => {
        const dp = dragProps(item.id);
        if (item.type === "group") {
          return (
            <div
              key={item.id}
              {...dp}
              style={{
                ...dp.style,
                display: "grid",
                gridTemplateColumns: "16px 70px 70px 1fr 1fr 28px",
                gap: 8,
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <DragHandle />
              <div
                style={{
                  gridColumn: "2 / 6",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <input
                  value={item.label}
                  onChange={(e) => updateGroup(item.id, e.target.value)}
                  placeholder="Group name…"
                  style={{
                    flex: 1,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--olive)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1.5px solid var(--olive-light)",
                    outline: "none",
                    padding: "4px 0",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
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
          );
        }
        return (
          <div
            key={item.id}
            {...dp}
            style={{
              ...dp.style,
              display: "grid",
              gridTemplateColumns: "16px 70px 70px 1fr 1fr 28px",
              gap: 8,
              alignItems: "center",
            }}
          >
            <DragHandle />
            <TextInput
              value={item.qty}
              onChange={(v) => updateIngredient(item.id, "qty", v)}
              placeholder="1"
              size="sm"
            />
            <TextInput
              value={item.unit}
              onChange={(v) => updateIngredient(item.id, "unit", v)}
              placeholder="g"
              size="sm"
            />
            <TextInput
              value={item.name}
              onChange={(v) => updateIngredient(item.id, "name", v)}
              placeholder="Ingredient"
              size="sm"
            />
            <TextInput
              value={item.note}
              onChange={(v) => updateIngredient(item.id, "note", v)}
              placeholder="optional"
              size="sm"
            />
            <button
              type="button"
              onClick={() => remove(item.id)}
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
        );
      })}
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button
          type="button"
          onClick={addIngredient}
          style={{ ...addBtnStyle, flex: 1 }}
        >
          <IcoPlus size={14} /> Add ingredient
        </button>
        <button
          type="button"
          onClick={addGroup}
          style={{
            ...addBtnStyle,
            padding: "10px 14px",
            color: "var(--text-mid)",
          }}
        >
          + Header
        </button>
      </div>
    </div>
  );
};

export default IngredientRows;
