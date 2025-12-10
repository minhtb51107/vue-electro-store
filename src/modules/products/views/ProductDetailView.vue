<template>
  <div v-if="loading" class="d-flex justify-center align-center" style="height: 80vh">
     <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </div>

  <v-container v-else-if="product" class="py-8">
    <v-breadcrumbs 
      :items="['Trang chủ', product.category?.name, product.name]" 
      class="px-0 pb-4 text-caption text-grey"
    ></v-breadcrumbs>

    <v-row class="bg-white rounded-xl pa-6 shadow-soft border">
      <v-col cols="12" md="5">
        <div class="rounded-lg overflow-hidden border mb-4 bg-white d-flex align-center justify-center position-relative" style="height: 450px;">
           <v-img 
             :src="displayImages[currentImageIndex].imageUrl" 
             contain 
             max-height="100%"
             class="product-image-transition"
           >
              <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
                  </div>
              </template>
           </v-img>
           
           <v-chip v-if="discountPercent > 0" color="error" class="position-absolute top-0 left-0 ma-4 font-weight-bold">
              -{{ discountPercent }}%
           </v-chip>
        </div>

        <div class="d-flex justify-center gap-2 overflow-x-auto py-2">
            <v-card
              v-for="(img, i) in displayImages"
              :key="i"
              :class="['border cursor-pointer rounded-md transition-all', currentImageIndex === i ? 'border-primary ring-2' : 'opacity-70']"
              width="70"
              height="70"
              flat
              @click="currentImageIndex = i"
            >
              <v-img :src="img.imageUrl" cover height="100%"></v-img>
            </v-card>
        </div>
      </v-col>

      <v-col cols="12" md="7" class="ps-md-8">
        <div class="text-uppercase text-primary font-weight-bold mb-1 text-caption ls-1">
           {{ product.brand?.name }}
        </div>
        <h1 class="text-h4 font-weight-bold mb-2 text-secondary">{{ product.name }}</h1>
        
        <div class="d-flex align-center mb-4 gap-4">
           <div class="d-flex align-center pe-4 border-e">
               <span class="text-body-2 font-weight-bold text-amber-darken-2 me-1 border-b-2 border-amber">{{ product.averageRating || 5 }}</span>
               <v-rating :model-value="product.averageRating || 5" density="compact" readonly size="x-small" color="amber"></v-rating>
           </div>
           <div class="text-caption text-grey">
              {{ product.reviewCount || 0 }} Đánh giá
           </div>
           <div class="text-caption text-grey">
              Đã bán: {{ product.soldQuantity || 0 }}
           </div>
        </div>

        <div class="bg-grey-lighten-5 pa-4 rounded-lg mb-6 d-flex align-center justify-space-between">
           <div>
              <div class="text-h4 font-weight-bold text-price">
                  {{ selectedVariant ? formatCurrency(selectedVariant.price) : 'Liên hệ' }}
              </div>
              <div v-if="selectedVariant && selectedVariant.price < product.originalPrice" class="text-decoration-line-through text-grey text-caption">
                  {{ formatCurrency(product.originalPrice) }}
              </div>
           </div>
           
           <div class="text-end">
               <v-chip :color="isStockAvailable ? 'green-lighten-4' : 'red-lighten-4'" :text-color="isStockAvailable ? 'green-darken-2' : 'red-darken-2'" label size="small" class="font-weight-bold">
                  <v-icon start :icon="isStockAvailable ? 'mdi-check-circle' : 'mdi-close-circle'"></v-icon>
                  {{ isStockAvailable ? 'Còn hàng' : 'Hết hàng' }}
               </v-chip>
               <div v-if="selectedVariant" class="text-caption text-grey mt-1">
                  Kho: {{ selectedVariant.stockQuantity }}
               </div>
           </div>
        </div>
        
        <div class="mb-6" v-if="availableColors.length > 0">
          <div class="text-subtitle-2 font-weight-bold mb-2 text-grey-darken-2">Màu sắc</div>
          <div class="d-flex flex-wrap gap-2">
             <v-chip
                v-for="color in availableColors" :key="color"
                @click="selectedColor = color"
                :color="selectedColor === color ? 'primary' : undefined"
                :variant="selectedColor === color ? 'flat' : 'outlined'"
                class="px-4 py-2 h-auto text-capitalize"
                label
             >
                {{ color }}
                <v-icon v-if="selectedColor === color" end icon="mdi-check" size="small"></v-icon>
             </v-chip>
          </div>
        </div>

        <div class="mb-6" v-if="availableStorages.length > 0">
          <div class="text-subtitle-2 font-weight-bold mb-2 text-grey-darken-2">Phiên bản</div>
          <div class="d-flex flex-wrap gap-2">
             <v-chip
                v-for="storage in availableStorages" :key="storage"
                @click="selectedStorage = storage"
                :color="selectedStorage === storage ? 'primary' : undefined"
                :variant="selectedStorage === storage ? 'flat' : 'outlined'"
                class="px-4 py-2 h-auto"
                label
             >
                {{ storage }}
                <v-icon v-if="selectedStorage === storage" end icon="mdi-check" size="small"></v-icon>
             </v-chip>
          </div>
        </div>

        <div class="d-flex align-center gap-4 mt-8">
           <div class="d-flex align-center border rounded-lg bg-white" style="height: 48px;">
              <v-btn icon="mdi-minus" variant="text" rounded="0" density="comfortable" :disabled="quantity <= 1" @click="quantity--"></v-btn>
              <input type="number" v-model.number="quantity" class="text-center font-weight-bold" style="width: 40px; outline: none;" readonly>
              <v-btn icon="mdi-plus" variant="text" rounded="0" density="comfortable" @click="quantity++"></v-btn>
           </div>
           
           <v-btn 
             color="primary" 
             height="48"
             variant="tonal"
             class="flex-grow-1 text-body-1 font-weight-bold"
             prepend-icon="mdi-cart-plus"
             :disabled="!isStockAvailable"
             @click="addToCart"
           >
              Thêm vào giỏ
           </v-btn>
           
           <v-btn 
             color="accent" 
             height="48"
             class="flex-grow-1 text-body-1 font-weight-bold shadow-soft text-white"
             :disabled="!isStockAvailable"
             @click="buyNow" 
           >
              Mua ngay
           </v-btn>
        </div>

        <div class="d-grid grid-cols-2 gap-4 mt-8 pt-6 border-t bg-grey-lighten-5 rounded pa-4">
           <div class="d-flex align-start">
              <v-icon icon="mdi-shield-check" color="primary" class="me-3 mt-1"></v-icon>
              <div><div class="font-weight-bold text-caption">Bảo hành chính hãng</div><div class="text-caption text-grey">12 tháng</div></div>
           </div>
           <div class="d-flex align-start">
              <v-icon icon="mdi-refresh" color="primary" class="me-3 mt-1"></v-icon>
              <div><div class="font-weight-bold text-caption">Đổi trả dễ dàng</div><div class="text-caption text-grey">1 đổi 1 trong 30 ngày</div></div>
           </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-6">
       <v-col cols="12" md="8">
          <div class="bg-white rounded-xl pa-6 shadow-soft border mb-6">
             <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center">
                <v-icon icon="mdi-text-box-outline" class="me-2" color="primary"></v-icon> Mô tả chi tiết
             </h3>
             <v-divider class="mb-4"></v-divider>
             <div class="product-description text-body-1 text-grey-darken-3" v-html="product.description"></div>
          </div>
          
          <div class="bg-white rounded-xl pa-6 shadow-soft border" id="reviews">
              <ReviewList 
                :productId="product.id" 
                :averageRating="product.averageRating"
                :reviewCount="product.reviewCount"
                @review-submitted="reloadProduct"
              />
           </div>
       </v-col>
       
       <v-col cols="12" md="4">
          <div class="bg-white rounded-xl pa-4 shadow-soft border position-sticky" style="top: 100px">
              <h3 class="text-subtitle-1 font-weight-bold mb-4">Sản phẩm bán chạy</h3>
              
              <div v-if="bestSellers.length > 0" class="d-flex flex-column gap-3">
                 <div v-for="topProd in bestSellers" :key="topProd.id" class="d-flex align-start gap-3 py-2 border-b cursor-pointer" @click="$router.push(`/products/${topProd.slug}`)">
                     <v-img 
                        :src="topProd.thumbnailUrl || 'https://via.placeholder.com/60'" 
                        width="60" 
                        height="60" 
                        cover 
                        class="rounded bg-grey-lighten-4 flex-shrink-0"
                     ></v-img>
                     <div>
                         <div class="text-body-2 font-weight-bold line-clamp-2">{{ topProd.name }}</div>
                         <div class="text-caption text-error font-weight-bold">{{ formatCurrency(topProd.price) }}</div>
                         <div class="text-caption text-grey">Đã bán: {{ topProd.soldQuantity || 0 }}</div>
                     </div>
                 </div>
              </div>
              
              <div v-else class="text-caption text-center py-4 text-grey">Chưa có dữ liệu</div>
          </div>
       </v-col>
    </v-row>

    <div class="mt-12" v-if="relatedProducts.length > 0">
        <h3 class="text-h5 font-weight-bold mb-6 d-flex align-center">
            <v-icon icon="mdi-view-grid-plus-outline" class="me-2" color="primary"></v-icon> Có thể bạn quan tâm
        </h3>
        <v-row>
            <v-col v-for="p in relatedProducts" :key="p.id" cols="12" sm="6" md="4" lg="3">
                <ProductCard :product="p" />
            </v-col>
        </v-row>
    </div>
  </v-container>

  <div v-else class="text-center py-16 bg-white fill-height d-flex flex-column justify-center align-center">
     <v-icon icon="mdi-package-variant-closed" size="80" color="grey-lighten-2" class="mb-4"></v-icon>
     <h2 class="text-h5 font-weight-bold text-grey-darken-2">Không tìm thấy sản phẩm</h2>
     <v-btn to="/" color="primary" size="large" prepend-icon="mdi-arrow-left" class="mt-4">Quay lại trang chủ</v-btn>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../store/product.store';
