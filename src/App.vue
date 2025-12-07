<template>
  <v-app>
    <router-view />

    <v-snackbar
      v-model="appStore.snackbar.show"
      :color="appStore.snackbar.color"
      :timeout="appStore.snackbar.timeout"
      location="top right"
      variant="elevated"
    >
      {{ appStore.snackbar.message }}
      
      <template v-slot:actions>
        <v-btn variant="text" icon="mdi-close" @click="appStore.snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useAppStore } from '@/store/app.store';

const appStore = useAppStore();
</script>

<style>
/* Global CSS (nếu cần) */
html { overflow-y: auto !important; } /* Tránh lỗi 2 thanh scrollbar */
</style>