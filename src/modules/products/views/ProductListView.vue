<template>
  <v-main class="bg-grey-lighten-5 min-h-screen">
    <v-container class="py-8" style="max-width: 1440px">
      
      <v-row class="mb-12">
         <v-col cols="12" md="8">
            <v-carousel
               cycle
               height="400"
               hide-delimiter-background
               show-arrows="hover"
               class="rounded-xl shadow-card overflow-hidden"
            >
               <v-carousel-item
                 v-for="(slide, i) in slides"
                 :key="i"
                 :src="slide.src"
                 cover
               >
                  <div class="fill-height d-flex align-end pb-12 ps-12" style="background: linear-gradient(to top, rgba(0,0,0,0.5), transparent)">
                     <div class="text-white mb-4">
                        <h2 class="text-h4 font-weight-bold mb-2">Công nghệ mới nhất</h2>
                        <v-btn variant="flat" color="white" class="text-black font-weight-bold rounded-pill px-6">Khám phá ngay</v-btn>
                     </div>
                  </div>
               </v-carousel-item>
            </v-carousel>
         </v-col>
         
         <v-col cols="12" md="4" class="d-none d-md-flex flex-column justify-space-between">
             <v-card class="rounded-xl shadow-card flex-grow-1 mb-4 cursor-pointer hover-lift overflow-hidden" elevation="0">
                <v-img 
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop" 
                  cover 
                  height="100%"
                  class="zoom-effect"
                ></v-img>
             </v-card>
             <v-card class="rounded-xl shadow-card flex-grow-1 cursor-pointer hover-lift overflow-hidden" elevation="0">
                <v-img 
                  src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop" 
                  cover 
                  height="100%"
                  class="zoom-effect"
                ></v-img>
             </v-card>
         </v-col>
      </v-row>
  
      <div class="mb-16">
         <div class="d-flex align-end justify-space-between mb-6 px-2">
            <div>
               <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-1">Sản phẩm nổi bật</h2>
               <p class="text-body-1 text-grey">Những lựa chọn hàng đầu dành cho bạn</p>
            </div>
            <v-btn 
               variant="text" 
               color="primary" 
               class="font-weight-bold text-capitalize" 
               append-icon="mdi-arrow-right"
            >
               Xem tất cả
            </v-btn>
         </div>
         
         <v-row>
            <v-col v-for="product in productStore.products.slice(0, 4)" :key="'best-'+product.id" cols="12" sm="6" md="3">
               <ProductCard :product="product" />
            </v-col>
         </v-row>
      </div>
  
      <div class="mb-16">
         <div class="rounded-xl overflow-hidden position-relative shadow-card cursor-pointer group">
            <v-img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
              height="300" 
              cover 
              class="zoom-effect"
            >
               <div class="d-flex flex-column justify-center fill-height ps-10 ps-md-16 bg-gradient-overlay">
                   <div style="max-width: 500px">
                       <v-chip color="white" class="mb-4 font-weight-bold text-black" size="small">ƯU ĐÃI ĐỘC QUYỀN</v-chip>
                       <h3 class="text-h3 font-weight-bold text-white mb-4">Nâng cấp không gian làm việc</h3>
                       <p class="text-white text-h6 mb-6 opacity-90 font-weight-regular">Giảm ngay 20% cho trọn bộ setup bàn làm việc thông minh.</p>
                       <v-btn size="large" color="white" class="text-black font-weight-bold rounded-pill px-8 elevation-0">Mua ngay</v-btn>
                   </div>
               </div>
            </v-img>
         </div>
      </div>
  
      <div id="main-shop">
         <div class="d-flex align-center justify-space-between mb-6 px-2">
            <h3 class="text-h4 font-weight-bold text-grey-darken-3">Gợi ý cho bạn</h3>
            
            <div style="width: 220px">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                item-title="label"
                item-value="value"
                label="Sắp xếp theo"
                density="comfortable"
                variant="solo"
                flat
                hide-details
                bg-color="white"
                class="rounded-lg shadow-sm border font-weight-medium"
                menu-icon="mdi-chevron-down"
                @update:modelValue="handleSortChange"
              ></v-select>
            </div>
         </div>
  
         <v-row>
            <v-col cols="12" md="3" class="d-none d-md-block">
               <div class="position-sticky" style="top: 100px; z-index: 1;">
                   <ProductFilter 
                      @filter="handleFilter" 
                      :initialParams="productStore.searchParams" 
                      class="rounded-xl border-0 shadow-card"
                   />
               </div>
            </v-col>
  
            <v-col cols="12" md="9">
              <v-row v-if="productStore.isLoading">
                <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
                  <v-skeleton-loader type="image, article" class="rounded-xl bg-white shadow-sm"></v-skeleton-loader>
                </v-col>
              </v-row>
  
              <div v-else-if="productStore.products.length === 0" class="text-center py-24 bg-white rounded-xl border border-dashed">
                <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-package-variant-closed</v-icon>
                <div class="text-h6 text-grey-darken-1 mt-2">Không tìm thấy sản phẩm</div>
                <v-btn 
                   color="black" 
                   variant="flat" 
                   class="mt-6 rounded-pill px-8 text-capitalize" 
                   @click="productStore.resetFilters(); handleFilter({})"
                >
                   Xóa bộ lọc
                </v-btn>
              </div>
  
              <v-row v-else>
                <v-col
                  v-for="product in productStore.products"
                  :key="product.id"
                  cols="12" sm="6" md="4"
                >
                  <ProductCard :product="product" />
                </v-col>
              </v-row>
  
              <div class="d-flex justify-center mt-12" v-if="productStore.totalItems > 0">
                <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                  :total-visible="5"
                  rounded="circle"
                  active-color="black"
                  color="grey-lighten-2"
                  variant="flat"
                  @update:modelValue="changePage"
                ></v-pagination>
              </div>
            </v-col>
         </v-row>
      </div>

      <v-snackbar
        v-model="showCompareBar"
        :timeout="-1"
        color="grey-darken-4"
        location="bottom center"
        rounded="pill"
        class="mb-6"
        elevation="10"
      >
        <div class="d-flex align-center">
            <v-icon color="blue-lighten-2" class="mr-2">mdi-compare</v-icon>
            <span class="font-weight-medium">Đang chọn {{ compareCount }} sản phẩm để so sánh</span>
        </div>
        <template v-slot:actions>
          <v-btn color="blue-lighten-2" variant="text" class="font-weight-bold" to="/compare">
            So sánh ngay
          </v-btn>
          <v-btn icon size="small" variant="text" @click="productStore.clearCompare">
             <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
  
    </v-container>
  </v-main>
