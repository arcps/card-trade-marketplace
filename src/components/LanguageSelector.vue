<template>
  <q-btn-dropdown flat round icon="language" size="sm" class="q-ml-sm">
    <q-list>
      <q-item
        v-for="lang in languages"
        :key="lang.code"
        clickable
        @click="setLocale(lang.code)"
        :class="{ 'text-primary': $i18n.locale === lang.code }"
      >
        <q-item-section>
          {{ lang.name }}
        </q-item-section>
        <q-item-section side v-if="$i18n.locale === lang.code">
          <q-icon name="check" color="primary" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const languages = computed(() => [
  { code: 'pt-BR', name: t('languages.portuguese') },
  { code: 'en-US', name: t('languages.english') },
]);

const setLocale = (newLocale: string) => {
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};
</script>
