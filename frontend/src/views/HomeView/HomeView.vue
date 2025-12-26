<script setup lang="ts">
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import type { TabsPaneContext } from "element-plus";

import ProductCard from "@/components/ProductCard.vue";
import BenefitItem from "./components/BenefitItem.vue";
import BlogItem from "./components/BlogItem.vue";
import BrandItem from "./components/BrandItem.vue";
import CarouselItem from "./components/CarouselItem.vue";

import FastDeliveryIcon from "./icons/FastDeliveryIcon.vue";
import GemstoneIcon from "./icons/GemstoneIcon.vue";
import ProtectedIcon from "./icons/ProtectedIcon.vue";

import Heading from "@/components/Heading.vue";
import { ref } from "vue";

const carouselItemPropsList = [
  {
    leftImageUrl: "/src/assets/carousel-imgs/necklace.jpg",
    heading: "NECKLACES",
    subheading: "GRACE REFINED",
    rightImageUrl: "/src/assets/carousel-imgs/necklace-1.jpg",
    message:
      "Elevate every look with our exquisite necklaces. From pendants to chokers, these designs add sophistication to any style.",
    btnText: "SHOP NECLACES",
  },
  {
    leftImageUrl: "/src/assets/carousel-imgs/ring.jpg",
    heading: "RINGS",
    subheading: "A CIRCLE OF PERFECTION",
    rightImageUrl: "/src/assets/carousel-imgs/ring-1.jpg",
    message: "Celebrate every milestone with a ring that tells your story.",
    btnText: "SHOP RINGS",
  },
  {
    leftImageUrl: "/src/assets/carousel-imgs/earrings.jpg",
    heading: "EARRINGS",
    subheading: "ELEGANCE IN EVERY DETAIL",
    rightImageUrl: "/src/assets/carousel-imgs/earrings-1.jpg",
    message:
      "From everyday essentials to show-stopping chandeliers, our earrings are designed to captivate and complement every moment.",
    btnText: "SHOP EARRINGS",
  },
  {
    leftImageUrl: "/src/assets/carousel-imgs/bracelet.jpg",
    heading: "BRACELETS",
    subheading: "STYLE ON YOUR SLEEVE",
    rightImageUrl: "/src/assets/carousel-imgs/bracelet-1.jpg",
    message:
      "Add the perfect finishing touch with our bracelets. From classic bangles to modern cuffs, each piece is a work of art.",
    btnText: "SHOP BRACELETS",
  },
];

const brandItemPropsList = [
  {
    brandImageUrl: "/src/assets/brand_logos/brand1.jpg",
    brandName: "SILVORA",
    btnUrl: "",
  },
  {
    brandImageUrl: "/src/assets/brand_logos/brand2.jpg",
    brandName: "LUMERA",
    btnUrl: "",
  },
  {
    brandImageUrl: "/src/assets/brand_logos/brand3.jpg",
    brandName: "NILA",
    btnUrl: "",
  },
  {
    brandImageUrl: "/src/assets/brand_logos/brand4.jpg",
    brandName: "MUSE",
    btnUrl: "",
  },
  {
    brandImageUrl: "/src/assets/brand_logos/brand5.jpg",
    brandName: "INGOUDE",
    btnUrl: "",
  },
  {
    brandImageUrl: "/src/assets/brand_logos/brand6.jpg",
    brandName: "VERRA",
    btnUrl: "",
  },
];

const newProductsPropsList = [
  {
    imageUrl: "/src/assets/product-imgs/product1/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 11555000,
  },
  {
    imageUrl: "/src/assets/product-imgs/product2/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 11949000,
  },
  {
    imageUrl: "/src/assets/product-imgs/product3/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 12242000,
  },
  {
    imageUrl: "/src/assets/product-imgs/product4/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 12539000,
  },
  {
    imageUrl: "/src/assets/product-imgs/product5/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 19957000,
  },
  {
    imageUrl: "/src/assets/product-imgs/product6/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 17338000,
  },
  {
    imageUrl: "/src/assets/product-imgs/product7/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 20951000,
  },
  {
    imageUrl: "/src/assets/product-imgs/product8/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 17557000,
  },
];

