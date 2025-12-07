<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>{{ isEdit ? 'Cập nhật Nhân viên' : 'Thêm Nhân viên mới' }}</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field v-model="localItem.fullname" label="Họ tên *" variant="outlined" :rules="[req]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="localItem.employeeCode" label="Mã NV (VD: NV001) *" variant="outlined" :rules="[req]" :disabled="isEdit"></v-text-field>
            </v-col>
            
            <v-col cols="12" v-if="!isEdit">
              <v-text-field v-model="localItem.email" label="Email đăng nhập *" variant="outlined" :rules="[req, emailRule]"></v-text-field>
            </v-col>
            <v-col cols="12" v-if="!isEdit">
              <v-text-field v-model="localItem.password" label="Mật khẩu *" type="password" variant="outlined" :rules="[req, min6]"></v-text-field>
            </v-col>

            <v-col cols="6">
               <v-text-field v-model="localItem.position" label="Chức vụ" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="6">
               <v-text-field v-model="localItem.department" label="Phòng ban" variant="outlined"></v-text-field>
            </v-col>
            
            <v-col cols="12" v-if="!isEdit"> <v-select
                 v-model="localItem.roleNames"
                 :items="roles"
                 item-title="name"
                 item-value="name"
                 label="Vai trò (Roles) *"
                 multiple
                 chips
                 variant="outlined"
                 :rules="[reqArr]"
               ></v-select>
            </v-col>

            <v-col cols="12">
               <div class="text-caption mb-1">Ngày vào làm</div>
               <v-text-field v-model="localItem.hiredDate" type="date" variant="outlined"></v-text-field>
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
import employeeService from '../services/employee.service';

const props = defineProps({ modelValue: Boolean, item: Object, loading: Boolean });
const emit = defineEmits(['update:modelValue', 'submit']);

const dialog = computed({ get: () => props.modelValue, set: (val) => emit('update:modelValue', val) });
const localItem = ref({});
const isEdit = computed(() => !!props.item?.id);
const roles = ref([]);

const req = v => !!v || 'Bắt buộc';
const reqArr = v => v && v.length > 0 || 'Chọn ít nhất 1 vai trò';
const emailRule = v => /.+@.+\..+/.test(v) || 'Email sai định dạng';
const min6 = v => v && v.length >= 6 || 'Tối thiểu 6 ký tự';
const form = ref(null);

onMounted(async () => {
    // Lấy danh sách Roles từ backend để fill vào dropdown
    try {
        const res = await employeeService.getAllRoles();
        roles.value = res; // List<RoleResponse>
    } catch (e) { console.error(e); }
});

watch(() => props.item, (val) => {
  localItem.value = val ? { ...val } : { roleNames: [], hiredDate: new Date().toISOString().substr(0,10) };
}, { immediate: true });

const save = async () => {
  const { valid } = await form.value.validate();
  if (valid) emit('submit', localItem.value);
};
</script>