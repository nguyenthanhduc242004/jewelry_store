import React from "react";
import formatNumberWithDots from "../../../../../utils/formatNumberWithDots";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { message } from "antd";
import "./ProductCard.css";
import { CartService } from "../../../../../services";

type ProductCardProps = {
  productId: number;
  productImageUrl: string;
  productName: string;
  price: number;
  stock?: number;
  onClick?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  productImageUrl,
  productName,
  price,
  stock = 1,
  onClick
}) => {
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await CartService.addProduct({
        productId,
        quantity: 1
      });
      message.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      message.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  return (
    <div className="wrapper" style={{ cursor: onClick ? "pointer" : undefined }} onClick={onClick}>
      <div
        style={{
          background: `url(${productImageUrl}) no-repeat center`,
          width: "100%",
          paddingBottom: "100%",
          backgroundSize: "contain",
          position: "relative"
        }}
      >
        {stock > 0 && (
          <button
            onClick={handleAddToCart}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer"
            }}
          >
            <ShoppingCartOutlined />
          </button>
        )}
      </div>

      <div style={{ padding: "5px" }}>
        <p className="product-name">{productName}</p>
        <span
          style={{
            display: "block",
            color: "#ed8383",
            margin: "4px 0 2px",
            fontWeight: "bold",
            fontSize: "18px"
          }}
        >
          {formatNumberWithDots(price)}₫
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
