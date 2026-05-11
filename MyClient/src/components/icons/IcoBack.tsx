import React from "react";
import SVGWrap from "./SVGWrap";

const IcoBack = ({ size }: { size?: number }) => (
  <SVGWrap size={size}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </SVGWrap>
);

export default IcoBack;
