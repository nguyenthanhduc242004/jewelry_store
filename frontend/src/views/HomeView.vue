<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ref } from "vue";

const input = ref();
</script>

<template>
  <header>
    <el-input v-model="input" placeholder="What are you looking for?">
      <template #prefix>
        <el-icon class="el-input__icon"><Search /></el-icon>
      </template>
    </el-input>
  </header>
</template>
