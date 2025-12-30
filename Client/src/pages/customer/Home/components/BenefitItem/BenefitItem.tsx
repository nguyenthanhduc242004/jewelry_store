import React from "react";

type BenefitItemProps = {
  src: string;
  text: string;
};

const BenefitItem: React.FC<BenefitItemProps> = ({ src, text }) => {
  return (
    <div
      style={{
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 32px"
      }}
    >
      <img src={src} style={{ height: "40px", display: "block", margin: "12px 0" }} />
      <p>{text}</p>
    </div>
  );
};

export default BenefitItem;
