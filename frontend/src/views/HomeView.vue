<script setup lang="ts">
import CarouselItem from "@/components/CarouselItem.vue";
// @ts-ignore: no type declaration for .vue modules
import BrandItem from "@/components/BrandItem.vue";
import HeartIcon from "@/components/icon/HeartIcon.vue";
import { Goods, Search, User } from "@element-plus/icons-vue";
import type { TabsPaneContext } from "element-plus";
import { ref } from "vue";

import bracelet1 from "@/assets/carousel-imgs/bracelet-1.jpg";
import bracelet from "@/assets/carousel-imgs/bracelet.jpg";
import earrings1 from "@/assets/carousel-imgs/earrings-1.jpg";
import earrings from "@/assets/carousel-imgs/earrings.jpg";
import necklace1 from "@/assets/carousel-imgs/necklace-1.jpg";
import necklace from "@/assets/carousel-imgs/necklace.jpg";
import ring1 from "@/assets/carousel-imgs/ring-1.jpg";
import ring from "@/assets/carousel-imgs/ring.jpg";

import brand1 from "@/assets/brand_logos/brand1.jpg";
import brand2 from "@/assets/brand_logos/brand2.jpg";
import brand3 from "@/assets/brand_logos/brand3.jpg";
import brand4 from "@/assets/brand_logos/brand4.jpg";
import brand5 from "@/assets/brand_logos/brand5.jpg";
import brand6 from "@/assets/brand_logos/brand6.jpg";

const carouselItemPropsList = [
  {
    leftImageUrl: necklace,
    heading: "NECKLACES",
    subheading: "GRACE REFINED",
    rightImageUrl: necklace1,
    message:
      "Elevate every look with our exquisite necklaces. From pendants to chokers, these designs add sophistication to any style.",
    btnText: "SHOP NECLACES",
  },
  {
    leftImageUrl: ring,
    heading: "RINGS",
    subheading: "A CIRCLE OF PERFECTION",
    rightImageUrl: ring1,
    message: "Celebrate every milestone with a ring that tells your story.",
    btnText: "SHOP RINGS",
  },
  {
    leftImageUrl: earrings,
    heading: "EARRINGS",
    subheading: "ELEGANCE IN EVERY DETAIL",
    rightImageUrl: earrings1,
    message:
      "From everyday essentials to show-stopping chandeliers, our earrings are designed to captivate and complement every moment.",
    btnText: "SHOP EARRINGS",
  },
  {
    leftImageUrl: bracelet,
    heading: "BRACELETS",
    subheading: "STYLE ON YOUR SLEEVE",
    rightImageUrl: bracelet1,
    message:
      "Add the perfect finishing touch with our bracelets. From classic bangles to modern cuffs, each piece is a work of art.",
    btnText: "SHOP BRACELETS",
  },
];

const brandItemPropsList = [
  {
    brandImageUrl: brand1,
    brandName: "SILVORA",
    btnUrl: "",
  },
  {
    brandImageUrl: brand2,
    brandName: "LUMERA",
    btnUrl: "",
  },
  {
    brandImageUrl: brand3,
    brandName: "NILA",
    btnUrl: "",
  },
  {
    brandImageUrl: brand4,
    brandName: "MUSE",
    btnUrl: "",
  },
  {
    brandImageUrl: brand5,
    brandName: "INGOUDE",
    btnUrl: "",
  },
  {
    brandImageUrl: brand6,
    brandName: "VERRA",
    btnUrl: "",
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

  <h1
    style="
      text-align: center;
      margin-top: 40px;
      font-size: 40px;
      letter-spacing: 4px;
    "
  >
    BRANDS
  </h1>

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

@keyframes navItemColorChange {
  from {
    color: #ddd;
  }
  to {
    color: #ffc108;
  }
}
</style>
