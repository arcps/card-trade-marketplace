<script setup lang="ts">
import { useDialogStore } from 'src/stores/dialogStore';

const dialogStore = useDialogStore();
</script>

<template>
  <q-dialog v-model="dialogStore.isOpen">
    <component :is="dialogStore.dialogComponent" v-bind="dialogStore.dialogProps" />
  </q-dialog>
</template>
