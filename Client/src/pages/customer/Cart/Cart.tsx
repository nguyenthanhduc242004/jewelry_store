import { CheckOutlined, DoubleLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Modal, Input, message } from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import formatNumberWithDots from "../../../utils/formatNumberWithDots";
import Heading from "../components/Heading";
import CartProductItem from "./components/CartProductItem";
import {
  CartService,
  AuthService,
  UserService,
  type CartDto,
  type CartItemDto
} from "../../../services";

type LocalCartItem = CartItemDto & { _removed?: boolean };

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [localItems, setLocalItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await CartService.getMyCart();
      setCart(data);
      setLocalItems(data.items.map((item) => ({ ...item })));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      message.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveProduct = (productId: number) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, _removed: true } : item))
    );
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleUpdateCart = async () => {
    try {
      setLoading(true);

      // Remove products marked for removal
      for (const item of localItems) {
        if (item._removed) {
          await CartService.removeProduct(item.productId);
        }
      }

      // Update quantities for remaining items
      for (const item of localItems) {
        if (!item._removed) {
          const originalItem = cart?.items.find((i) => i.productId === item.productId);
          if (originalItem && originalItem.quantity !== item.quantity) {
            await CartService.updateQuantity({
              productId: item.productId,
              quantity: item.quantity
            });
          }
        }
      }

      message.success("Đã cập nhật giỏ hàng");
      await fetchCart();
    } catch (err) {
      console.error("Failed to update cart:", err);
      message.error("Không thể cập nhật giỏ hàng");
    } finally {
      setLoading(false);
    }
  };
  const loadUserInfo = async () => {
    try {
      const meData = await AuthService.me();
      if (meData.authenticated && meData.userId) {
        const profile = await UserService.getUserById(meData.userId);
        setShippingAddress(profile.address || "");
        setPhoneNumber(profile.phone || "");
      }
    } catch (err) {
      console.error("Failed to load user info:", err);
    }
  };

  const handleOpenConfirmModal = () => {
    loadUserInfo();
    setIsConfirmModalOpen(true);
  };
  const handleConfirmCart = async () => {
    if (!shippingAddress || !phoneNumber) {
      message.error("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    try {
      const result = await CartService.confirmCart({ shippingAddress, phoneNumber });
      message.success("Đặt hàng thành công!");
      setIsConfirmModalOpen(false);
      navigate(`/`);
    } catch (err) {
      console.error("Failed to confirm cart:", err);
      message.error("Không thể đặt hàng. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="text-center py-12">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  const visibleItems = localItems.filter((item) => !item._removed);
  const itemCount = visibleItems.length;
  const totalPrice = visibleItems.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);

  return (
    <div className="main-container">
      <Heading className="!mt-12 !mb-0" text="Giỏ hàng của bạn" />
      <p className="text-center text-[18px]">Có {itemCount} sản phẩm trong giỏ hàng</p>
      <div className="h-[4px] bg-black w-[80px] mx-auto rounded mt-4 mb-6" />
      {itemCount === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-4">Giỏ hàng của bạn đang trống</p>
          <Link to="/">
            <Button type="primary" size="large">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {visibleItems.map((item) => (
              <CartProductItem
                key={item.productId}
                productId={item.productId}
                productImageUrl={item.productImage || "/img/placeholder.png"}
                productName={item.productName}
                price={item.priceAtAdd}
                quantity={item.quantity}
                onRemove={handleRemoveProduct}
                onQuantityChange={handleUpdateQuantity}
              />
            ))}
          </div>
          <div className="flex">
            <span className="ml-auto text-4xl mt-8">
              <span className="text-2xl">Tổng tiền: </span>
              {formatNumberWithDots(totalPrice)}₫
            </span>
          </div>
          <div>
            <div className="flex justify-center mt-4 mb-8">
              <Link to="/">
                <Button
                  className="p-6 ml-2 bg-blue rounded-none pt-8"
                  style={{ fontFamily: "Josefin Sans" }}
                  icon={<DoubleLeftOutlined />}
                >
                  TIẾP TỤC MUA HÀNG
                </Button>
              </Link>
              <Button
                className="p-6 ml-2 bg-blue rounded-none pt-8"
                style={{ fontFamily: "Josefin Sans" }}
                icon={<ReloadOutlined />}
                onClick={handleUpdateCart}
              >
                CẬP NHẬT
              </Button>
              <Button
                className="p-6 ml-2 bg-blue rounded-none pt-8"
                style={{ fontFamily: "Josefin Sans" }}
                icon={<CheckOutlined />}
                onClick={handleOpenConfirmModal}
              >
                THANH TOÁN
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        title="Xác nhận đặt hàng"
        open={isConfirmModalOpen}
        onOk={handleConfirmCart}
        onCancel={() => setIsConfirmModalOpen(false)}
        okText="Đặt hàng"
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Địa chỉ giao hàng:</label>
            <Input.TextArea
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Nhập địa chỉ giao hàng"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Số điện thoại:</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
