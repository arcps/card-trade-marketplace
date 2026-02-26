<template>
  <q-header class="bg-orange">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        class="lt-md"
        @click="$emit('toggleLeftDrawer')"
      />

      <q-toolbar-title class="font-archivo"> SwapMyDeck </q-toolbar-title>

      <q-space />

      <div class="gt-sm">
        <q-btn
          v-for="link in links"
          :key="link.label"
          stretch
          flat
          :icon="link.icon"
          :label="link.label"
          :to="link.to"
        />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
defineProps<{
  links: { label: string; icon: string; to: string }[];
}>();

defineEmits(['toggleLeftDrawer']);
</script>
