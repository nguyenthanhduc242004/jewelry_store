<script setup lang="ts">
import { Goods, Search, User } from "@element-plus/icons-vue";
import { ref } from "vue";
import HeartIcon from "@/components/icon/HeartIcon.vue";
import type { TabsPaneContext } from "element-plus";
import { RouterLink } from "vue-router";
import CarouselItem from "@/components/CarouselItem.vue";

import necklace from "@/assets/carousel-imgs/necklace.jpg";
import necklace1 from "@/assets/carousel-imgs/necklace-1.jpg";
import ring from "@/assets/carousel-imgs/ring.jpg";
import ring1 from "@/assets/carousel-imgs/ring-1.jpg";
import earrings from "@/assets/carousel-imgs/earrings.jpg";
import earrings1 from "@/assets/carousel-imgs/earrings-1.jpg";
import bracelet from "@/assets/carousel-imgs/bracelet.jpg";
import bracelet1 from "@/assets/carousel-imgs/bracelet-1.jpg";

const carouselPropsList = [
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
      background: linear-gradient(to right, #82009f 0%, #5d34af 100%);
      padding: 0 32px;
      z-index: 1000;
    "
  >
    <div
      style="
        display: flex;
        align-items: center;
        max-width: 1280px;
        margin: 0 auto;
      "
    >
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

  <!-- <el-divider style="margin: 4px 0" /> -->

  <el-carousel height="calc(100vh - 60px)" style="margin-top: 60px">
    <el-carousel-item v-for="item in carouselPropsList" :key="item.heading">
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

  <nav>
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
  </nav>
</template>

<style scoped>
.nav-item {
  display: block;
  height: 40px;
  line-height: 40px;
  text-decoration: none;
  color: #555;
  padding: 0 20px;
  font-size: 18px;

  &:hover {
    animation: navItemColorChange 0.2s forwards;
  }
}

@keyframes navItemColorChange {
  from {
    color: #555;
  }
  to {
    color: #ffc108;
  }
}
</style>
