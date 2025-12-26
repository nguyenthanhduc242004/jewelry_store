<script setup>
import HeartIcon from "@/icons/HeartIcon.vue";
import { formatNumberWithDots } from "@/utils/formatNumberWithDots";

const props = defineProps(["imageUrl", "brandName", "productName", "price"]);
</script>

<template>
  <div class="wrapper">
    <div
      class="image-container"
      :style="{
        background: `url(${props.imageUrl}) no-repeat center`,
      }"
      style="background-size: contain"
    />

    <el-button
      :icon="HeartIcon"
      circle
      style="position: absolute; top: 8px; right: 8px; background-size: cover"
    />

    <div style="padding: 5px">
      <h3 class="brand-name">
        {{ props.brandName }}
      </h3>
      <p class="two-line-ellipsis product-name" style="margin: 5px 0">
        {{ props.productName }}
      </p>
      <span
        style="
          display: block;
          color: #ed8383;
          font-weight: bold;
          font-size: 18px;
        "
        >{{ formatNumberWithDots(props.price) }}₫</span
      >
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  text-align: center;
  background-color: #fff;
  margin-bottom: 15px;
  transition: all 0.4s;
  border-radius: 2px;
  &:hover {
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    .product-name {
      transition: color 0.2s;
      color: #ed8383;
    }

    .brand-name {
      letter-spacing: 2px;
    }
  }
}

.brand-name {
  transition: letter-spacing 0.2s;
}

.product-name {
  transition: color 0.2s;
}

.image-container {
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  transition: transform 0.4s;

  &:hover {
    transform: scale(1.2);
  }
}
</style>
