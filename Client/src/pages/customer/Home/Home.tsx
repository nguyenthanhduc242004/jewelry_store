import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import {
  Carousel,
  Col,
  ConfigProvider,
  Input,
  InputNumber,
  Pagination,
  Row,
  Slider,
  Tree,
  type SliderSingleProps,
  type TreeDataNode,
  type TreeProps
} from "antd";
import { useState, useEffect, useRef } from "react";
import FastDeliveryIcon from "../../../assets/benefit-icons/FastDeliveryIcon.svg";
import GemstoneIcon from "../../../assets/benefit-icons/GemstoneIcon.svg";
import ProtectedIcon from "../../../assets/benefit-icons/ProtectedIcon.svg";
import formatNumberWithDots from "../../../utils/formatNumberWithDots";
import parseNumberFromDots from "../../../utils/parseNumberFromDots";
import Heading from "../components/Heading";
import BenefitItem from "./components/BenefitItem";
import CarouselItem from "./components/CarouselItem";
import ProductCard from "./components/ProductCard";
import { useNavigate } from "react-router-dom";
import { ProductService, DashboardService, type ProductPreview } from "../../../services";

const { Search } = Input;

const carouselItemList = [
  {
    leftImageUrl: "/src/assets/carousel-imgs/necklace.jpg",
    heading: "NECKLACES",
    subheading: "GRACE REFINED",
    rightImageUrl: "/src/assets/carousel-imgs/necklace-1.jpg",
    message:
      "Elevate every look with our exquisite necklaces. From pendants to chokers, these designs add sophistication to any style.",
    btnText: "SHOP NECLACES",
    filterKey: "category-necklaces"
  },
  {
    leftImageUrl: "/src/assets/carousel-imgs/ring.jpg",
    heading: "RINGS",
    subheading: "A CIRCLE OF PERFECTION",
    rightImageUrl: "/src/assets/carousel-imgs/ring-1.jpg",
    message: "Celebrate every milestone with a ring that tells your story.",
    btnText: "SHOP RINGS",
    filterKey: "category-rings"
  },
  {
    leftImageUrl: "/src/assets/carousel-imgs/earrings.jpg",
    heading: "EARRINGS",
    subheading: "ELEGANCE IN EVERY DETAIL",
    rightImageUrl: "/src/assets/carousel-imgs/earrings-1.jpg",
    message:
      "From everyday essentials to show-stopping chandeliers, our earrings are designed to captivate and complement every moment.",
    btnText: "SHOP EARRINGS",
    filterKey: "category-earrings"
  },
  {
    leftImageUrl: "/src/assets/carousel-imgs/bracelet.jpg",
    heading: "BRACELETS",
    subheading: "STYLE ON YOUR SLEEVE",
    rightImageUrl: "/src/assets/carousel-imgs/bracelet-1.jpg",
    message:
      "Add the perfect finishing touch with our bracelets. From classic bangles to modern cuffs, each piece is a work of art.",
    btnText: "SHOP BRACELETS",
    filterKey: "category-bracelets"
  }
];

// Products will be fetched from API

const treeData: TreeDataNode[] = [
  {
    title: "Loại trang sức",
    key: "category",
    children: [
      {
        title: "Dây chuyền",
        key: "category-necklaces"
      },
      {
        title: "Nhẫn",
        key: "category-rings"
      },
      {
        title: "Bông tai",
        key: "category-earrings"
      },
      {
        title: "Vòng tay",
        key: "category-bracelets"
      }
    ]
  }
];

const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (value) =>
  `${formatNumberWithDots(value!)}₫`;

