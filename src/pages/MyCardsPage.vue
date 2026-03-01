<template>
  <q-page class="q-pa-lg">
    <div class="q-gutter-lg q-mb-lg">
      <div class="text-h4">{{ t('tabs.myCards') }}</div>
      <q-btn
        color="primary"
        :label="t('buttons.addCard')"
        @click="addNewCard"
        :loading="loadingAdd"
      />
    </div>
    <CardList :cards="cards?.data ?? []" :columns="'col-xs-12 col-sm-6 col-md-2'" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { getMyCards, addCard } from 'src/services/api/cards';
import SelectCardDialog from 'src/components/dialogs/SelectCardDialog.vue';
import CardList from 'src/components/CardList.vue';
import type { Card } from 'src/models/cards';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const $q = useQuasar();
const queryClient = useQueryClient();
const loadingAdd = ref(false);

const { data: cards } = useQuery({
  queryKey: ['myCards'],
  queryFn: () => getMyCards(),
});

const addNewCard = () => {
  $q.dialog({
    component: SelectCardDialog,
  }).onOk((selectedCard: Card) => {
    loadingAdd.value = true;
    addCard(selectedCard.id)
      .then(() => {
        void queryClient.invalidateQueries({ queryKey: ['myCards'] });
        $q.notify({
          type: 'positive',
          message: 'Carta adicionada com sucesso!',
          position: 'top',
        });
      })
      .catch((error) => {
        console.error('Error adding card:', error);
        $q.notify({
          type: 'negative',
          message: 'Erro ao adicionar carta. Tente novamente.',
          position: 'top',
        });
      })
      .finally(() => {
        loadingAdd.value = false;
      });
  });
};
</script>
