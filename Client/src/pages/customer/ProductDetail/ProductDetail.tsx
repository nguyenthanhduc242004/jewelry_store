import { ShoppingOutlined } from "@ant-design/icons";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { type Options } from "@splidejs/splide";
import { Button, Col, Divider, Image, InputNumber, Row, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import formatNumberWithDots from "../../../utils/formatNumberWithDots";
import Heading from "../components/Heading";
import "./ProductDetail.css";
import ProductCard from "../Home/components/ProductCard";
import { ProductService, ProductImageService, CartService } from "../../../services";
import type { ProductDetail as ProductDetailType, ProductPreview } from "../../../services";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mainRef = useRef<any>(null);
  const thumbsRef = useRef<any>(null);

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [similarProducts, setSimilarProducts] = useState<ProductPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await ProductService.fetchProductById(Number(id), {
          signal: controller.signal
        });
        setProduct(productData);

        // Fetch product images
        try {
          const productImages = await ProductImageService.fetchProductImages(Number(id), {
            signal: controller.signal
          });
          const imageUrls = productImages
            .sort((a, b) => a.imageOrder - b.imageOrder)
            .map((img) => img.imageUrl);
          setImages(imageUrls.length > 0 ? imageUrls : ["/img/placeholder.png"]);
        } catch (err) {
          console.error("Failed to load product images:", err);
          setImages(["/img/placeholder.png"]);
        }

        // Fetch similar products (same category)
        try {
          const allProducts = await ProductService.fetchProductPreview(0, 200, {
            signal: controller.signal
          });
          const similar = allProducts
            .filter((p) => p.categoryName === productData.categoryName && p.id !== productData.id)
            .slice(0, 8);
          setSimilarProducts(similar);
        } catch (err) {
          console.error("Failed to load similar products:", err);
        }
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load product:", err);
          message.error("Failed to load product details");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide);
    }
  }, [images]);

  const mainOptions: Options = {
    type: "loop",
    height: "100%",
    perMove: 1,
    pagination: false
  };

  const thumbsOptions: Options = {
    type: "slide",
    rewind: true,
    arrows: false,
    gap: "8px",
    pagination: false,
    fixedWidth: 110,
    fixedHeight: 110,
    cover: true,
    focus: "center",
    isNavigation: true
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await CartService.addProduct({
        productId: product.id,
        quantity
      });
      message.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      message.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      await CartService.addProduct({
        productId: product.id,
        quantity
      });
      message.success("Đã thêm sản phẩm vào giỏ hàng!");
      navigate("/cart");
    } catch (err) {
      console.error("Failed to buy now:", err);
      message.error("Không thể thực hiện mua hàng");
    }
  };

  if (loading) {
    return (
      <div className="main-container mx-auto">
        <div className="text-center py-12">Đang tải...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="main-container mx-auto">
        <div className="text-center py-12 text-gray-500">Không tìm thấy sản phẩm</div>
      </div>
    );
  }
  return (
    <div className="main-container mx-auto">
      <Row className="mt-6">
        <Col span={10}>
          <Splide options={mainOptions} ref={mainRef} aria-labelledby="thumbnail-slider-example">
            {images.map((image, index) => (
              <SplideSlide key={index}>
                <Image
                  styles={{
                    cover: {
                      background: "rgba(0, 0, 0, 0.03)"
                    }
                  }}
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover mb-[12px] rounded"
                />
              </SplideSlide>
            ))}
          </Splide>

          <Splide
            options={thumbsOptions}
            ref={thumbsRef}
            aria-label="The carousel with thumbnails. Selecting a thumbnail will change the main carousel"
          >
            {images.map((image, index) => (
              <SplideSlide key={index}>
                <img src={image} alt={`Product image ${index + 1}`} className="object-cover" />
              </SplideSlide>
            ))}
          </Splide>
        </Col>
        <Col span={14} className="px-28 flex flex-col">
          <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
          <span className="text-3xl font-bold text-[var(--primary-color)] my-2">
            {formatNumberWithDots(product.price)}₫
          </span>
          <div className="border border-solid border-black rounded flex items-center justify-between px-8 py-2 my-4">
            <span>Số lượng:</span>
            <InputNumber
              mode="spinner"
              min={1}
              size="large"
              max={product.quantity}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              formatter={(value) => `${value}/${product.quantity}`}
              parser={(value) => parseInt(value!.replace(`/${product.quantity}`, ""))}
              className="w-full mr-6"
              variant="filled"
              placeholder="Số lượng"
            />
            <span className="teeter block w-auto h-auto text-[var(--primary-color)]">
              {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>
          <div className="flex mx-auto">
            <button className="buy-btn" onClick={handleBuyNow} disabled={product.quantity === 0}>
              <h4 className="text-[21.28px] leading-7 ">MUA NGAY</h4>
              <span className="text-[11px]">(Giao nhanh từ 2 giờ hoặc nhận từ cửa hàng)</span>
            </button>
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              <ShoppingOutlined className="text-[20px]" />
              <span className="text-[var(--primary-color)] text-[11px] leading-3">
                Thêm vào giỏ
              </span>
            </button>
          </div>

          <Divider />

          <div>
            <div className="flex items-center">
              <svg
                className="relative top-[1px] mr-1"
                width="18"
                height="18"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.6074 3.54932H8.01703C6.56482 3.54932 5.83871 3.54932 5.30404 3.95262C4.76937 4.35592 4.56989 5.05409 4.17094 6.45043L3.57126 8.54932H7.6699L8.6074 3.54932ZM3.11719 10.4735C3.11949 10.4902 3.12234 10.5068 3.12576 10.5233C3.17548 10.764 3.33779 10.9624 3.66241 11.3591L3.66241 11.3591L9.40831 18.3819L7.69493 10.5493H3.49983C3.36429 10.5493 3.23506 10.5224 3.11719 10.4735ZM14.5913 18.3819L20.3372 11.3591C20.6619 10.9624 20.8242 10.764 20.8739 10.5233C20.8773 10.5068 20.8802 10.4902 20.8825 10.4735C20.7646 10.5224 20.6354 10.5493 20.4998 10.5493H16.3047L14.5913 18.3819ZM20.4284 8.54932L19.8287 6.45043L19.8287 6.45042C19.4298 5.05409 19.2303 4.35592 18.6956 3.95262C18.1609 3.54932 17.4348 3.54932 15.9826 3.54932H15.3923L16.3298 8.54932H20.4284ZM13.3574 3.54932H10.6423L9.70475 8.54932H14.2949L13.3574 3.54932ZM11.9998 20.8698L9.74222 10.5493H14.2574L11.9998 20.8698Z"
                ></path>
              </svg>
              <h3 className="text-xl">Mô tả sản phẩm</h3>
            </div>
            <ul className="list-disc ml-5 mt-2">
              <li className="py-1">
                Danh mục: <strong>{product.categoryName}</strong>
              </li>
              <li className="py-1">
                Chất liệu: <strong>{product.material}</strong>
              </li>
              {product.description && (
                <li className="py-1">
                  Mô tả: <strong>{product.description}</strong>
                </li>
              )}
              {product.gemstones && product.gemstones.length > 0 && (
                <>
                  <li className="py-1 font-bold mt-3">Đá quý:</li>
                  {product.gemstones.map((gemstone, index) => (
                    <li key={index} className="py-1 ml-5">
                      <strong>{gemstone.name}</strong> - Trọng lượng: {gemstone.weight}g
                      {gemstone.size && `, Kích thước: ${gemstone.size}`}
                      {gemstone.color && `, Màu sắc: ${gemstone.color}`}
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </Col>
      </Row>

      <Divider />

      <Heading text="SẢN PHẨM TƯƠNG TỰ" />

      {similarProducts.length > 0 ? (
        <Row gutter={[16, 16]}>
          {similarProducts.map((item) => (
            <Col span={6} key={item.id}>
              <ProductCard
                productId={item.id}
                productImageUrl={item.imageUrl || "/img/placeholder.png"}
                productName={item.name}
                price={item.price}
                stock={item.quantity}
                onClick={() => navigate(`/products/${item.id}`)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-12 text-gray-500">Không có sản phẩm tương tự</div>
      )}
    </div>
  );
};

export default ProductDetail;
