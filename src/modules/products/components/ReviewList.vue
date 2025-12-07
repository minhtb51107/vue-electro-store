<template>
  <div class="mt-8">
    <h3 class="text-h6 font-weight-bold mb-4">Đánh giá sản phẩm</h3>

    <div class="d-flex align-center mb-6 bg-grey-lighten-4 pa-4 rounded">
       <div class="text-center me-6">
          <div class="text-h3 font-weight-bold text-primary">{{ averageRating }}</div>
          <v-rating :model-value="averageRating" color="amber" density="compact" readonly half-increments></v-rating>
          <div class="text-caption text-grey">{{ totalReviews }} nhận xét</div>
       </div>
       <v-divider vertical class="mx-4"></v-divider>
       <div>
          <v-btn color="primary" @click="showDialog = true">Viết đánh giá</v-btn>
       </div>
    </div>

    <div v-for="review in reviews" :key="review.id" class="mb-4 border-bottom pb-4">
       <div class="d-flex justify-space-between">
          <div class="d-flex align-center">
             <v-avatar color="grey-lighten-2" size="32" class="me-2">
                <v-img v-if="review.userAvatar" :src="review.userAvatar"></v-img>
                <span v-else>{{ review.userName.charAt(0) }}</span>
             </v-avatar>
             <span class="font-weight-bold text-body-2">{{ review.userName }}</span>
          </div>
          <span class="text-caption text-grey">{{ formatDate(review.createdAt) }}</span>
       </div>
       
       <div class="ms-10 mt-1">
          <v-rating :model-value="review.rating" color="amber" density="compact" size="small" readonly></v-rating>
          <div class="text-body-2 mt-2">{{ review.comment }}</div>
          
          <div v-if="review.images && review.images.length > 0" class="d-flex mt-2 gap-2">
             <v-img 
               v-for="(img, idx) in review.images" 
               :key="idx" 
               :src="img" 
               width="60" 
               height="60" 
               cover 
               class="rounded cursor-pointer"
               @click="previewImage(img)"
             ></v-img>
          </div>
       </div>
    </div>
    
    <v-dialog v-model="showDialog" max-width="500">
       <v-card>
          <v-card-title>Viết đánh giá</v-card-title>
          <v-card-text>
             <v-form @submit.prevent="submitReview">
                <div class="text-center mb-4">
                   <div class="text-caption mb-1">Bạn cảm thấy sản phẩm thế nào?</div>
                   <v-rating v-model="newReview.rating" color="amber" hover size="large"></v-rating>
                </div>
                <v-textarea 
                   v-model="newReview.comment" 
                   label="Chia sẻ cảm nhận của bạn..." 
                   variant="outlined"
                   rows="3"
                ></v-textarea>
                <v-btn block color="primary" type="submit" :loading="submitting">Gửi đánh giá</v-btn>
             </v-form>
          </v-card-text>
       </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'; // <-- Thêm watch
import reviewService from '../services/review.service';

const props = defineProps(['productId', 'averageRating', 'reviewCount']);
const emit = defineEmits(['review-submitted']);

const reviews = ref([]);
const totalReviews = ref(0);
const showDialog = ref(false);
const submitting = ref(false);

const newReview = reactive({ rating: 5, comment: '' });

onMounted(() => {
  if (props.productId) fetchReviews();
});

// --- FIX: Reactivity khi đổi sản phẩm ---
watch(() => props.productId, (newId) => {
  if (newId) {
    fetchReviews();
    // Reset form
    newReview.rating = 5;
    newReview.comment = '';
  }
});
// ----------------------------------------

const fetchReviews = async () => {
  try {
     const res = await reviewService.getByProduct(props.productId, { size: 5 });
     reviews.value = res.content;
     totalReviews.value = res.totalElements;
  } catch (e) { console.error(e); }
};

const submitReview = async () => {
  submitting.value = true;
  try {
     await reviewService.create({
        productId: props.productId,
        rating: newReview.rating,
        comment: newReview.comment,
        imageUrls: [] // Tạm thời rỗng
     });
     showDialog.value = false;
     alert("Cảm ơn bạn đã đánh giá!");
     fetchReviews(); 
     emit('review-submitted');
  } catch (err) {
     alert(err.message);
  } finally {
     submitting.value = false;
  }
};

const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');
</script>