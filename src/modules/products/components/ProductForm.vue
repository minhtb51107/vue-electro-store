<template>
  <v-container fluid>
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="text-h6 font-weight-bold">Thông tin chung</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="localProduct.name"
                label="Tên sản phẩm *"
                :rules="[rules.required]"
                variant="outlined"
              ></v-text-field>

              <v-textarea
                v-model="localProduct.description"
                label="Mô tả chi tiết"
                variant="outlined"
                rows="5"
              ></v-textarea>
              
              <v-textarea
                v-model="localProduct.shortDescription"
                label="Mô tả ngắn (SEO)"
                variant="outlined"
                rows="2"
              ></v-textarea>
            </v-card-text>
          </v-card>

          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <span class="text-h6 font-weight-bold">Biến thể sản phẩm (Variants)</span>
              <v-spacer></v-spacer>
              <v-btn color="primary" size="small" prepend-icon="mdi-plus" @click="addVariant">
                Thêm biến thể
              </v-btn>
            </v-card-title>
            
            <v-card-text>
              <div v-if="localProduct.variants.length === 0" class="text-center py-4 text-grey">
                Chưa có biến thể nào. Hãy thêm ít nhất 1 biến thể.
              </div>

              <v-expansion-panels v-else v-model="expandedVariant">
                <v-expansion-panel
                  v-for="(variant, index) in localProduct.variants"
                  :key="index"
                  class="mb-2 border"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center w-100">
                      <strong class="me-3">#{{ index + 1 }}</strong>
                      <span class="text-subtitle-2">{{ variant.sku || 'New SKU' }}</span>
                      <v-spacer></v-spacer>
                      <v-chip size="small" color="green" class="me-2">
                        {{ formatCurrency(variant.price) }}
                      </v-chip>
                      <v-btn 
                        icon="mdi-delete" 
                        size="x-small" 
                        color="error" 
                        variant="text"
                        @click.stop="removeVariant(index)"
                      ></v-btn>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="variant.sku" label="SKU (Mã kho) *" :rules="[rules.required]" density="compact" variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="6" md="3">
                        <v-text-field v-model.number="variant.price" label="Giá bán *" type="number" :rules="[rules.required, rules.min(0)]" density="compact" variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="6" md="3">
                        <v-text-field v-model.number="variant.stockQuantity" label="Tồn kho *" type="number" :rules="[rules.required, rules.min(0)]" density="compact" variant="outlined"></v-text-field>
                      </v-col>
                      
                      <v-col cols="4"><v-text-field v-model="variant.color" label="Màu sắc" density="compact" variant="outlined"></v-text-field></v-col>
                      <v-col cols="4"><v-text-field v-model="variant.storage" label="Bộ nhớ (Storage)" density="compact" variant="outlined"></v-text-field></v-col>
                      <v-col cols="4"><v-text-field v-model="variant.ram" label="RAM" density="compact" variant="outlined"></v-text-field></v-col>

                      <v-col cols="12">
                        <div class="d-flex align-center mb-2">
                          <span class="text-caption font-weight-bold">Hình ảnh</span>
                          <v-spacer></v-spacer>
                          <v-btn size="x-small" variant="text" color="primary" @click="addImage(variant)">+ Thêm slot ảnh</v-btn>
                        </div>
                        
                        <div v-for="(img, imgIdx) in variant.images" :key="imgIdx" class="d-flex align-center mb-2 gap-2">
                          
                          <div class="flex-grow-1">
                              <v-file-input
                                v-if="!img.imageUrl"
                                density="compact"
                                variant="outlined"
                                hide-details
                                prepend-icon=""
                                prepend-inner-icon="mdi-camera"
                                label="Chọn ảnh để upload"
                                accept="image/*"
                                @update:modelValue="(files) => handleUploadImage(files, img)"
                                :loading="img.uploading"
                              ></v-file-input>
                              
                              <v-text-field 
                                v-else 
                                v-model="img.imageUrl" 
                                density="compact" 
                                variant="outlined" 
                                hide-details
                                readonly
                                bg-color="grey-lighten-4"
                                append-inner-icon="mdi-close-circle"
                                @click:append-inner="img.imageUrl = ''" 
                              >
                                <template v-slot:prepend-inner>
                                    <v-avatar size="24" class="me-2">
                                        <v-img :src="img.imageUrl" cover></v-img>
                                    </v-avatar>
                                </template>
                              </v-text-field>
                          </div>
                          
                          <v-checkbox-btn 
                             v-model="img.thumbnail" 
                             color="primary" 
                             density="compact"
                             :true-value="true"
                             :false-value="false"
                             @update:modelValue="setThumbnail(variant, imgIdx)"
                          ></v-checkbox-btn>
                          <span class="text-caption text-grey" style="min-width: 50px">Thumb</span>

                          <v-btn icon="mdi-close" size="x-small" variant="text" color="error" @click="removeImage(variant, imgIdx)"></v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="text-h6 font-weight-bold">Tổ chức</v-card-title>
            <v-card-text>
              <v-switch
                v-model="localProduct.active"
                color="success"
                label="Đang bán (Active)"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-autocomplete
                v-model="localProduct.brandId"
                :items="taxonomyStore.brands"
                item-title="name"
                item-value="id"
                label="Thương hiệu *"
                :rules="[rules.required]"
                variant="outlined"
              ></v-autocomplete>

              <v-autocomplete
                v-model="localProduct.categoryId"
                :items="taxonomyStore.flattenCategories"
                item-title="name"
                item-value="id"
                label="Danh mục *"
                :rules="[rules.required]"
                variant="outlined"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="item.raw.name" :style="{ paddingLeft: (item.raw.level * 16 + 16) + 'px' }">
                     <template v-slot:prepend v-if="item.raw.level > 0">
                        <v-icon icon="mdi-subdirectory-arrow-right" size="small" color="grey"></v-icon>
                     </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-card-text>
          </v-card>

          <div class="d-flex flex-column gap-2">
             <v-btn color="primary" size="large" block @click="save" :loading="isSubmitting">
                {{ isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm' }}
             </v-btn>
             <v-btn variant="outlined" size="large" block @click="$router.back()">Quay lại</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../store/product.store';
import { useTaxonomyStore } from '../../taxonomy/store/taxonomy.store';
import fileService from '@/modules/common/services/file.service'; // <-- Import service upload

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const taxonomyStore = useTaxonomyStore();

const valid = ref(false);
const form = ref(null);
const isSubmitting = ref(false);
const expandedVariant = ref(0); // Mở variant đầu tiên

// Dữ liệu form
const localProduct = reactive({
  name: '',
  description: '',
  shortDescription: '',
  categoryId: null,
  brandId: null,
  active: true,
  variants: [] // Mảng các biến thể
});

// Rules validation
const rules = {
  required: v => !!v || 'Bắt buộc',
  min: minVal => v => v >= minVal || `Lớn hơn ${minVal}`
};

const isEdit = computed(() => route.params.id !== 'new');

onMounted(async () => {
  // Load dữ liệu phụ trợ (Brand, Category)
  await Promise.all([
    taxonomyStore.fetchBrands(),
    taxonomyStore.fetchCategories()
  ]);

  // Nếu là mode Edit -> Fetch dữ liệu sản phẩm
  if (isEdit.value) {
    const product = await productStore.fetchProductByIdAdmin(route.params.id);
    if (product) {
      Object.assign(localProduct, {
        ...product,
        categoryId: product.category?.id,
        brandId: product.brand?.id,
        // Map lại variants nếu cần thiết
        variants: product.variants || []
      });
    }
  } else {
    // Nếu là Create -> Thêm sẵn 1 variant rỗng
    addVariant();
  }
});

// --- Logic xử lý Variants ---
const addVariant = () => {
  localProduct.variants.push({
    sku: '',
    price: 0,
    stockQuantity: 10,
    color: '',
    storage: '',
    ram: '',
    images: [{ imageUrl: '', thumbnail: true, uploading: false }] // Thêm uploading state
  });
  expandedVariant.value = localProduct.variants.length - 1; // Mở cái vừa thêm
};

const removeVariant = (index) => {
  localProduct.variants.splice(index, 1);
};

// --- Logic xử lý Images trong Variant ---
const addImage = (variant) => {
  variant.images.push({ imageUrl: '', thumbnail: false, uploading: false });
};

const removeImage = (variant, index) => {
  variant.images.splice(index, 1);
};

const setThumbnail = (variant, selectedIndex) => {
  // Đảm bảo chỉ có 1 ảnh là thumbnail
  variant.images.forEach((img, idx) => {
    img.thumbnail = idx === selectedIndex;
  });
};

// --- NEW: Hàm xử lý Upload ảnh ---
const handleUploadImage = async (files, imgObject) => {
  // Vuetify 3 file input có thể trả về mảng hoặc object tùy config
  const file = Array.isArray(files) ? files[0] : files;
  if (!file) return;

  imgObject.uploading = true; 
  try {
    const response = await fileService.upload(file);
    // Backend trả về FileUploadResponse { fileUrl: "..." }
    imgObject.imageUrl = response.fileUrl; 
  } catch (error) {
    alert('Upload thất bại: ' + error.message);
  } finally {
    imgObject.uploading = false;
  }
};
// --------------------------------

// --- Save ---
const save = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  // Validate thủ công: Phải có ít nhất 1 variant
  if (localProduct.variants.length === 0) {
    alert('Sản phẩm phải có ít nhất 1 biến thể.');
    return;
  }

  isSubmitting.value = true;
  let result;
  
  try {
    // Clone object để clean data trước khi gửi (ví dụ bỏ trường uploading)
    const payload = {
        ...localProduct,
        variants: localProduct.variants.map(v => ({
            ...v,
            images: v.images.map(({ uploading, ...rest }) => rest) // Loại bỏ field uploading thừa
        }))
    };

    if (isEdit.value) {
      result = await productStore.updateProduct(route.params.id, payload);
    } else {
      result = await productStore.createProduct(payload);
    }

    if (result.success) {
      router.push({ name: 'AdminProductList' });
    } else {
      alert('Lỗi: ' + result.message);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>