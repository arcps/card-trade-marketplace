<template>
  <q-page class="row items-center justify-center bg-grey-2">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">{{ t('login.title') }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            :label="t('login.email')"
            type="email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || t('login.typeEmail'),
              (val) => /.+@.+\..+/.test(val) || t('login.typeEmail'),
            ]"
          />

          <q-input
            filled
            v-model="password"
            :label="t('login.password')"
            type="password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || t('login.typePassword')]"
          />

          <div class="row justify-between items-center">
            <q-btn :label="t('login.submit')" type="submit" color="primary" />
            <q-btn to="/register" :label="t('login.signup')" color="primary" flat />
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
      message: t('login.success'),
    });
    await router.push('/');
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: t('login.error'),
    });
  }
}
</script>
