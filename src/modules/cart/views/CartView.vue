<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-1">Giỏ hàng của bạn</h1>
    <p class="text-grey mb-8">{{ cartStore.totalItems }} sản phẩm trong giỏ hàng</p>

    <div v-if="cartStore.isLoading && cartStore.items.length === 0" class="text-center py-16">
       <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="cartStore.items.length === 0" class="text-center py-16 bg-white rounded-xl border border-dashed">
       <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-cart-off</v-icon>
       <h2 class="text-h6 font-weight-bold text-grey-darken-2">Giỏ hàng đang trống</h2>
       <p class="text-grey mb-6">Hãy dạo một vòng xem có gì ưng ý không nhé!</p>
       <v-btn color="primary" size="large" to="/" class="px-8">Tiếp tục mua sắm</v-btn>
    </div>

    <v-row v-else>
      <v-col cols="12" lg="8">
        <div class="d-flex flex-column gap-4">
          <v-card 
             v-for="item in cartStore.items" 
             :key="item.productVariantId" 
             class="rounded-lg border-0 shadow-soft pa-4 d-flex align-center"
          >
             <div class="rounded border bg-grey-lighten-5 flex-shrink-0" style="width: 100px; height: 100px;">
                <v-img :src="item.thumbnailUrl || 'https://via.placeholder.com/100'" cover height="100%"></v-img>
             </div>

             <div class="ms-4 flex-grow-1">
                <div class="d-flex justify-space-between align-start">
                   <div>
                      <h3 class="text-subtitle-1 font-weight-bold mb-1 cursor-pointer hover-primary">
                         {{ item.productName }}
                      </h3>
                      <div class="text-caption text-grey">
                         SKU: {{ item.sku }} 
                         <span v-if="item.color" class="ms-2">• {{ item.color }}</span>
                      </div>
                   </div>
                   <v-btn icon="mdi-close" variant="text" density="compact" color="grey" @click="removeItem(item)"></v-btn>
                </div>

                <div class="d-flex justify-space-between align-end mt-3">
                   <div class="d-flex align-center border rounded" style="height: 32px;">
                      <v-btn icon="mdi-minus" variant="text" density="compact" size="small" :disabled="item.quantity <= 1" @click="updateQty(item, -1)"></v-btn>
                      <span class="text-body-2 font-weight-bold px-2" style="min-width: 24px; text-align: center;">{{ item.quantity }}</span>
                      <v-btn icon="mdi-plus" variant="text" density="compact" size="small" @click="updateQty(item, 1)"></v-btn>
                   </div>
                   
                   <div class="text-end">
                      <div class="text-subtitle-1 font-weight-bold text-primary">{{ formatCurrency(item.lineTotal) }}</div>
                      <div class="text-caption text-grey" v-if="item.quantity > 1">{{ formatCurrency(item.price) }} / cái</div>
                   </div>
                </div>
             </div>
          </v-card>
        </div>
      </v-col>

      <v-col cols="12" lg="4">
         <v-card class="rounded-lg shadow-soft border-0 pa-5 position-sticky" style="top: 100px;">
            <h3 class="text-h6 font-weight-bold mb-4">Tóm tắt đơn hàng</h3>
            
            <div class="d-flex justify-space-between mb-2 text-body-2">
               <span class="text-grey">Tạm tính</span>
               <span class="font-weight-bold">{{ formatCurrency(cartStore.totalPrice) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-4 text-body-2">
               <span class="text-grey">Phí vận chuyển</span>
               <span class="text-green font-weight-bold">Miễn phí</span>
            </div>
            
            <v-divider class="mb-4"></v-divider>
            
            <div class="d-flex justify-space-between align-center mb-6">
               <span class="text-subtitle-1 font-weight-bold">Tổng cộng</span>
               <span class="text-h5 font-weight-bold text-primary">{{ formatCurrency(cartStore.totalPrice) }}</span>
            </div>
            
            <v-btn block color="accent" size="x-large" height="56" to="/checkout" class="text-white font-weight-bold shadow-soft">
               Tiến hành đặt hàng
            </v-btn>
            
            <div class="d-flex align-center justify-center mt-4 text-caption text-grey">
               <v-icon icon="mdi-shield-check" size="small" class="me-1"></v-icon>
               Thanh toán bảo mật 100%
            </div>
         </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// ... (Giữ nguyên logic script) ...
import { onMounted } from 'vue';
import { useCartStore } from '../store/cart.store';

const cartStore = useCartStore();

onMounted(() => {
   cartStore.fetchCart();
});

const updateQty = (item, change) => {
   const newQty = item.quantity + change;
   if (newQty > 0) {
      cartStore.updateItemQuantity(item.productVariantId, newQty);
   }
};

const removeItem = (item) => {
   if (confirm('Bạn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      cartStore.removeItem(item.productVariantId);
   }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>