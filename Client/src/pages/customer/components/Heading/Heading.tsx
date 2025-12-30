import type React from "react";

type HeadingProps = {
  text: string;
  className?: string;
};

const Heading: React.FC<HeadingProps> = ({ text, className = "" }) => {
  return (
    <h1
      className={className}
      style={{
        textAlign: "center",
        marginTop: "60px",
        fontSize: "40px",
        letterSpacing: "4px",
        marginBottom: "24px"
      }}
    >
      {text}
    </h1>
  );
};

export default Heading;
