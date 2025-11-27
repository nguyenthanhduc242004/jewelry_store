<script setup>
import { Right } from "@element-plus/icons-vue";

const props = defineProps(["brandImageUrl", "brandName", "btnUrl"]);
</script>

<template>
  <div
    class="wrapper"
    style="
      position: relative;
      margin-top: 10px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      overflow: hidden;
      cursor: pointer;
    "
  >
    <div
      class="image"
      :style="{
        background: `url(${props.brandImageUrl}) no-repeat center`,
      }"
      style="background-size: cover"
    />

    <div
      style="
        position: absolute;
        bottom: 12px;
        left: 12px;
        padding: 10px 20px;
        background-color: #fff;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      "
    >
      <h4 style="margin-bottom: 5px; font-size: 15px">{{ props.brandName }}</h4>
      <div style="display: flex; align-items: center">
        <span class="buy-now">Buy now</span>
        <el-icon
          class="icon"
          style="margin-left: 3px; position: relative; top: -1px"
          ><Right
        /></el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  &:hover {
    .buy-now,
    .icon {
      color: #d1913c;
    }

    .icon {
      transform: translateX(2px);
    }
  }
}

.icon,
.buy-now {
  transition: all 0.4s;
}

.image {
  padding-bottom: 100%;
  transition: transform 2s;

  &:hover {
    transform: scale(1.2);
  }
}
</style>
