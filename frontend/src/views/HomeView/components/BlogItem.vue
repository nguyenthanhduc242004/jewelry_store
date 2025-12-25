<script setup>
import { RouterLink } from "vue-router";

const props = defineProps(["imageUrl", "date", "title", "description", "link"]);
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <router-link :to="props.link">
      <img
        style="width: 100%; height: 100%; object-fit: cover; display: block"
        :src="props.imageUrl"
      />
    </router-link>
    <span style="font-size: 14px; padding: 12px 4px; color: #666">
      {{ props.date }}
    </span>
    <router-link class="blog-heading two-line-ellipsis" :to="props.link">
      {{ props.title }}
    </router-link>
    <el-divider style="margin: 20px 0" />
    <p class="three-line-ellipsis">{{ props.description }}</p>
  </div>
</template>

<style scoped>
.blog-heading {
  padding: 0 20px;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  transition: color 0.2s;

  &:hover {
    color: var(--primary-color);
  }
}
</style>