const blogItem = [
  {
    id: 1,
    link: "/blog/1",
    imageUrl: "/src/assets/blog-imgs/blog-1.jpg",
    date: "2024-11-15",
    title: "The Ultimate Guide to Choosing Your Perfect Engagement Ring",
    description:
      "Selecting an engagement ring is one of the most significant purchases you'll ever make, symbolizing your commitment and love for a lifetime. In this comprehensive guide, we walk you through everything you need to know about choosing the perfect ring that captures your partner's unique style and personality. From understanding the four Cs of diamonds—cut, clarity, color, and carat—to exploring alternative gemstones like sapphires, emeralds, and morganite, we cover all the essential factors that influence your decision. Learn about different ring settings, from classic solitaires to vintage-inspired halos, and discover how metal choices like platinum, white gold, and rose gold can dramatically affect the overall aesthetic. We'll also share insider tips on determining ring size discreetly, setting a realistic budget, and working with jewelers to create custom designs. Whether you're planning a surprise proposal or shopping together, this guide ensures you'll find a ring that perfectly represents your love story.",
  },
  {
    id: 2,
    link: "/blog/2",
    imageUrl: "/src/assets/blog-imgs/blog-2.jpg",
    date: "2024-09-22",
    title:
      "Jewelry Care 101: Keeping Your Precious Pieces Sparkling for Generations",
    description:
      "Your jewelry collection represents cherished memories, significant investments, and timeless beauty that deserves proper care and maintenance. In this essential guide, we reveal professional secrets for preserving the brilliance and longevity of your most treasured pieces. Discover the best cleaning methods for different types of jewelry, from delicate pearls that require gentle handling to durable diamonds that can withstand more rigorous cleaning. Learn which household products are safe to use and which can cause irreversible damage to your precious metals and gemstones. We'll explain the importance of regular professional inspections, proper storage techniques to prevent scratching and tarnishing, and when to remove your jewelry to avoid unnecessary wear. Find out how environmental factors like humidity, chemicals in lotions and perfumes, and even chlorine in swimming pools can affect your pieces. We also cover insurance considerations, documentation best practices, and how to identify when your jewelry needs professional repair or restoration to maintain its value and beauty for future generations.",
  },
  {
    id: 3,
    link: "/blog/3",
    imageUrl: "/src/assets/blog-imgs/blog-3.jpg",
    date: "2024-07-08",
    title: "Trending Now: 2024's Hottest Jewelry Styles and How to Wear Them",
    description:
      "The world of fine jewelry is experiencing an exciting renaissance, blending timeless elegance with contemporary innovation and bold self-expression. In this trend report, we explore the most coveted jewelry styles dominating 2024, from chunky chain necklaces and stackable rings to asymmetrical earrings and personalized nameplate pieces. Discover how sustainable and ethically sourced jewelry has moved from niche to mainstream, with lab-grown diamonds and recycled metals becoming the choice of conscious consumers. We'll show you how to master the art of layering necklaces of varying lengths, mixing metals for an effortlessly chic look, and incorporating vintage and heirloom pieces into modern ensembles. Learn about the resurgence of colored gemstones, particularly vibrant emeralds and sapphires, and how celebrities and influencers are styling statement pieces for both everyday wear and special occasions. Whether you prefer minimalist designs or maximalist glamour, this guide provides styling inspiration and practical tips for incorporating these trends into your personal jewelry wardrobe while maintaining your unique aesthetic and ensuring versatility across seasons.",
  },
];

const activeTab = ref();

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>

