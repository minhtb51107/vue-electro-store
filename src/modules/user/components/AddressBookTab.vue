<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
       <h3 class="text-h6 font-weight-bold">Địa chỉ đã lưu</h3>
       <v-btn 
          color="black" 
          variant="flat"
          class="rounded-pill px-4 text-capitalize font-weight-bold"
          prepend-icon="mdi-plus" 
          @click="openDialog()"
       >Thêm địa chỉ</v-btn>
    </div>

    <v-progress-linear indeterminate color="black" v-if="addressStore.isLoading" class="mb-4 rounded"></v-progress-linear>

    <div v-else>
       <v-row>
          <v-col cols="12" md="6" v-for="addr in addressStore.addresses" :key="addr.id">
             <v-card class="rounded-xl border-0 shadow-card pa-4 h-100 d-flex flex-column hover-lift">
                <div class="d-flex justify-space-between align-start mb-2">
                   <div class="d-flex align-center">
                      <span class="font-weight-bold text-body-1 me-2">{{ addr.receiverName }}</span>
                      <v-chip v-if="addr.isDefault" color="black" size="x-small" label class="font-weight-bold px-2">Mặc định</v-chip>
                   </div>
                   
                   <v-menu location="bottom end">
                      <template v-slot:activator="{ props }">
                         <v-btn icon="mdi-dots-horizontal" variant="text" density="compact" color="grey" v-bind="props"></v-btn>
                      </template>
                      <v-list density="compact" class="rounded-lg shadow-sm">
                         <v-list-item @click="openDialog(addr)" title="Chỉnh sửa" prepend-icon="mdi-pencil-outline"></v-list-item>
                         <v-list-item @click="deleteAddr(addr)" title="Xóa" prepend-icon="mdi-trash-can-outline" color="error" :disabled="addr.isDefault"></v-list-item>
                      </v-list>
                   </v-menu>
                </div>

                <div class="text-body-2 text-grey-darken-2 mb-1">{{ addr.receiverPhone }}</div>
                <div class="text-body-2 text-grey flex-grow-1">
                   {{ addr.streetAddress }}, {{ addr.ward }}, {{ addr.district }}, {{ addr.province }}
                </div>
             </v-card>
          </v-col>
       </v-row>
       
       <div v-if="addressStore.addresses.length === 0" class="text-center py-12 border border-dashed rounded-xl">
          <v-icon icon="mdi-map-marker-off" size="48" color="grey-lighten-2" class="mb-2"></v-icon>
          <div class="text-grey">Chưa có địa chỉ nào được lưu.</div>
       </div>
    </div>

    <AddressDialog 
       v-model="showDialog" 
       :item="editedItem" 
       :loading="submitting"
       @submit="handleSubmit" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAddressStore } from '../store/address.store';
import AddressDialog from './AddressDialog.vue';

const addressStore = useAddressStore();
const showDialog = ref(false);
const editedItem = ref(null);
const submitting = ref(false);

onMounted(() => { addressStore.fetchAddresses(); });

const openDialog = (item = null) => {
  editedItem.value = item;
  showDialog.value = true;
};

const handleSubmit = async (data) => {
  submitting.value = true;
  let res;
  if (data.id) res = await addressStore.updateAddress(data.id, data);
  else res = await addressStore.createAddress(data);
  submitting.value = false;
  if (res.success) showDialog.value = false;
  else alert(res.message);
};

const deleteAddr = async (item) => {
  if (confirm('Xóa địa chỉ này?')) {
     const res = await addressStore.deleteAddress(item.id);
     if (!res.success) alert(res.message);
  }
};
</script>

<style scoped>
.shadow-card {
    box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important;
    border: 1px solid #f3f4f6 !important;
}
.hover-lift {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08) !important;
}
</style>