<template>
  <q-page class="q-pa-lg">
    <div class="q-gutter-lg q-mb-lg">
      <div class="text-h4">Minhas cartas</div>
      <q-btn color="primary" label="Adicionar carta" @click="addNewCard" :loading="loadingAdd" />
    </div>
    <CardList :cards="cards" :columns="'col-xs-12 col-sm-6 col-md-2'" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getMyCards, addCard } from 'src/services/api/cards';
import SelectCardDialog from 'src/components/dialogs/SelectCardDialog.vue';
import CardList from 'src/components/CardList.vue';
import type { Card } from 'src/models/cards';

const $q = useQuasar();
const cards = ref<Card[]>([]);
const loadingAdd = ref(false);

const fetchCards = async () => {
  try {
    const response = await getMyCards();
    cards.value = response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

const addNewCard = () => {
  $q.dialog({
    component: SelectCardDialog,
  }).onOk((selectedCard: Card) => {
    loadingAdd.value = true;
    addCard(selectedCard.id)
      .then(() => {
        void fetchCards();
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

onMounted(async () => {
  await fetchCards();
});
</script>
