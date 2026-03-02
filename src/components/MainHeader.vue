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

      <div class="gt-sm row items-center no-wrap">
        <q-btn stretch flat icon="storefront" :label="t('nav.home')" to="'/'" />

        <q-separator vertical spaced />

        <template v-if="!authStore.isAuthenticated">
          <q-btn stretch flat :label="t('nav.login')" to="/login" icon="login" />
          <q-btn stretch flat :label="t('nav.register')" to="/register" icon="person_add" />
        </template>

        <q-btn-dropdown
          v-else
          stretch
          flat
          :label="authStore.user?.name || 'Minha conta'"
          icon="account_circle"
        >
          <q-list>
            <q-item clickable v-close-popup to="/my-cards">
              <q-item-section avatar>
                <q-icon name="style" />
              </q-item-section>
              <q-item-section>{{ t('nav.myCards') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/my-trades">
              <q-item-section avatar>
                <q-icon name="swap_horiz" />
              </q-item-section>
              <q-item-section>{{ t('nav.myTrades') }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>{{ t('nav.logout') }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <LanguageSelector />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import LanguageSelector from 'components/LanguageSelector.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineEmits(['toggleLeftDrawer']);

const authStore = useAuthStore();
const router = useRouter();

async function onLogout() {
  authStore.logout();
  await router.push('/login');
}
</script>
