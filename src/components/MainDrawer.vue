<template>
  <q-list>
    <q-item-label header> Navegue pelo site </q-item-label>

    <q-item v-for="link in links" :key="link.label" clickable v-ripple :to="link.to">
      <q-item-section avatar>
        <q-icon :name="link.icon" />
      </q-item-section>
      <q-item-section> {{ link.label }} </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
defineProps<{
  links: { label: string; icon: string; to: string }[];
}>();
</script>
