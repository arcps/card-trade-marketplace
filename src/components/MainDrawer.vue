<template>
  <q-list>
    <q-item-label header> {{ t('nav.browse') }} </q-item-label>

    <q-item clickable v-ripple to="/">
      <q-item-section avatar>
        <q-icon :name="'storefront'" />
      </q-item-section>
      <q-item-section> {{ t('nav.home') }} </q-item-section>
    </q-item>

    <q-separator spaced />

    <template v-if="!authStore.isAuthenticated">
      <q-item clickable v-ripple to="/login">
        <q-item-section avatar>
          <q-icon name="login" />
        </q-item-section>
        <q-item-section>{{ t('nav.login') }}</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/register">
        <q-item-section avatar>
          <q-icon name="person_add" />
        </q-item-section>
        <q-item-section>{{ t('nav.register') }}</q-item-section>
      </q-item>
    </template>

    <template v-else>
      <q-item-label header> {{ t('nav.myAccount') }} ({{ authStore.user?.name }}) </q-item-label>
      <q-item clickable v-ripple to="/my-cards">
        <q-item-section avatar>
          <q-icon name="style" />
        </q-item-section>
        <q-item-section>{{ t('nav.myCards') }}</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/my-trades">
        <q-item-section avatar>
          <q-icon name="swap_horiz" />
        </q-item-section>
        <q-item-section>{{ t('nav.myTrades') }}</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="onLogout">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>{{ t('nav.logout') }}</q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const authStore = useAuthStore();
const router = useRouter();

async function onLogout() {
  authStore.logout();
  await router.push('/login');
}
</script>
