import React, { useState } from "react";

const TextInput: React.FC<{
  id?: string;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  size?: "sm" | "md";
}> = ({
  id,
  value,
  onChange,
  onEnter,
  placeholder,
  multiline,
  rows = 3,
  size: sz = "md",
}) => {
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
        id={id}
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
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter?.();
        }
      }}
      style={style}
    />
  );
};

export default TextInput;
