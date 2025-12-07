<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6 rounded-lg shadow-soft border-0 overflow-visible">
           <v-card-title class="d-flex align-center py-4 px-6 border-b">
              <v-avatar color="primary" size="32" class="me-3 font-weight-bold text-body-2">1</v-avatar>
              <span class="font-weight-bold">Thông tin giao hàng</span>
              <v-spacer></v-spacer>
              <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-book-open-variant" @click="showAddressDialog = true">
                 Chọn từ sổ địa chỉ
              </v-btn>
           </v-card-title>
           <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid">
                 <v-row dense>
                    <v-col cols="12" md="6">
                       <div class="text-caption font-weight-bold mb-1">Họ tên người nhận *</div>
                       <v-text-field 
                          v-model="checkoutForm.customerName" 
                          placeholder="Nguyễn Văn A"
                          variant="outlined" 
                          density="comfortable"
                          :rules="[rules.required]"
                       ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                       <div class="text-caption font-weight-bold mb-1">Số điện thoại *</div>
                       <v-text-field 
                          v-model="checkoutForm.shippingPhone" 
                          placeholder="09xxxxxxxx"
                          variant="outlined"
                          density="comfortable"
                          :rules="[rules.required, rules.phone]"
                       ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                       <div class="text-caption font-weight-bold mb-1">Địa chỉ chi tiết *</div>
                       <v-text-field 
                          v-model="checkoutForm.shippingAddress" 
                          placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành..."
                          variant="outlined"
                          density="comfortable"
                          :rules="[rules.required]"
                       ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                       <div class="text-caption font-weight-bold mb-1">Ghi chú (Tùy chọn)</div>
                       <v-textarea 
                          v-model="checkoutForm.notes" 
                          placeholder="Lời nhắn cho shipper..."
                          variant="outlined" 
                          rows="2"
                          density="comfortable"
                       ></v-textarea>
                    </v-col>
                 </v-row>
              </v-form>
           </v-card-text>
        </v-card>

        <v-card class="mb-6 rounded-lg shadow-soft border-0">
           <v-card-title class="d-flex align-center py-4 px-6 border-b">
              <v-avatar color="primary" size="32" class="me-3 font-weight-bold text-body-2">2</v-avatar>
              <span class="font-weight-bold">Phương thức thanh toán</span>
           </v-card-title>
           <v-card-text class="pa-6">
              <v-radio-group v-model="paymentMethod" hide-details>
                 <v-radio value="COD" class="payment-radio mb-3 border rounded pa-4 w-100" color="primary">
                    <template v-slot:label>
                       <div class="d-flex align-center w-100">
                          <v-icon color="green" size="32" class="me-4">mdi-cash-multiple</v-icon>
                          <div>
                             <div class="font-weight-bold text-body-1">Thanh toán khi nhận hàng (COD)</div>
                             <div class="text-caption text-grey">Bạn chỉ phải thanh toán khi đã nhận được hàng.</div>
                          </div>
                       </div>
                    </template>
                 </v-radio>
                 
                 <v-radio value="VNPAY" class="payment-radio border rounded pa-4 w-100" color="primary">
                    <template v-slot:label>
                       <div class="d-flex align-center w-100">
                          <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" height="32" class="me-4 rounded" />
                          <div>
                             <div class="font-weight-bold text-body-1">Thanh toán qua VNPay</div>
                             <div class="text-caption text-grey">Thẻ ATM / Internet Banking / QR Pay</div>
                          </div>
                       </div>
                    </template>
                 </v-radio>
              </v-radio-group>
           </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
         <v-card class="rounded-lg shadow-soft border-0 position-sticky" style="top: 100px">
            <v-card-title class="font-weight-bold bg-grey-lighten-4 py-3">Đơn hàng của bạn</v-card-title>
            <v-card-text class="pt-4 px-4">
               <div class="d-flex flex-column gap-3 mb-4" style="max-height: 300px; overflow-y: auto;">
                   <div v-for="item in cartStore.items" :key="item.productVariantId" class="d-flex justify-space-between text-body-2">
                      <div class="d-flex">
                          <v-avatar size="40" rounded class="me-2 border bg-white">
                              <v-img :src="item.thumbnailUrl"></v-img>
                          </v-avatar>
                          <div>
                              <div class="font-weight-medium text-truncate" style="max-width: 160px">{{ item.productName }}</div>
                              <div class="text-caption text-grey">x{{ item.quantity }}</div>
                          </div>
                      </div>
                      <div class="font-weight-bold">{{ formatCurrency(item.lineTotal) }}</div>
                   </div>
               </div>
               
               <v-divider class="mb-4"></v-divider>
               
               <v-text-field
                  v-model="checkoutForm.voucherCode"
                  label="Mã giảm giá"
                  placeholder="Nhập mã"
                  variant="outlined"
                  density="compact"
                  append-inner-icon="mdi-ticket-percent"
                  hide-details
                  class="mb-4"
               ></v-text-field>

               <div class="d-flex justify-space-between text-body-2 mb-2">
                  <span class="text-grey">Tạm tính:</span>
                  <span class="font-weight-bold">{{ formatCurrency(cartStore.totalPrice) }}</span>
               </div>
               <div class="d-flex justify-space-between text-body-2 mb-4">
                  <span class="text-h5 font-weight-bold text-primary">{{ formatCurrency(cartStore.totalPrice) }}</span>