import { useCartStore } from '@/modules/cart/store/cart.store';
import { useAppStore } from '@/store/app.store'; 
import ReviewList from '../components/ReviewList.vue';
import ProductCard from '../components/ProductCard.vue';
import productService from '../services/product.service';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const appStore = useAppStore();

const loading = ref(true);
const product = ref(null);
const relatedProducts = ref([]);
const bestSellers = ref([]); // [NEW] State bán chạy

const selectedColor = ref(null);
const selectedStorage = ref(null);
const quantity = ref(1);
const currentImageIndex = ref(0);

onMounted(async () => {
  await loadProductData(route.params.slug);
  await loadBestSellers(); // [NEW] Load sidebar
});

watch(() => route.params.slug, (newSlug) => {
    if(newSlug) {
        quantity.value = 1;
        currentImageIndex.value = 0;
        loadProductData(newSlug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

const loadProductData = async (slug) => {
  loading.value = true;
  const data = await productStore.fetchProductBySlug(slug);
  if (data) {
    product.value = data;
    initializeSelection(data.variants);
    await loadRelatedProducts(data);
  }
  loading.value = false;
}

const loadRelatedProducts = async (currentProduct) => {
    try {
        const res = await productService.search({ 
            categorySlug: currentProduct.category?.slug, 
            size: 5, 
            page: 0 
        });
        relatedProducts.value = res.content.filter(p => p.id !== currentProduct.id).slice(0, 4);
    } catch (e) { console.error(e); }
}

// [NEW] Hàm lấy Top bán chạy
const loadBestSellers = async () => {
    try {
        const res = await productService.search({ 
            sort: 'soldQuantity,desc', 
            page: 0, 
            size: 5 
        });
        bestSellers.value = res.content;
    } catch (e) { console.error("Lỗi load best sellers", e); }
};

const reloadProduct = async () => {
    const data = await productStore.fetchProductBySlug(route.params.slug);
    if (data) product.value = data;
}

const availableColors = computed(() => {
  if (!product.value?.variants) return [];
  return [...new Set(product.value.variants.map(v => v.color).filter(Boolean))];
});

const availableStorages = computed(() => {
  if (!product.value?.variants) return [];
  return [...new Set(product.value.variants.map(v => v.storage).filter(Boolean))];
});

const selectedVariant = computed(() => {
  if (!product.value?.variants) return null;
  return product.value.variants.find(v => {
    const matchColor = !v.color || v.color === selectedColor.value;
    const matchStorage = !v.storage || v.storage === selectedStorage.value;
    return matchColor && matchStorage;
  }) || product.value.variants[0]; 
});

const displayImages = computed(() => {
  if (selectedVariant.value?.images?.length > 0) return selectedVariant.value.images;
  if (product.value?.variants?.[0]?.images?.length > 0) return product.value.variants[0].images;
  return [{ imageUrl: 'https://via.placeholder.com/500x500?text=No+Image' }];
});

const isStockAvailable = computed(() => selectedVariant.value && selectedVariant.value.stockQuantity > 0);

const discountPercent = computed(() => {
    if (!selectedVariant.value || !product.value.originalPrice) return 0;
    const current = selectedVariant.value.price;
    const original = product.value.originalPrice;
    if (current >= original) return 0;
    return Math.round(((original - current) / original) * 100);
});

const initializeSelection = (variants) => {
  if (variants && variants.length > 0) {
    const first = variants[0];
    if (first.color) selectedColor.value = first.color;
    if (first.storage) selectedStorage.value = first.storage;
  }
};

const addToCart = async () => {
  if (!selectedVariant.value) return;
  const res = await cartStore.addToCart(selectedVariant.value.id, quantity.value);
  if (res.success) {
      appStore.notify("Đã thêm sản phẩm vào giỏ hàng!", "success");
  } else {
      appStore.notify(res.message || "Lỗi khi thêm vào giỏ", "error");
  }
};

const buyNow = async () => {
   if (!selectedVariant.value) return;
   await addToCart(); 
   router.push({ name: 'Checkout' }); 
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
</script>

<style scoped>
.ring-2 { box-shadow: 0 0 0 2px rgb(var(--v-theme-primary)); }
.ls-1 { letter-spacing: 1px; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.d-grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.product-description :deep(img) { max-width: 100%; height: auto; border-radius: 8px; }
.transition-all { transition: all 0.2s ease; }
.product-image-transition { transition: opacity 0.3s ease; }
.line-clamp-2 {
   display: -webkit-box;
   -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
   overflow: hidden;
}
</style>