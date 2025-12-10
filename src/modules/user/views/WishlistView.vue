<template>
  <v-container class="py-12">
    <h2 class="text-h4 font-weight-bold mb-8">Danh sách yêu thích</h2>
    
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="products.length > 0">
        <v-row>
          <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="3">
            <ProductCard :product="product" />
          </v-col>
        </v-row>
    </div>

    <v-sheet v-else class="text-center py-16 rounded-xl border border-dashed bg-grey-lighten-5">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-heart-broken</v-icon>
      <div class="text-h5 text-grey-darken-1 mb-2">Danh sách yêu thích trống</div>
      <p class="text-grey mb-6">Hãy thả tim các món đồ công nghệ bạn thích nhé!</p>
      <v-btn to="/products" color="primary" variant="flat" size="large" class="rounded-pill px-8">
        Khám phá ngay
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import productService from '@/modules/products/services/product.service';
import ProductCard from '@/modules/products/components/ProductCard.vue';

const products = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await productService.getWishlist({ page: 0, size: 20 });
    
    // [FIX QUAN TRỌNG] Sửa res.data.content thành res.content
    // Backend trả về Page: { content: [], totalElements: ... }
    if (res && res.content) {
        products.value = res.content;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>