<span class="text-h5 font-weight-bold text-primary">{{ formatCurrency(cartStore.totalPrice + cartStore.shippingFee) }}</span>
               </div>
               
               <v-divider class="mb-4"></v-divider>
               
               <div class="d-flex justify-space-between align-center mb-6">
                  <span class="text-subtitle-1 font-weight-bold">Tổng thanh toán</span>
                  <span class="text-h5 font-weight-bold text-primary">{{ formatCurrency(cartStore.totalPrice) }}</span>
               </div>
               
               <v-btn 
                 block 
                 color="accent" 
                 size="x-large" 
                 height="56"
                 class="font-weight-bold text-white shadow-soft"
                 @click="placeOrder"
                 :loading="cartStore.isLoading"
               >
                  {{ paymentMethod === 'VNPAY' ? 'Thanh toán VNPay' : 'Đặt hàng ngay' }}
               </v-btn>
            </v-card-text>
         </v-card>
      </v-col>
    </v-row>

    <AddressSelectorDialog v-model="showAddressDialog" @select="fillAddress" />
  </v-container>
</template>

<script setup>
// ... (Giữ nguyên logic script) ...
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../store/cart.store';
import AddressSelectorDialog from '@/modules/user/components/AddressSelectorDialog.vue';

const router = useRouter();
const cartStore = useCartStore();

const valid = ref(false);
const form = ref(null);
const paymentMethod = ref('COD');
const showAddressDialog = ref(false);

const checkoutForm = reactive({
  customerName: '',
  shippingAddress: '',
  shippingPhone: '',
  notes: '',
  voucherCode: '',
  addressId: null
});

const rules = {
  required: v => !!v || 'Bắt buộc',
  phone: v => /^(0|84)(3|5|7|8|9)([0-9]{8})$/.test(v) || 'SĐT không hợp lệ'
};

const fillAddress = (addr) => {
   checkoutForm.customerName = addr.receiverName;
   checkoutForm.shippingPhone = addr.receiverPhone;
   checkoutForm.shippingAddress = `${addr.streetAddress}, ${addr.ward}, ${addr.district}, ${addr.province}`;
   checkoutForm.addressId = addr.id;
   cartStore.estimateShippingFee(addr);
};

const placeOrder = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  const result = await cartStore.processCheckout(checkoutForm);

  if (result.success) {
     const orderId = result.order.id;
     if (paymentMethod.value === 'VNPAY') {
        await cartStore.payWithVnPay(orderId);
     } else {
        router.push({ name: 'OrderDetail', params: { id: orderId } });
     }
  } else {
     alert('Lỗi đặt hàng: ' + result.message);
  }
};

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
</script>

<style scoped>
.payment-radio {
    transition: all 0.2s ease;
}
.payment-radio:hover {
    border-color: rgb(var(--v-theme-primary)) !important;
    background-color: rgba(var(--v-theme-primary), 0.03);
}
/* CSS để radio active có border xanh */
.v-selection-control--dirty .payment-radio {
    border-color: rgb(var(--v-theme-primary)) !important;
    background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>