<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <Header />
  <div style="margin-top: 60px">
    <RouterView />
  </div>
  <Footer />
</template>
