import React from "react";
import "./CarouselItem.css";

interface CarouselProps {
  leftImageUrl: string;
  heading: string;
  subheading: string;
  rightImageUrl: string;
  message: string;
  btnText: string;
  onButtonClick?: () => void;
}

const Carousel: React.FC<CarouselProps> = ({
  leftImageUrl,
  heading,
  subheading,
  rightImageUrl,
  message,
  btnText,
  onButtonClick
}) => {
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 81px)"
      }}
    >
      {/* Left side */}
      <div style={{ width: "50%", position: "relative" }}>
        <img
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={leftImageUrl}
          alt="Left"
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <h2 className="carousel-heading">{heading}</h2>
          <h4 className="carousel-subheading">{subheading}</h4>
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          width: "50%",
          backgroundImage: "linear-gradient(0, #d1913c, #ffd194)"
        }}
      >
        <div className="carousel-right">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "60%",
              marginBottom: "15px"
            }}
          >
            <div className="carousel-image-border" />
            <img className="carousel-image" src={rightImageUrl} alt="Right" />
          </div>
          <p className="carousel-paragraph">{message}</p>
          <button className="carousel-btn" onClick={onButtonClick}>
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
