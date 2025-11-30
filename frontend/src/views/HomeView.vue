<script setup lang="ts">
import CarouselItem from "@/components/CarouselItem.vue";
import BrandItem from "@/components/BrandItem.vue";
import ProductItem from "@/components/ProductItem.vue";
import HeartIcon from "@/components/icon/HeartIcon.vue";
import { Goods, Search, User } from "@element-plus/icons-vue";
import type { TabsPaneContext } from "element-plus";
import { ref } from "vue";

import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";
import FastDeliveryIcon from "@/components/icon/FastDeliveryIcon.vue";
import GemstoneIcon from "@/components/icon/GemstoneIcon.vue";
import ProtectedIcon from "@/components/icon/ProtectedIcon.vue";
import BenefitItem from "@/components/BenefitItem.vue";

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
    productImageUrl: "/src/assets/product-imgs/product1/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 11555000,
  },
  {
    productImageUrl: "/src/assets/product-imgs/product2/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 11949000,
  },
  {
    productImageUrl: "/src/assets/product-imgs/product3/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 12242000,
  },
  {
    productImageUrl: "/src/assets/product-imgs/product4/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 12539000,
  },
  {
    productImageUrl: "/src/assets/product-imgs/product5/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 19957000,
  },
  {
    productImageUrl: "/src/assets/product-imgs/product6/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 17338000,
  },
  {
    productImageUrl: "/src/assets/product-imgs/product7/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 20951000,
  },
  {
    productImageUrl: "/src/assets/product-imgs/product8/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 17557000,
  },
];

const input = ref();
const activeTab = ref();

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>

<template>
  <header
    style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      background-color: #333;
      padding: 0 32px;
      z-index: 1000;
    "
  >
    <div style="display: flex; align-items: center" class="main-container">
      <el-input
        v-model="input"
        placeholder="What are you looking for?"
        style="width: auto; height: 40px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <div style="flex-grow: 1; display: flex">
        <img
          style="width: 80px; height: 60px; margin: auto; object-fit: contain"
          src="@/assets/logo.png"
        />
      </div>
      <div>
        <el-button :icon="User" circle />
        <el-button :icon="HeartIcon" circle />
        <el-badge :value="12" style="margin-left: 10px">
          <el-button :icon="Goods" circle />
        </el-badge>
      </div>
    </div>
  </header>

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

  <el-carousel height="calc(100vh - 60px)" style="margin-top: 60px">
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

  <h1 class="heading">BRANDS</h1>
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

  <h1 class="heading">NEW PRODUCTS</h1>
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
        <ProductItem
          :productImageUrl="item.productImageUrl"
          :brandName="item.brandName"
          :productName="item.productName"
          :price="item.price"
        />
      </SplideSlide>
    </Splide>
  </div>

  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #686863;
      margin: 60px 0;
      width: 100%;
      height: 120px;
      margin-bottom: 1000px;
    "
  >
    <BenefitItem :Icon="FastDeliveryIcon" text="FAST AND FREE DELIVERY" />
    <el-divider direction="vertical" />
    <BenefitItem :Icon="GemstoneIcon" text="GEM AUTHENCITY GUARANTEED" />
    <el-divider direction="vertical" />
    <BenefitItem :Icon="ProtectedIcon" text="GEM LABORATORY CERTIFICATION" />
  </div>
</template>

<style scoped>
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

.heading {
  text-align: center;
  margin-top: 60px;
  font-size: 40px;
  letter-spacing: 4px;
}

@keyframes navItemColorChange {
  from {
    color: #ddd;
  }
  to {
    color: #ffc108;
  }
}
</style>
