<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ isEdit ? 'Cập nhật Danh mục' : 'Thêm Danh mục mới' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" @submit.prevent="save">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="localItem.name"
                  label="Tên danh mục *"
                  :rules="[v => !!v || 'Tên là bắt buộc']"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="localItem.parentId"
                  :items="parentOptions"
                  item-title="displayName" 
                  item-value="id"
                  label="Danh mục cha (Không bắt buộc)"
                  variant="outlined"
                  clearable
                  persistent-hint
                  hint="Để trống nếu đây là danh mục gốc"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="close">Hủy</v-btn>
        <v-btn color="blue-darken-1" variant="elevated" @click="save" :loading="loading">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTaxonomyStore } from '../store/taxonomy.store';

const props = defineProps({
  modelValue: Boolean,
  item: Object,
  loading: Boolean
});
const emit = defineEmits(['update:modelValue', 'submit']);
const taxonomyStore = useTaxonomyStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const localItem = ref({ name: '', parentId: null });
const isEdit = computed(() => !!props.item?.id);

// Tạo danh sách options cho select cha
// Format lại tên để hiển thị cấp độ (Ví dụ: "-- Laptop Gaming")
const parentOptions = computed(() => {
  return taxonomyStore.flattenCategories.map(cat => ({
    id: cat.id,
    // Tạo thụt đầu dòng bằng ký tự đặc biệt dựa trên level
    displayName: '— '.repeat(cat.level) + cat.name 
  })).filter(c => c.id !== props.item?.id); // Không cho chọn chính mình làm cha
});

watch(() => props.item, (val) => {
  localItem.value = val ? { ...val } : { name: '', parentId: null };
}, { immediate: true });

const close = () => {
  dialog.value = false;
};

const save = () => {
  if (!localItem.value.name) return; // Validate đơn giản
  emit('submit', localItem.value);
};
</script>