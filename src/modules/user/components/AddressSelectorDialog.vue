<template>
  <v-dialog v-model="dialog" max-width="600px" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Chọn địa chỉ nhận hàng</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      
      <v-card-text style="max-height: 400px" class="pa-0">
        <div v-if="loading" class="text-center py-8">
           <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        
        <v-list v-else lines="two" class="py-0">
           <v-list-item
             v-for="addr in addresses"
             :key="addr.id"
             @click="select(addr)"
             :active="false"
             class="py-3 border-bottom"
             hover
           >
             <template v-slot:prepend>
                <v-icon :color="addr.isDefault ? 'primary' : 'grey'" class="mt-1">mdi-map-marker</v-icon>
             </template>
             
             <v-list-item-title class="font-weight-bold d-flex align-center">
                {{ addr.receiverName }} 
                <v-divider vertical class="mx-2 my-1"></v-divider> 
                {{ addr.receiverPhone }}
                <v-chip v-if="addr.isDefault" size="x-small" color="primary" class="ms-2" label>Mặc định</v-chip>
             </v-list-item-title>
             
             <v-list-item-subtitle class="mt-1 text-body-2 text-wrap">
                {{ addr.streetAddress }}, {{ addr.ward }}, {{ addr.district }}, {{ addr.province }}
             </v-list-item-subtitle>
             
             <template v-slot:append>
                <v-btn variant="tonal" size="small" color="primary" class="ms-2">Chọn</v-btn>
             </template>
           </v-list-item>

           <div v-if="addresses.length === 0" class="text-center py-8">
              <div class="text-grey mb-2">Sổ địa chỉ trống</div>
              <v-btn variant="text" color="primary" to="/profile">Thêm địa chỉ mới</v-btn>
           </div>
        </v-list>
      </v-card-text>
      
      <v-divider></v-divider>
      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="primary" variant="text" to="/addresses" target="_blank">Quản lý địa chỉ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAddressStore } from '../store/address.store';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'select']);
const addressStore = useAddressStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const addresses = computed(() => addressStore.addresses);
const loading = computed(() => addressStore.isLoading);

// Khi dialog mở, nếu chưa có data thì fetch
watch(dialog, (val) => {
    if(val && addresses.value.length === 0) {
        addressStore.fetchAddresses();
    }
});

const select = (addr) => {
   emit('select', addr);
   dialog.value = false;
};
</script>