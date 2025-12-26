<script setup lang="ts">
import Heading from "@/components/Heading.vue";
import ProductCard from "@/components/ProductCard.vue";
import { formatNumberWithDots } from "@/utils/formatNumberWithDots";
import { ArrowRight, Search } from "@element-plus/icons-vue";
import { ref, watch } from "vue";

const products = [
  {
    id: 1,
    imageUrl: "/src/assets/product-imgs/product1/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 11555000,
  },
  {
    id: 2,
    imageUrl: "/src/assets/product-imgs/product2/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 11949000,
  },
  {
    id: 3,
    imageUrl: "/src/assets/product-imgs/product3/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 12242000,
  },
  {
    id: 4,
    imageUrl: "/src/assets/product-imgs/product4/1.png",
    brandName: "SILVORA",
    productName: "Nhẫn cầu hôn Vàng 14K đá Moissanite",
    price: 12539000,
  },
  {
    id: 5,
    imageUrl: "/src/assets/product-imgs/product5/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 19957000,
  },
  {
    id: 6,
    imageUrl: "/src/assets/product-imgs/product6/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 17338000,
  },
  {
    id: 7,
    imageUrl: "/src/assets/product-imgs/product7/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 20951000,
  },
  {
    id: 8,
    imageUrl: "/src/assets/product-imgs/product8/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 17557000,
  },
  {
    id: 9,
    imageUrl: "/src/assets/product-imgs/product5/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 19957000,
  },
  {
    id: 10,
    imageUrl: "/src/assets/product-imgs/product6/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 17338000,
  },
  {
    id: 11,
    imageUrl: "/src/assets/product-imgs/product7/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 20951000,
  },
  {
    id: 12,
    imageUrl: "/src/assets/product-imgs/product8/1.png",
    brandName: "INGOUDE",
    productName: "Nhẫn cưới Vàng 14K Kim cương Lab-grown",
    price: 17557000,
  },
];

const selectedPriceRange = ref(`0-${Number.MAX_SAFE_INTEGER}`);
const priceRangeOptions = [
  {
    text: "All Prices",
    range: `0-${Number.MAX_SAFE_INTEGER}`,
  },
  {
    text: "Under ₫5.000.000",
    range: "0-5000000",
  },
  {
    text: "From ₫5.000.000 To ₫7.000.000",
    range: "5000000-7000000",
  },
  {
    text: "From ₫7.000.000 To ₫10.000.000",
    range: "7000000-10000000",
  },
  {
    text: "From ₫10.000.000 To ₫15.000.000",
    range: "10000000-15000000",
  },
  {
    text: "From ₫15.000.000 To ₫20.000.000",
    range: "15000000-20000000",
  },
  {
    text: "Over ₫20.000.000",
    range: `20000000-${Number.MAX_SAFE_INTEGER}`,
  },
];

const selectedBrands = ref([]);
const brands = [
  { id: 1, name: "SILVORA" },
  { id: 2, name: "INGOUDE" },
  { id: 3, name: "NILA" },
  { id: 4, name: "MUSE" },
  { id: 5, name: "VERRA" },
  { id: 6, name: "LUMERA" },
];

const selectedTypeOfJewelry = ref([]);
const typeOfJewelry = [
  { id: 1, name: "Necklaces" },
  { id: 2, name: "Rings" },
  { id: 3, name: "Earrings" },
  { id: 4, name: "Bracelets" },
];

const searchInput = ref("");

// const productMaxPrice = ref(24999000);
// const priceRange = ref([0, productMaxPrice.value]);
</script>

<template>
  <div class="main-container" style="margin-top: 100px">
    <el-breadcrumb :separator-icon="ArrowRight" style="font-size: 18px">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>All Products</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <Heading
    heading="ALL PRODUCTS"
    style="margin-bottom: 16px; margin-top: 16px"
  />

  <div class="main-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="searchInput"
          size="large"
          placeholder="Search Jewery Name"
          :suffix-icon="Search"
          clearable
        />

        <!-- PRICE SLIDER -->
        <!-- <div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 20px;
            "
          >
            <el-input
              v-model="priceRange[0]"
              style="width: 240px"
              size="large"
              placeholder="Please input"
              :formatter="
                (value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              "
              :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
            >
              <template #prefix>
                <span style="margin-right: 4px; position: relative; top: 2px"
                  >₫</span
                >
              </template>
            </el-input>

            <span style="color: #999; margin: 0 20px">-</span>

            <el-input
              v-model="priceRange[1]"
              size="large"
              style="width: 240px"
              placeholder="Please input"
              :formatter="
                (value: string) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              "
              :parser="(value: string) => value.replace(/\$\s?|(,*)/g, '')"
            >
              <template #prefix>
                <span style="margin-right: 4px; position: relative; top: 2px"
                  >₫</span
                >
              </template>
            </el-input>
          </div>

          <el-slider
            v-model="priceRange"
            range
            step="100000"
            :max="productMaxPrice"
            :format-tooltip="(val: number) => {
                return formatNumberWithDots(val);
              }"
          />
        </div> -->

        <!-- PRICE RANGE -->
        <div>
          <h4 class="filter-heading">Price Filter</h4>
          <el-radio-group v-model="selectedPriceRange">
            <el-radio
              v-for="option in priceRangeOptions"
              :key="option.range"
              :value="option.range"
              :label="option.text"
              size="large"
              style="width: 100%"
            />
          </el-radio-group>
        </div>

        <div>
          <!-- BRAND FILTER -->
          <h4 class="filter-heading">Brands</h4>
          <el-checkbox-group v-model="selectedBrands">
            <el-row>
              <el-col :span="8" v-for="brand in brands" :key="brand.id">
                <el-checkbox :label="brand.name" size="large" />
              </el-col>
            </el-row>
          </el-checkbox-group>

          <!-- TYPE OF JEWELRY FILTER -->
          <h4 class="filter-heading">Type of Jewelry</h4>
          <el-checkbox-group v-model="selectedTypeOfJewelry">
            <el-row>
              <el-col :span="8" v-for="type in typeOfJewelry" :key="type.id">
                <el-checkbox :label="type.name" size="large" />
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
      </el-col>
      <el-col :span="18">
        <el-row :gutter="10">
          <el-col :span="6" v-for="product in products" :key="product.id">
            <ProductCard
              :image-url="product.imageUrl"
              :brand-name="product.brandName"
              :product-name="product.productName"
              :price="product.price"
            />
          </el-col>
        </el-row>
        <div style="display: flex; justify-content: center; margin: 20px 0">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="10"
            :page-size="9"
            size="large"
            style="--el-pagination-button-bg-color: #fff"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.filter-heading {
  font-size: 22px;
  margin-top: 20px;
}
</style>

<style>
.el-checkbox__label {
  position: relative;
  top: 2px;
}

.el-checkbox__inner,
.el-radio__inner {
  width: 20px !important;
  height: 20px !important;
}
</style>
