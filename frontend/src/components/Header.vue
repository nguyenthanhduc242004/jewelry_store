<script setup lang="ts">
import HeartIcon from "@/icons/HeartIcon.vue";
import { Goods, Search, User } from "@element-plus/icons-vue";
import { ref } from "vue";

const input = ref("");
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
</template>
