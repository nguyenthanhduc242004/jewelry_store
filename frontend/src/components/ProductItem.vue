<script setup>
import HeartIcon from "@/components/icon/HeartIcon.vue";
import { formatNumberWithDots } from "@/helpers/formatNumberWithDots";

const props = defineProps([
  "productImageUrl",
  "brandName",
  "productName",
  "price",
]);
</script>

<template>
  <div class="wrapper">
    <div
      :style="{
        background: `url(${props.productImageUrl}) no-repeat center`,
      }"
      style="width: 100%; padding-bottom: 100%; background-size: contain"
    >
      <el-button
        :icon="HeartIcon"
        circle
        style="position: absolute; top: 8px; right: 8px; background-size: cover"
      />
    </div>

    <div style="padding: 5px">
      <h3
        style="
          color: #1d2a3d;
          font-size: 16px;
          margin: 5px;
          letter-spacing: 2px;
        "
      >
        {{ props.brandName }}
      </h3>
      <p class="product-name">{{ props.productName }}</p>
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
  text-align: center;
  background-color: #fff;
  margin-bottom: 15px;
  transition: all 0.4s;
  border-radius: 2px;
  &:hover {
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
}

.product-name {
  --line-height: 18px;
  margin: 5px 0;
  font-size: 16px;
  height: calc(var(--line-height) * 2);
  line-height: var(--line-height);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