</template>
  
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '../store/product.store';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'; // [MỚI] Import storeToRefs
import ProductCard from '../components/ProductCard.vue';
import ProductFilter from '../components/ProductFilter.vue';
  
const productStore = useProductStore();
const route = useRoute();
  
// [MỚI] Lấy state reactive cho compare bar
const { compareIds } = storeToRefs(productStore);
const compareCount = computed(() => compareIds.value.length);
const showCompareBar = computed(() => compareIds.value.length > 0);

const currentPage = ref(1);
const sortBy = ref('createdAt,desc');
  
// Banner Data (Fake)
const slides = [
  { src: 'https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=2000&auto=format&fit=crop' },
  { src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2000&auto=format&fit=crop' },
];
  
const sortOptions = [
  { label: 'Mới nhất', value: 'createdAt,desc' },
  { label: 'Giá thấp đến cao', value: 'price,asc' },
  { label: 'Giá cao đến thấp', value: 'price,desc' },
  { label: 'Tên A-Z', value: 'name,asc' }
];
  
const totalPages = computed(() => Math.ceil(productStore.totalItems / productStore.searchParams.size));
  
onMounted(() => {
  const initialQuery = route.query;
  productStore.fetchProducts({ ...initialQuery });
});
  
// Watch URL param
watch(() => route.query, (newQuery) => {
  currentPage.value = 1;
  productStore.fetchProducts({ 
    ...productStore.searchParams,
    q: newQuery.q || '',
    ...newQuery,
    page: 0 
  });
  
  document.getElementById('main-shop')?.scrollIntoView({ behavior: 'smooth' });
}, { deep: true });
  
const handleFilter = (filterParams) => {
  currentPage.value = 1; 
  productStore.fetchProducts({ ...filterParams, page: 0 });
};
  
const handleSortChange = (val) => {
  productStore.fetchProducts({ sort: val });
};
  
const changePage = (page) => {
  document.getElementById('main-shop')?.scrollIntoView({ behavior: 'smooth' });
  productStore.fetchProducts({ page: page - 1 });
};
</script>
  
<style scoped>
/* CSS cũ giữ nguyên */
.min-h-screen {
    min-height: 100vh;
}

.shadow-card {
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05) !important;
    transition: all 0.3s ease;
}

.shadow-sm {
    box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
}

.hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1) !important;
}

.zoom-effect {
    transition: transform 0.5s ease;
}
.group:hover .zoom-effect,
.hover-lift:hover .zoom-effect {
    transform: scale(1.03);
}

.bg-gradient-overlay {
    background: linear-gradient(to right, rgba(0,0,0,0.6), transparent);
}

.text-h4 {
    letter-spacing: -0.02em !important;
}
</style>