<script setup lang="ts">
import { Goods, Search, User } from "@element-plus/icons-vue";
import { ref } from "vue";
import HeartIcon from "@/components/icon/HeartIcon.vue";
const input = ref();
</script>

<template>
  <header style="display: flex; align-items: center; padding: 0 20px">
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
        style="width: 120px; height: 90px; margin: auto; object-fit: contain"
        src="@/assets/logo.png"
      />
    </div>
    <div>
      <el-button :icon="User" circle />
      <el-button :icon="HeartIcon" circle />
      <el-button :icon="Goods" circle />
    </div>
  </header>
</template>