export default function Home() {
  const navigate = useNavigate();
  const productsRef = useRef<HTMLDivElement>(null);
  const [priceFilterRange, setPriceFilterRange] = useState([0, 20000000]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(16);

  // Product data
  const [allProducts, setAllProducts] = useState<ProductPreview[]>([]);
  const [popularProducts, setPopularProducts] = useState<ProductPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(20000000);

  // Fetch all products
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const products = await ProductService.fetchProductPreview(0, 200, {
          signal: controller.signal
        });
        console.log("Loaded products:", products);

        // Debug: show earrings product specifically
        const earringsProduct = products.find(
          (p) => p.id === 10 || p.name.toLowerCase().includes("earring")
        );
        if (earringsProduct) {
          console.log("Earrings product found:", earringsProduct);
          console.log("categoryName length:", earringsProduct.categoryName.length);
          console.log(
            "categoryName charCodes:",
            Array.from(earringsProduct.categoryName).map((c) => c.charCodeAt(0))
          );
        }

        setAllProducts(products);

        // Calculate max price
        const max = products.reduce((max, p) => Math.max(max, p.price), 20000000);
        setMaxPrice(max);
        setPriceFilterRange([0, max]);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load products:", err);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  // Fetch popular products (top 6 selling)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        // Try to get top products from dashboard
        await DashboardService.fetchTopProducts({ signal: controller.signal });

        // For now, use the first 6 products from allProducts as popular
        // TODO: Match topProducts data with actual product IDs when backend provides product IDs
        const popular = allProducts.slice(0, 6);
        setPopularProducts(popular);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load popular products:", err);
          // Fallback to first 6 products
          setPopularProducts(allProducts.slice(0, 6));
        }
      }
    })();
    return () => controller.abort();
  }, [allProducts]);

  const handleScrollToProducts = (filterKey?: string) => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

      // Apply filter if provided
      if (filterKey) {
        setTimeout(() => {
          setCheckedKeys([filterKey]);
        }, 500);
      }
    }
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (keys, info) => {
    console.log("onCheck", keys, info);
    setCheckedKeys(keys as React.Key[]);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Filter products based on search, price range, and checked categories/gemstones
  const filteredProducts = allProducts.filter((product) => {
    // Search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Price filter
    if (product.price < priceFilterRange[0] || product.price > priceFilterRange[1]) {
      return false;
    }

    // Category filter
    if (checkedKeys.length > 0) {
      const categoryMatch = checkedKeys.some((key) => {
        const keyStr = key.toString();
        if (keyStr.includes("category-")) {
          const category = keyStr.replace("category-", "");
          const cleanCategoryName = product.categoryName.trim().toLowerCase().replace(/^"|"$/g, ""); // Remove leading/trailing quotes
          const matches = cleanCategoryName === category.toLowerCase();
          console.log(
            `Comparing product category "${product.categoryName}" (cleaned: "${cleanCategoryName}") with filter "${category}": ${matches}`
          );
          return matches;
        }
        return false;
      });

      if (!categoryMatch && checkedKeys.some((k) => k.toString().startsWith("category-"))) {
        return false;
      }
    }

    return true;
  });

  // Paginate filtered products
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Carousel: {
              arrowOffset: 20,
              arrowSize: 32,
              dotWidth: 64,
              dotActiveWidth: 64,
              dotOffset: 12
            }
          }
        }}
      >
        <Carousel
          autoplay={{ dotDuration: true }}
          autoplaySpeed={5000}
          effect="fade"
          arrows
          infinite
          pauseOnHover={false}
          pauseOnDotsHover
        >
          {carouselItemList.map((item, index) => (
            <CarouselItem
              key={index}
              leftImageUrl={item.leftImageUrl}
              heading={item.heading}
              subheading={item.subheading}
              rightImageUrl={item.rightImageUrl}
              message={item.message}
              btnText={item.btnText}
              onButtonClick={() => handleScrollToProducts(item.filterKey)}
            />
          ))}
        </Carousel>
      </ConfigProvider>
      <div style={{ backgroundColor: "#faf2e7" }}>
        {/* POPULAR PRODUCTS */}
        <Heading text="POPULAR PRODUCTS" />
        <div className="mx-8">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <Splide
              options={{
                rewind: true,
                perPage: 4,
                perMove: 1,
                gap: "1rem",
                breakpoints: {
                  1000: {
                    perPage: 1
                  }
                },
                autoplay: true,
                interval: 3000
              }}
              aria-label="Splide"
            >
              {popularProducts.map((item, index) => (
                <SplideSlide key={index}>
                  <ProductCard
                    productId={item.id}
                    productImageUrl={item.imageUrl || "/img/placeholder.png"}
                    productName={item.name}
                    price={item.price}
                    stock={item.quantity}
                    onClick={() => navigate(`/products/${item.id}`)}
                  />
                </SplideSlide>
              ))}
            </Splide>
          )}
        </div>

        {/* BENEFITS BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#686863",
            margin: "60px 0",
            width: "100%",
            height: "120px"
          }}
        >
          <BenefitItem src={FastDeliveryIcon} text="Fast and Free Delivery" />
          <BenefitItem src={GemstoneIcon} text="Gem Authencity Guaranteed" />
          <BenefitItem src={ProtectedIcon} text="Gem Laboratory Certification" />
        </div>

        {/* ALL PRODUCTS */}
        <div ref={productsRef}>
          <Heading text="ALL PRODUCTS" />
        </div>
        <div className="mx-8">
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <Search
                placeholder="Search Product Here"
                allowClear
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                onSearch={() => setCurrentPage(1)}
                style={{ width: "100%" }}
                size="large"
              />
              <div className="my-6">
                <div className="flex items-center ">
                  <InputNumber
                    size="large"
                    prefix="₫"
                    style={{ width: "100%" }}
                    value={priceFilterRange[0]}
                    onChange={(value) =>
                      setPriceFilterRange([value as number, priceFilterRange[1]])
                    }
                    formatter={(value) => `${formatNumberWithDots(value!)}`}
                    parser={(value) => parseNumberFromDots(value!)}
                    min={0}
                    max={priceFilterRange[1]}
                  />
                  <span className="mx-4"> - </span>
                  <InputNumber
                    size="large"
                    prefix="₫"
                    style={{ width: "100%" }}
                    value={priceFilterRange[1]}
                    onChange={(value) => {
                      setPriceFilterRange([priceFilterRange[0], value as number]);
                      setCurrentPage(1);
                    }}
                    formatter={(value) => `${formatNumberWithDots(value!)}`}
                    parser={(value) => parseNumberFromDots(value!)}
                    min={priceFilterRange[0]}
                    max={maxPrice}
                  />
                </div>
                <Slider
                  className="mx-4"
                  range
                  defaultValue={[20, 50]}
                  min={0}
                  max={maxPrice}
                  step={100000}
                  tooltip={{ formatter }}
                  value={priceFilterRange}
                  onChange={(value) => {
                    setPriceFilterRange(value as [number, number]);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Tree
                checkable
                defaultExpandedKeys={["category"]}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                onCheck={onCheck}
                treeData={treeData}
              />
            </Col>
            <Col span={18} className="flex flex-col">
              {loading ? (
                <div className="text-center py-12">Loading products...</div>
              ) : paginatedProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No products found matching your filters.
                </div>
              ) : (
                <>
                  <Row gutter={[16, 16]}>
                    {paginatedProducts.map((item) => (
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

                  <Pagination
                    size="default"
                    className="mx-auto my-6"
                    showSizeChanger={false}
                    current={currentPage}
                    total={filteredProducts.length}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                  />
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
