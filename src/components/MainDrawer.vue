<template>
  <q-list>
    <q-item-label header> Navegue pelo site </q-item-label>

    <q-item v-for="link in links" :key="link.label" clickable v-ripple :to="link.to">
      <q-item-section avatar>
        <q-icon :name="link.icon" />
      </q-item-section>
      <q-item-section> {{ link.label }} </q-item-section>
    </q-item>

    <q-separator spaced />

    <template v-if="!authStore.isAuthenticated">
      <q-item clickable v-ripple to="/login">
        <q-item-section avatar>
          <q-icon name="login" />
        </q-item-section>
        <q-item-section>Entrar</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/register">
        <q-item-section avatar>
          <q-icon name="person_add" />
        </q-item-section>
        <q-item-section>Registrar</q-item-section>
      </q-item>
    </template>

    <template v-else>
      <q-item-label header> Minha Conta ({{ authStore.user?.name }}) </q-item-label>
      <q-item clickable v-ripple to="/my-cards">
        <q-item-section avatar>
          <q-icon name="style" />
        </q-item-section>
        <q-item-section>Minhas cartas</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/my-trades">
        <q-item-section avatar>
          <q-icon name="swap_horiz" />
        </q-item-section>
        <q-item-section>Minhas trocas</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="onLogout">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>Deslogar</q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';

defineProps<{
  links: { label: string; icon: string; to: string }[];
}>();

const authStore = useAuthStore();
const router = useRouter();

async function onLogout() {
  authStore.logout();
  await router.push('/login');
}
</script>
