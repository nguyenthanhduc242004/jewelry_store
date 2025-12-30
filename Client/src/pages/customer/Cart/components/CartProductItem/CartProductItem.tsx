import { Button, Image, InputNumber } from "antd";
import formatNumberWithDots from "../../../../../utils/formatNumberWithDots";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";

type CartProductItemProps = {
  productId: number;
  productImageUrl: string;
  productName: string;
  price: number;
  quantity: number;
  onRemove: (productId: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
};

const CartProductItem: React.FC<CartProductItemProps> = ({
  productId,
  productImageUrl,
  productName,
  price,
  quantity,
  onRemove,
  onQuantityChange
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const totalPrice = price * currentQuantity;

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0) {
      setCurrentQuantity(value);
      onQuantityChange(productId, value);
    }
  };

  return (
    <div className="flex  border border-solid border-black mb-2 relative rounded p-2">
      <div className="w-[120px] h-[120px]">
        <Image
          styles={{
            cover: {
              background: "rgba(0, 0, 0, 0.03)"
            }
          }}
          src={productImageUrl}
        />
      </div>
      <div className="flex flex-col flex-1 ml-3">
        <h3 className="text-xl mt-3">{productName}</h3>
        <span className="text-xl mt-1">{formatNumberWithDots(price)}₫</span>
        <div className="w-[140px] mt-2">
          <InputNumber
            mode="spinner"
            min={1}
            max={100}
            value={currentQuantity}
            onChange={handleQuantityChange}
            variant="filled"
            placeholder="Số lượng"
          />
        </div>
      </div>
      <Button
        size="small"
        icon={<CloseOutlined />}
        shape="circle"
        className="absolute top-1.5 right-1.5"
        onClick={() => onRemove(productId)}
      />
      <span className="absolute bottom-2 right-4 text-2xl">
        Tổng: {formatNumberWithDots(totalPrice)}₫
      </span>
    </div>
  );
};

export default CartProductItem;
