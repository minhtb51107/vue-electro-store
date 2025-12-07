<template>
  <v-card
    class="product-card h-100 d-flex flex-column cursor-pointer bg-white rounded-xl border-0 position-relative overflow-hidden"
    :class="isHovering ? 'shadow-card-hover' : 'shadow-card'"
    @click="navigate"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="position-relative pa-6 d-flex justify-center align-center bg-white" style="height: 240px; overflow: hidden;">
      <v-img
        :src="product.thumbnailUrl || 'https://via.placeholder.com/300x300?text=No+Image'"
        height="100%"
        width="100%"
        contain
        class="product-image transition-swing"
        :class="{ 'zoom-in': isHovering }"
      >
        <template v-slot:placeholder>
           <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
           </div>
        </template>
      </v-img>
      
      <div class="position-absolute top-0 left-0 ma-4 d-flex gap-2">
         <v-chip v-if="isNew" color="black" size="x-small" variant="flat" class="font-weight-bold px-2">NEW</v-chip>
         <v-chip v-if="discountPercent" color="error" size="x-small" variant="flat" class="font-weight-bold px-2">-{{ discountPercent }}%</v-chip>
      </div>

      <v-fade-transition>
        <v-btn
          v-if="isHovering"
          icon="mdi-shopping-outline"
          variant="flat"
          color="black"
          class="position-absolute bottom-0 right-0 ma-4 add-btn shadow-lg"
          @click.stop="quickAdd"
        ></v-btn>
      </v-fade-transition>
    </div>

    <div class="px-5 pb-5 pt-2 d-flex flex-column flex-grow-1">
      <div class="text-caption text-grey-darken-1 font-weight-medium text-uppercase ls-1 mb-1">
        {{ product.brandName }}
      </div>

      <div class="text-body-1 font-weight-bold text-grey-darken-3 mb-1 text-truncate" :title="product.name">
        {{ product.name }}
      </div>

      <div class="d-flex align-center mb-3">
         <v-rating 
            :model-value="product.averageRating || 0" 
            color="grey-lighten-1" 
            active-color="amber-400"
            density="compact" 
            half-increments 
            readonly 
            size="x-small"
         ></v-rating>
         <span class="text-caption text-grey ms-2" v-if="product.reviewCount">({{ product.reviewCount }})</span>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-baseline gap-2">
         <span class="text-h6 font-weight-bold text-grey-darken-4">
           {{ formatCurrency(product.price) }}
         </span>
         <span v-if="product.originalPrice && product.originalPrice > product.price" class="text-caption text-grey text-decoration-line-through">
            {{ formatCurrency(product.originalPrice) }}
         </span>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/modules/cart/store/cart.store';

const props = defineProps({
  product: { type: Object, required: true }
});

const router = useRouter();
const cartStore = useCartStore();
const isHovering = ref(false); // State để quản lý hiệu ứng hover

const isNew = computed(() => true); // Logic check ngày tạo (nếu có)

const discountPercent = computed(() => {
   if(!props.product.originalPrice || props.product.originalPrice <= props.product.price) return 0;
   return Math.round(((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100);
});

const navigate = () => {
  router.push({ name: 'ProductDetail', params: { slug: props.product.slug } });
};

const quickAdd = async () => {
    navigate(); // Demo: Vào trang chi tiết
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.shadow-card-hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.product-image {
  transition: transform 0.5s ease;
}

.zoom-in {
  transform: scale(1.08);
}

.ls-1 {
  letter-spacing: 1px;
}

.add-btn {
  z-index: 2;
}
</style>