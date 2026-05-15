import React from "react";

const Card: React.FC<{ children: React.ReactNode; padding?: number }> = ({
  children,
  padding = 18,
}) => (
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

export default Card;
