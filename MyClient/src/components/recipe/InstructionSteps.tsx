import React from "react";
import IcoPlus from "../icons/IcoPlus";
import IcoTrash from "../icons/IcoTrash";
import TextInput from "../form/TextInput";

export interface InstructionStep {
  id: number;
  text: string;
}

const InstructionSteps: React.FC<{
  steps: InstructionStep[];
  onChange: (steps: InstructionStep[]) => void;
}> = ({ steps, onChange }) => {
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
            style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: "none", color: "#b3b5a3", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 5 }}
          >
            <IcoTrash size={14} />
          </button>
        </div>
      ))}
      <div style={{ marginTop: 4 }}>
        <button
          type="button"
          onClick={add}
          style={{ width: "100%", padding: "10px", borderRadius: 9, border: "1.5px dashed var(--border)", background: "transparent", color: "var(--olive)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <IcoPlus size={14} /> Add step
        </button>
      </div>
    </div>
  );
};

export default InstructionSteps;
