<template>
  <v-chip :color="color" size="small" label class="font-weight-bold">
    {{ label }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['status']);

const statusMap = {
  PENDING: { color: 'warning', label: 'Chờ xử lý' },
  PROCESSING: { color: 'info', label: 'Đang xử lý' },
  SHIPPED: { color: 'primary', label: 'Đang giao' },
  DELIVERED: { color: 'success', label: 'Đã giao hàng' },
  CANCELLED: { color: 'error', label: 'Đã hủy' },
  RETURNED: { color: 'grey', label: 'Trả hàng' }
};

const color = computed(() => statusMap[props.status]?.color || 'default');
const label = computed(() => statusMap[props.status]?.label || props.status);
</script>