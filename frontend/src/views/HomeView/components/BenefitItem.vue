<script setup>
const props = defineProps(["Icon", "text"]);
</script>

<template>
  <div
    style="
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 20px;
    "
  >
    <Icon style="height: 40px; display: block; margin: 12px 0" />
    <p>{{ props.text }}</p>
  </div>
</template>
