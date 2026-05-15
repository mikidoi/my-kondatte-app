import React, { useEffect, useRef, useState } from "react";
import IcoCamera from "../icons/IcoCamera";
import IcoTrash from "../icons/IcoTrash";

const PhotoSlot: React.FC<{
  file: File | null;
  onSelect: (f: File) => void;
  onRemove: () => void;
}> = ({ file, onSelect, onRemove }) => {
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
        onChange={(e) => { if (e.target.files?.[0]) onSelect(e.target.files[0]); }}
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
};

export default PhotoSlot;
