<template>
  <q-layout view="hHh lpr lFf">
    <MainHeader :links="linksList" @toggleLeftDrawer="toggleLeftDrawer" />

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-grey-1">
      <MainDrawer :links="linksList" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MainHeader from 'components/MainHeader.vue';
import MainDrawer from 'components/MainDrawer.vue';
import { linksList } from 'src/constants/navigation';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
