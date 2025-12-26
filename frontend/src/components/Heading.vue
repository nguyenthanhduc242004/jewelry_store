<script setup lang="ts">
import { RouterLink } from "vue-router";

interface Props {
  heading: string;
  hasViewAllBtn?: boolean;
  url?: string;
}

const props = withDefaults(defineProps<Props>(), {
  heading: "",
  hasViewAllBtn: false,
  url: "",
});
</script>

<template>
  <div class="main-container" style="position: relative">
    <h1 class="heading">{{ props.heading }}</h1>
    <RouterLink v-if="props.hasViewAllBtn" class="view-all-btn" :to="props.url">
      View All
    </RouterLink>
  </div>
</template>

<style scoped>
.heading {
  text-align: center;
  font-size: 40px;
  letter-spacing: 4px;
}

.view-all-btn {
  font-size: 16px;
  position: absolute;
  right: 0;
  top: 22px;
  margin-right: 20px;
  transition: color 0.2s;
  cursor: pointer;
  color: #333;
  font-size: 16px;
  letter-spacing: 2px;

  &:hover {
    color: var(--primary-color);
  }
}
</style>
