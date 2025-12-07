<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        {{ isEdit ? 'Cập nhật Voucher' : 'Tạo Voucher mới' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field v-model="localItem.code" label="Mã Voucher (VD: TET2025)" variant="outlined" :rules="[req]" class="text-uppercase"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="localItem.discountType" :items="['PERCENTAGE', 'FIXED_AMOUNT']" label="Loại giảm giá" variant="outlined"></v-select>
            </v-col>
            
            <v-col cols="12">
              <v-text-field v-model="localItem.description" label="Mô tả chương trình" variant="outlined" :rules="[req]"></v-text-field>
            </v-col>

            <v-col cols="6">
               <v-text-field 
                 v-model.number="localItem.discountValue" 
                 type="number" 
                 :label="localItem.discountType === 'PERCENTAGE' ? 'Giá trị (%)' : 'Số tiền giảm (VND)'" 
                 variant="outlined" 
                 :rules="[req]"
               ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="localItem.discountType === 'PERCENTAGE'">
               <v-text-field v-model.number="localItem.maxDiscountAmount" type="number" label="Giảm tối đa (VND)" variant="outlined"></v-text-field>
            </v-col>

            <v-col cols="6">
               <v-text-field v-model.number="localItem.minOrderAmount" type="number" label="Đơn tối thiểu (VND)" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="6">
               <v-text-field v-model.number="localItem.usageLimit" type="number" label="Giới hạn lượt dùng (0 = Vô hạn)" variant="outlined"></v-text-field>
            </v-col>

            <v-col cols="6">
               <div class="text-caption mb-1">Ngày bắt đầu</div>
               <v-text-field v-model="localItem.startDate" type="datetime-local" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="6">
               <div class="text-caption mb-1">Ngày kết thúc</div>
               <v-text-field v-model="localItem.endDate" type="datetime-local" variant="outlined" density="compact"></v-text-field>
            </v-col>

            <v-col cols="12">
               <v-switch v-model="localItem.active" color="success" label="Kích hoạt ngay"></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialog = false">Hủy</v-btn>
        <v-btn color="primary" variant="elevated" @click="save" :loading="loading">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({ modelValue: Boolean, item: Object, loading: Boolean });
const emit = defineEmits(['update:modelValue', 'submit']);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const localItem = ref({});
const isEdit = computed(() => !!props.item?.id);
const req = v => !!v || 'Bắt buộc';
const form = ref(null);

watch(() => props.item, (val) => {
  if (val) {
      localItem.value = { ...val };
      // Convert ISO string to datetime-local format (yyyy-MM-ddThh:mm)
      if(val.startDate) localItem.value.startDate = val.startDate.slice(0, 16);
      if(val.endDate) localItem.value.endDate = val.endDate.slice(0, 16);
  } else {
      localItem.value = { 
          discountType: 'PERCENTAGE', active: true, usageLimit: 0, 
          discountValue: 0, minOrderAmount: 0 
      };
  }
}, { immediate: true });

const save = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
      // Chuyển đổi data nếu cần thiết (ví dụ thêm timezone cho date)
      // Backend nhận OffsetDateTime, frontend gửi ISO string là OK
      const payload = { ...localItem.value };
      if (payload.startDate) payload.startDate = new Date(payload.startDate).toISOString();
      if (payload.endDate) payload.endDate = new Date(payload.endDate).toISOString();
      emit('submit', payload);
  }
};
</script>