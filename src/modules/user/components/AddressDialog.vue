<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        {{ isEdit ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="localItem.receiverName" label="Tên người nhận *" variant="outlined" :rules="[req]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="localItem.receiverPhone" label="Số điện thoại *" variant="outlined" :rules="[req]"></v-text-field>
            </v-col>
            
            <v-col cols="12" md="4">
               <v-autocomplete
                 v-model="selectedProvince"
                 :items="provinces"
                 item-title="ProvinceName"
                 item-value="ProvinceID"
                 label="Tỉnh/Thành *"
                 variant="outlined"
                 :rules="[req]"
                 return-object
                 @update:modelValue="onProvinceChange"
                 :loading="loadingLocation"
               ></v-autocomplete>
            </v-col>
            
            <v-col cols="12" md="4">
               <v-autocomplete
                 v-model="selectedDistrict"
                 :items="districts"
                 item-title="DistrictName"
                 item-value="DistrictID"
                 label="Quận/Huyện *"
                 variant="outlined"
                 :rules="[req]"
                 return-object
                 :disabled="!selectedProvince"
                 @update:modelValue="onDistrictChange"
                 :loading="loadingLocation"
               ></v-autocomplete>
            </v-col>
            
            <v-col cols="12" md="4">
               <v-autocomplete
                 v-model="selectedWard"
                 :items="wards"
                 item-title="WardName"
                 item-value="WardCode"
                 label="Phường/Xã *"
                 variant="outlined"
                 :rules="[req]"
                 return-object
                 :disabled="!selectedDistrict"
               ></v-autocomplete>
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="localItem.streetAddress" label="Số nhà, tên đường *" variant="outlined" :rules="[req]"></v-text-field>
            </v-col>
            
            <v-col cols="12">
               <v-checkbox v-model="localItem.isDefault" label="Đặt làm địa chỉ mặc định" color="primary"></v-checkbox>
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
import { ref, computed, watch, onMounted } from 'vue';
import ghnService from '@/modules/common/services/ghn.service';

const props = defineProps({ modelValue: Boolean, item: Object, loading: Boolean });
const emit = defineEmits(['update:modelValue', 'submit']);

const dialog = computed({ get: () => props.modelValue, set: (val) => emit('update:modelValue', val) });
const isEdit = computed(() => !!props.item?.id);
const req = v => !!v || 'Bắt buộc';
const form = ref(null);

const localItem = ref({});
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const loadingLocation = ref(false);

// State tạm để bind vào autocomplete (lưu object {ProvinceID, ProvinceName})
const selectedProvince = ref(null);
const selectedDistrict = ref(null);
const selectedWard = ref(null);

onMounted(() => {
  fetchProvinces();
});

const fetchProvinces = async () => {
  try {
    const res = await ghnService.getProvinces();
    provinces.value = res.data.data;
  } catch (e) { console.error(e); }
};

const onProvinceChange = async (province) => {
  districts.value = [];
  wards.value = [];
  selectedDistrict.value = null;
  selectedWard.value = null;
  if (province) {
    loadingLocation.value = true;
    try {
      const res = await ghnService.getDistricts(province.ProvinceID);
      districts.value = res.data.data;
    } finally { loadingLocation.value = false; }
  }
};

const onDistrictChange = async (district) => {
  wards.value = [];
  selectedWard.value = null;
  if (district) {
    loadingLocation.value = true;
    try {
      const res = await ghnService.getWards(district.DistrictID);
      wards.value = res.data.data;
    } finally { loadingLocation.value = false; }
  }
};

watch(() => props.item, async (val) => {
  if (val && val.id) {
      // Mode Edit: Cần logic phức tạp để map lại ID vào dropdown (Bỏ qua để đơn giản hóa demo, user chọn lại)
      localItem.value = { ...val };
      // Reset dropdown visual (User cần chọn lại nếu muốn sửa)
      selectedProvince.value = null; 
      selectedDistrict.value = null;
      selectedWard.value = null;
  } else {
      // Mode Create
      localItem.value = { receiverName: '', receiverPhone: '', streetAddress: '', isDefault: false };
      selectedProvince.value = null;
      selectedDistrict.value = null;
      selectedWard.value = null;
  }
}, { immediate: true });

const save = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
      // Gán dữ liệu text và ID vào payload
      if(selectedProvince.value) localItem.value.province = selectedProvince.value.ProvinceName;
      if(selectedDistrict.value) {
          localItem.value.district = selectedDistrict.value.DistrictName;
          localItem.value.ghnDistrictId = selectedDistrict.value.DistrictID; // <--- QUAN TRỌNG
      }
      if(selectedWard.value) {
          localItem.value.ward = selectedWard.value.WardName;
          localItem.value.ghnWardCode = selectedWard.value.WardCode; // <--- QUAN TRỌNG
      }
      
      emit('submit', localItem.value);
  }
};
</script>