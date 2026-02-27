<template>
  <q-page class="row items-center justify-center bg-grey-2">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Acesse sua conta</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            label="Email"
            type="email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Por favor digite seu email',
              (val) => /.+@.+\..+/.test(val) || 'Email inválido',
            ]"
          />

          <q-input
            filled
            v-model="password"
            label="Senha"
            type="password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Por favor digite sua senha']"
          />

          <div class="row justify-between items-center">
            <q-btn label="Entrar" type="submit" color="primary" />
            <q-btn to="/register" label="Criar conta" color="primary" flat />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');

async function onSubmit() {
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Login realizado com sucesso!',
    });
    await router.push('/');
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Email ou senha inválidos.',
    });
  }
}
</script>
