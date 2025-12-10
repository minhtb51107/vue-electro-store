<template>
  <v-container class="py-12">
    <h2 class="text-h4 font-weight-bold mb-6 text-center">So sánh sản phẩm</h2>
    
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-grey">Đang tải dữ liệu so sánh...</p>
    </div>

    <div v-else-if="comparisonData && comparisonData.products && comparisonData.products.length > 0">
      <v-table class="comparison-table border rounded-xl overflow-hidden" hover>
        <thead>
          <tr>
            <th class="text-left bg-grey-lighten-4 py-4" style="width: 200px; font-size: 1.1rem;">Thông số kỹ thuật</th>
            <th v-for="prod in comparisonData.products" :key="prod.id" class="text-center py-6 align-top bg-white position-relative" style="min-width: 250px;">
              <v-btn 
                icon="mdi-close" 
                size="small" 
                variant="text" 
                color="grey" 
                class="position-absolute top-0 right-0 ma-2"
                @click="removeProduct(prod.id)"
              ></v-btn>
              
              <v-img :src="prod.thumbnailUrl" height="150" contain class="mb-4"></v-img>
              <div class="font-weight-bold text-h6 mb-1 px-4">{{ prod.name }}</div>
              <div class="text-error font-weight-bold text-h6 mb-4">{{ formatCurrency(prod.price) }}</div>
              <v-btn 
                color="black" 
                variant="flat" 
                class="rounded-pill px-6"
                :to="`/products/${prod.slug}`"
              >
                Xem chi tiết
              </v-btn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(values, attrName) in comparisonData.attributes" :key="attrName">
            <td class="font-weight-medium bg-grey-lighten-5 py-3">{{ attrName }}</td>
            <td v-for="(val, index) in values" :key="index" class="text-center py-3">
              <span v-if="val === 'Yes' || val === 'true'"><v-icon color="success">mdi-check</v-icon></span>
              <span v-else-if="val === 'No' || val === 'false'"><v-icon color="grey-lighten-1">mdi-minus</v-icon></span>
              <span v-else>{{ val }}</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <v-sheet v-else class="text-center py-16 rounded-xl border border-dashed bg-grey-lighten-5">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-compare-remove</v-icon>
      <div class="text-h5 text-grey-darken-1 mb-2">Chưa có sản phẩm nào để so sánh</div>
      <p class="text-grey mb-6">Vui lòng chọn ít nhất 2 sản phẩm để bắt đầu so sánh</p>
      <v-btn to="/products" color="primary" variant="flat" size="large" class="rounded-pill px-8">
        Quay lại cửa hàng
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '../store/product.store';
import { storeToRefs } from 'pinia';

const store = useProductStore();
const { comparisonData, isLoading: loading } = storeToRefs(store);

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const removeProduct = async (id) => {
    store.removeFromCompare(id);
    if(store.compareIds.length >= 2) {
        await store.fetchComparison();
    } else {
        store.comparisonData = null;
    }
};

onMounted(() => {
  store.fetchComparison();
});
</script>

<style scoped>
.comparison-table th, .comparison-table td {
    border-right: 1px solid #f0f0f0;
}
.comparison-table th:last-child, .comparison-table td:last-child {
    border-right: none;
}
</style>