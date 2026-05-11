import React from "react";
import SVGWrap from "./SVGWrap";

const IcoCheck = ({ size }: { size?: number }) => (
  <SVGWrap size={size}>
    <polyline points="20 6 9 17 4 12" />
  </SVGWrap>
);

export default IcoCheck;
