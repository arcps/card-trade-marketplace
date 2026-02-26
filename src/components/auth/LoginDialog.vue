<script setup lang="ts">
import { ref } from 'vue';

const modelValue = defineModel<boolean>({ default: false });

const email = ref('');
const password = ref('');

function submit() {
  console.log(email.value, password.value);
  modelValue.value = false;
}
</script>

<template>
  <q-dialog v-model="modelValue">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="email" label="Email" type="email" />
        <q-input v-model="password" label="Password" type="password" class="q-mt-md" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Login" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
