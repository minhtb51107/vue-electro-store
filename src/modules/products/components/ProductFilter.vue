<template>
  <v-card class="rounded-xl border-0 shadow-card pa-2">
    <div class="pa-4 pb-2 d-flex align-center justify-space-between">
       <span class="text-h6 font-weight-bold text-grey-darken-3">Bộ lọc</span>
       <v-btn 
          variant="text" 
          density="compact" 
          icon="mdi-refresh" 
          color="grey" 
          @click="resetFilter" 
          title="Làm mới"
       ></v-btn>
    </div>
    
    <v-card-text class="pa-4 pt-2">
      <div class="mb-8">
        <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 mb-3 text-uppercase ls-1">Danh mục</div>
        <v-radio-group v-model="localParams.categorySlug" hide-details class="filter-group">
          <v-radio 
             label="Tất cả sản phẩm" 
             :value="null" 
             color="black" 
             density="compact"
             class="mb-1"
          ></v-radio>
          <v-radio 
            v-for="cat in categories" 
            :key="cat.id" 
            :label="cat.name" 
            :value="cat.slug"
            color="black"
            density="compact"
            class="mb-1"
            :style="{ marginLeft: (cat.level * 12) + 'px' }"
          ></v-radio>
        </v-radio-group>
      </div>

      <v-divider class="mb-6 border-opacity-25"></v-divider>

      <div class="mb-8">
        <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 mb-3 text-uppercase ls-1">Thương hiệu</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="brand in brands"
            :key="brand.id"
            :color="localParams.brandSlug === brand.slug ? 'black' : undefined"
            :variant="localParams.brandSlug === brand.slug ? 'flat' : 'outlined'"
            class="border-0 bg-grey-lighten-4 text-grey-darken-3 font-weight-medium"
            :class="{'bg-black text-white': localParams.brandSlug === brand.slug}"
            size="small"
            link
            @click="toggleBrand(brand.slug)"
          >
            {{ brand.name }}
          </v-chip>
        </div>
      </div>

      <v-divider class="mb-6 border-opacity-25"></v-divider>

      <div class="mb-6">
        <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 mb-4 text-uppercase ls-1">Khoảng giá</div>
        <v-range-slider
          v-model="priceRange"
          :min="0"
          :max="50000000"
          step="500000"
          color="black"
          thumb-size="16"
          track-size="4"
          track-color="grey-lighten-2"
          hide-details
          class="align-center mb-2"
        ></v-range-slider>
        <div class="d-flex justify-space-between text-caption font-weight-bold text-grey-darken-2">
          <span>{{ formatSimple(priceRange[0]) }}</span>
          <span>{{ formatSimple(priceRange[1]) }}</span>
        </div>
      </div>

      <v-btn 
         block 
         color="black" 
         class="mt-4 rounded-pill text-capitalize font-weight-bold" 
         size="large" 
         elevation="0"
         @click="applyFilter"
      >
        Áp dụng
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useTaxonomyStore } from '@/modules/taxonomy/store/taxonomy.store';

const props = defineProps(['initialParams']);
const emit = defineEmits(['filter']);
const taxonomyStore = useTaxonomyStore();

const localParams = reactive({
  categorySlug: null,
  brandSlug: null
});
const priceRange = ref([0, 50000000]);

onMounted(() => {
  if (taxonomyStore.categories.length === 0) taxonomyStore.fetchCategories();
  if (taxonomyStore.brands.length === 0) taxonomyStore.fetchBrands();
  
  if (props.initialParams) {
      localParams.categorySlug = props.initialParams.categorySlug || null;
      localParams.brandSlug = props.initialParams.brandSlug || null;
  }
});

const categories = computed(() => taxonomyStore.flattenCategories);
const brands = computed(() => taxonomyStore.brands);

const toggleBrand = (slug) => {
  localParams.brandSlug = (localParams.brandSlug === slug) ? null : slug;
};

const applyFilter = () => {
  emit('filter', {
    ...localParams,
    priceGte: priceRange.value[0],
    priceLte: priceRange.value[1]
  });
};

const resetFilter = () => {
  localParams.categorySlug = null;
  localParams.brandSlug = null;
  priceRange.value = [0, 50000000];
  applyFilter();
};

const formatSimple = (val) => {
    if(val >= 1000000) return (val/1000000) + 'Tr';
    return (val/1000) + 'k';
}
</script>

<style scoped>
.shadow-card {
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05) !important;
}
.gap-2 { gap: 8px; }
.ls-1 { letter-spacing: 1px; }

/* Custom Radio Style to match minimalist look */
.filter-group :deep(.v-label) {
    font-size: 0.9rem;
    color: #4b5563; /* grey-700 */
}
</style>