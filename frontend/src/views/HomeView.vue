<script setup lang="ts">
import { Goods, Search, User } from "@element-plus/icons-vue";
import { ref } from "vue";
import HeartIcon from "@/components/icon/HeartIcon.vue";
import type { TabsPaneContext } from "element-plus";
import { RouterLink } from "vue-router";

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

  <div
    class="carousel"
    style="display: flex; height: calc(100vh - 60px); margin-top: 60px"
  >
    <div style="width: 50%; position: relative">
      <img
        style="width: 100%; height: 100%; object-fit: cover"
        src="@/assets/carousel-imgs/earrings.jpg"
      />
      <div
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        <h2 class="carousel-heading">EARRINGS</h2>
        <h4 class="carousel-subheading">ELEGANCE IN EVERY DETAIL</h4>
      </div>
    </div>
    <div
      style="width: 50%; background-image: linear-gradient(0, #c21500, #ffc500)"
    >
      <div class="carousel-right">
        <div
          style="
            position: relative;
            width: 100%;
            height: 60%;
            margin-bottom: 15px;
          "
        >
          <div class="carousel-image-border" />
          <img
            class="carousel-image"
            src="@/assets/carousel-imgs/earrings-1.jpg"
          />
        </div>
        <p class="carousel-paragraph">
          Elevate every look with our exquisite necklaces. From pendants to
          chokers, these designs add sophistication to any style.
        </p>
        <button class="carousel-btn">SHOP NECKLACES</button>
      </div>
    </div>
  </div>

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
.carousel-right {
  width: 40%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.carousel-heading {
  font-family: "Josefin Sans";
  font-size: 80px;
  font-weight: 400;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0px;
  line-height: 70px;
  text-align: center;
  white-space: normal;
  padding: 0px 35px;
  display: block;
}

.carousel-subheading {
  font-family: "Josefin Sans";
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 3.48958px;
  line-height: 35px;
  text-align: center;
  white-space: normal;
  display: block;
}

.carousel-image-border {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-50% - 8px), calc(-50% - 8px));

  border-style: solid;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.65);
  border-radius: 300px 300px 0px 0px;
  width: 100%;
  height: 100%;
  display: block;
}

.carousel-image {
  border-radius: 300px 300px 0px 0px;
  transform-origin: 50% 50%;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.carousel-paragraph {
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  color: rgb(255, 255, 255);
  text-transform: none;
  text-decoration: none;
  letter-spacing: 0.744444px;
  line-height: 19px;
  text-align: center;
  white-space: normal;
  display: block;

  margin-bottom: 40px;
}

.carousel-btn {
  font-family: "Josefin Sans";
  font-size: 12px;
  font-weight: 500;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.744444px;
  line-height: 45px;
  text-align: center;
  white-space: normal;
  padding: 0px 37px;
  border-style: solid;
  border-width: 1px 1px 0px;
  border-color: rgba(255, 255, 255, 0.36);
  border-radius: 50%;
  display: block;
  transform: translate3d(0px, 0px, 0px);
  background: rgba(255, 255, 255, 0);
}

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
