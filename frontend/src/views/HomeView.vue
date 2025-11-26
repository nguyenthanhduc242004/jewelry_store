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
  <header style="display: flex; align-items: center">
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
      <el-badge :value="12" style="margin-left: 10px">
        <el-button :icon="Goods" circle />
      </el-badge>
    </div>
  </header>
  <el-divider style="margin: 4px 0" />
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
