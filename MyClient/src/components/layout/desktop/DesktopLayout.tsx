import React from "react";
import DesktopNavBar from "./DesktopNavBar";

const DesktopLayout: React.FC<{
  recipeCount: number;
  children: React.ReactNode;
}> = ({ recipeCount, children }) => (
  <div
    style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <DesktopNavBar recipeCount={recipeCount} />
    {children}
  </div>
);

export default DesktopLayout;