<template>
  <!-- <nav style="margin-top: 60px; background-color: #333">
    <ul style="list-style: none; display: flex; justify-content: center">
      <li>
        <RouterLink class="nav-item" to="/brands">Brands</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-item" to="/earrings">Earrings</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-item" to="/necklaces">Necklaces</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-item" to="/rings">Rings</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-item" to="/bracelets">Bracelets</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-item" to="/gifts">Gifts</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-item" to="/personalized">
          Personalized
        </RouterLink>
      </li>
    </ul>
  </nav> -->

  <el-carousel height="calc(100vh - 60px)">
    <el-carousel-item v-for="item in carouselItemPropsList" :key="item.heading">
      <CarouselItem
        :left-image-url="item.leftImageUrl"
        :heading="item.heading"
        :subheading="item.subheading"
        :right-image-url="item.rightImageUrl"
        :message="item.message"
        :btn-text="item.btnText"
      />
    </el-carousel-item>
  </el-carousel>

  <Heading class="heading" heading="BRANDS" />
  <div class="main-container" style="padding: 5px 0">
    <el-row :gutter="10" style="margin-left: 5px; margin-right: 5px">
      <el-col
        :span="8"
        v-for="item in brandItemPropsList"
        :key="item.brandName"
      >
        <BrandItem
          :brand-image-url="item.brandImageUrl"
          :brand-name="item.brandName"
          :btn-url="item.btnUrl"
        />
      </el-col>
    </el-row>
  </div>

  <Heading
    class="heading"
    heading="NEW PRODUCTS"
    hasViewAllBtn
    url="/products"
  />
  <div class="main-container" style="margin-top: 15px">
    <Splide
      :options="{
        rewind: true,
        perPage: 4,
        perMove: 1,
        gap: '1rem',
        breakpoints: {
          1000: {
            perPage: 1,
          },
        },
        autoplay: true,
        interval: 3000,
      }"
      aria-label="Splide"
    >
      <SplideSlide v-for="item in newProductsPropsList">
        <ProductCard
          :imageUrl="item.imageUrl"
          :brandName="item.brandName"
          :productName="item.productName"
          :price="item.price"
        />
      </SplideSlide>
    </Splide>
  </div>

  <!-- BENEFITS BARS -->
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #686863;
      margin: 48px 0 60px;
      width: 100%;
      height: 120px;
    "
  >
    <BenefitItem :Icon="FastDeliveryIcon" text="FAST AND FREE DELIVERY" />
    <el-divider direction="vertical" />
    <BenefitItem :Icon="GemstoneIcon" text="GEM AUTHENCITY GUARANTEED" />
    <el-divider direction="vertical" />
    <BenefitItem :Icon="ProtectedIcon" text="GEM LABORATORY CERTIFICATION" />
  </div>

  <Heading
    class="heading"
    heading="BEST SELLERS"
    hasViewAllBtn
    url="/products"
  />
  <div class="main-container" style="padding: 5px 0; margin-top: 15px">
    <el-row :gutter="10" style="margin-left: 5px; margin-right: 5px">
      <el-col
        :span="6"
        v-for="item in newProductsPropsList"
        :key="item.brandName"
      >
        <ProductCard
          :imageUrl="item.imageUrl"
          :brandName="item.brandName"
          :productName="item.productName"
          :price="item.price"
        />
      </el-col>
    </el-row>
  </div>

  <!-- NEW BLOG -->
  <Heading class="heading" heading="NEW BLOGS" hasViewAllBtn url="/blog" />
  <div
    class="main-container"
    style="padding: 5px 0; margin-top: 15px; margin-bottom: 80px"
  >
    <el-row :gutter="28" style="margin-left: 5px; margin-right: 5px">
      <el-col :span="8" v-for="item in blogItem" :key="item.id">
        <BlogItem
          :imageUrl="item.imageUrl"
          :date="item.date"
          :title="item.title"
          :description="item.description"
          :link="item.link"
        />
      </el-col>
    </el-row>
  </div>

  <!-- ABOUT US -->
  <div class="main-container" style="position: relative; margin-bottom: 60px">
    <img
      src="/about-us.jpg"
      alt="about-us"
      style="width: 100%; height: 480px; object-fit: cover"
    />
    <div
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <h1
        class="heading"
        style="
          text-shadow: 2px 2px 4px #333;
          color: #fff;
          font-size: 60px;
          margin-top: 0;
        "
      >
        ABOUT US
      </h1>
      <button class="read-more-btn">READ MORE</button>
    </div>
  </div>
</template>

<style scoped>
.heading {
  margin-top: 60px;
}

.nav-item {
  display: block;
  height: 40px;
  line-height: 40px;
  text-decoration: none;
  color: #ddd;
  padding: 0 20px;
  font-size: 18px;

  &:hover {
    animation: navItemColorChange 0.6s forwards;
  }
}

.el-divider--vertical {
  height: 52px;
}

@keyframes navItemColorChange {
  from {
    color: #ddd;
  }
  to {
    color: #ffc108;
  }
}

.read-more-btn {
  font-size: 16px;
  letter-spacing: 1px;
  position: relative;
  background-color: #fff;
  color: #252a2b;
  font-family: "Josefin Sans", sans-serif;
  padding: 16px 40px;
  border: 1px solid #fff;
  overflow: hidden;
  z-index: 1;
  cursor: pointer;

  transition: color 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86),
    background-color 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);

  /* Create the sliding background */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: -1;
    transform: translateX(-100%);
    transition: transform 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  }

  &:hover {
    color: #fff;
    border-color: #fff;
    background-color: transparent;
  }

  &:hover::before {
    transform: translateX(0);
  }
}
</style>

<style lang="css">
.splide__pagination {
  position: relative;
  top: 0px;
}
</style>
