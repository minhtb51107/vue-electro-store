<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Quản lý Danh mục
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">Thêm mới</v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="taxonomyStore.flattenCategories" 
      :loading="taxonomyStore.isLoading"
      items-per-page="-1" 
      hide-default-footer
    >
      <template v-slot:item.name="{ item }">
        <div :style="{ marginLeft: (item.level * 20) + 'px' }">
           <v-icon v-if="item.level > 0" icon="mdi-subdirectory-arrow-right" size="small" class="me-1 text-grey"></v-icon>
           <span :class="item.level === 0 ? 'font-weight-bold' : ''">{{ item.name }}</span>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="openDialog(item)">mdi-pencil</v-icon>
        <v-icon size="small" color="error" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <CategoryFormDialog
      v-model="showDialog"
      :item="editedItem"
      :loading="isSubmitting"
      @submit="handleSubmit"
    />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaxonomyStore } from '../store/taxonomy.store';
import CategoryFormDialog from './CategoryFormDialog.vue';

const taxonomyStore = useTaxonomyStore();

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Tên danh mục', key: 'name' },
  { title: 'Slug', key: 'slug' },
  { title: 'Hành động', key: 'actions', align: 'end', sortable: false },
];

const showDialog = ref(false);
const editedItem = ref(null);
const isSubmitting = ref(false);

onMounted(() => {
  taxonomyStore.fetchCategories();
});

const openDialog = (item = null) => {
  editedItem.value = item;
  showDialog.value = true;
};

const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  const result = formData.id 
    ? await taxonomyStore.updateCategory(formData.id, formData)
    : await taxonomyStore.createCategory(formData);
  
  isSubmitting.value = false;
  if (result.success) showDialog.value = false;
  else alert(result.message);
};

const deleteItem = async (item) => {
  if (confirm(`Xóa danh mục "${item.name}"?`)) {
    const res = await taxonomyStore.deleteCategory(item.id);
    if (!res.success) alert(res.message);
  }
};
</script>