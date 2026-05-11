import React from "react";
import SVGWrap from "./SVGWrap";

const IcoClose = ({ size }: { size?: number }) => (
  <SVGWrap size={size}>
    <path d="M18 6L6 18M6 6l12 12" />
  </SVGWrap>
);

export default IcoClose;
