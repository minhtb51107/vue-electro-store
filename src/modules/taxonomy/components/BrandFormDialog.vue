<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ isEdit ? 'Cập nhật Thương hiệu' : 'Thêm Thương hiệu mới' }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="localItem.name"
                  label="Tên thương hiệu *"
                  :rules="[v => !!v || 'Tên là bắt buộc']"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="localItem.logoUrl"
                  label="Logo URL"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="localItem.logoUrl" class="text-center">
                <v-img :src="localItem.logoUrl" max-height="100" contain></v-img>
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

// 1. --- DI CHUYỂN LÊN ĐÂY ---
const defaultItem = {
  name: '',
  logoUrl: ''
};

// 2. Props & Emit
const props = defineProps({
  modelValue: Boolean,
  item: Object,
  loading: Boolean
});
const emit = defineEmits(['update:modelValue', 'submit']);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const valid = ref(false);
const form = ref(null);

// 3. --- KHỞI TẠO SAU KHI ĐÃ CÓ defaultItem ---
const localItem = ref({ ...defaultItem });

const isEdit = computed(() => !!props.item?.id);

watch(() => props.item, (val) => {
  localItem.value = val ? { ...val } : { ...defaultItem };
}, { immediate: true });

const close = () => {
  dialog.value = false;
  localItem.value = { ...defaultItem };
  if(form.value) form.value.resetValidation();
};

const save = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    emit('submit', localItem.value);
  }
};
</script>