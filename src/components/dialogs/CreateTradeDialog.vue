<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 90vw; max-width: 800px; max-height: 90vh">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Solicitar troca</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-card-section style="max-height: calc(90vh - 120px); overflow-y: auto">
        <q-tabs v-model="activeTab" class="text-grey-8">
          <q-tab name="my-cards" label="Minhas cartas" />
          <q-tab name="system-cards" label="Cartas do sistema" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="my-cards">
            <div class="q-mt-md">
              <div class="text-subtitle1 q-mb-md">Selecione as cartas que você quer oferecer:</div>
              <CardList
                :cards="myCards"
                :clickable="true"
                :multiple="true"
                :selected="selectedOfferedCards"
                :columns="'col-xs-12 col-sm-3 col-md-2'"
                @card-click="toggleOfferedCard"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="system-cards">
            <div class="q-mt-md">
              <div class="text-subtitle1 q-mb-md">Selecione as cartas que você quer solicitar:</div>
              <div v-if="loadingSystemCards" class="text-center q-my-lg">
                <q-spinner color="primary" size="2em" />
              </div>
              <CardList
                v-else
                :cards="systemCards"
                :clickable="true"
                :multiple="true"
                :selected="selectedRequestedCards"
                :columns="'col-xs-12 col-sm-3 col-md-2'"
                @card-click="toggleRequestedCard"
              />
              <div v-if="hasMoreSystemCards" class="flex justify-center q-mt-lg">
                <q-btn
                  flat
                  color="primary"
                  label="Carregar mais"
                  size="sm"
                  @click="loadMoreSystemCards"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="onDialogCancel" />
        <q-btn
          color="primary"
          label="Solicitar troca"
          :disabled="selectedOfferedCards.length === 0 || selectedRequestedCards.length === 0"
          @click="submitTrade"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { getMyCards, getAvailableCards } from 'src/services/api/cards';
import { createTrade } from 'src/services/api/trades';
import CardList from 'src/components/CardList.vue';
import type { Card } from 'src/models/cards';

defineEmits<{
  ok: [];
}>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const $q = useQuasar();

const activeTab = ref('my-cards');
const myCards = ref<Card[]>([]);
const systemCards = ref<Card[]>([]);
const selectedOfferedCards = ref<string[]>([]);
const selectedRequestedCards = ref<string[]>([]);
const loadingSystemCards = ref(false);
const systemCardsPage = ref(1);
const hasMoreSystemCards = ref(false);

const loadMyCards = async () => {
  try {
    const response = await getMyCards();
    myCards.value = response.data;
  } catch (error) {
    console.error('Error loading my cards:', error);
  }
};

const loadSystemCards = async (page: number = 1, append: boolean = false) => {
  loadingSystemCards.value = true;
  try {
    const response = await getAvailableCards(page, 10);
    const newCards = response.data.list;

    if (append) {
      systemCards.value.push(...newCards);
    } else {
      systemCards.value = newCards;
    }

    hasMoreSystemCards.value = response.data.more;
    systemCardsPage.value = page;
  } catch (error) {
    console.error('Error loading system cards:', error);
  } finally {
    loadingSystemCards.value = false;
  }
};

const loadMoreSystemCards = () => {
  loadSystemCards(systemCardsPage.value + 1, true).catch((error) => {
    console.error('Error loading more system cards:', error);
  });
};

const toggleOfferedCard = (card: Card) => {
  const index = selectedOfferedCards.value.indexOf(card.id);
  if (index > -1) {
    selectedOfferedCards.value.splice(index, 1);
  } else {
    selectedOfferedCards.value.push(card.id);
  }
};

const toggleRequestedCard = (card: Card) => {
  const index = selectedRequestedCards.value.indexOf(card.id);
  if (index > -1) {
    selectedRequestedCards.value.splice(index, 1);
  } else {
    selectedRequestedCards.value.push(card.id);
  }
};

const submitTrade = async () => {
  try {
    const cards = [
      ...selectedOfferedCards.value.map((cardId) => ({
        cardId,
        type: 'OFFERING' as const,
      })),
      ...selectedRequestedCards.value.map((cardId) => ({
        cardId,
        type: 'RECEIVING' as const,
      })),
    ];

    await createTrade({ cards });

    $q.notify({
      type: 'positive',
      message: 'Troca solicitada com sucesso!',
      position: 'top',
    });

    onDialogOK();
  } catch (error) {
    console.error('Error creating trade:', error);

    $q.notify({
      type: 'negative',
      message: 'Erro ao solicitar troca. Tente novamente.',
      position: 'top',
    });
  }
};

onMounted(() => {
  loadMyCards().catch((error) => {
    console.error('Error loading my cards:', error);
  });
  loadSystemCards().catch((error) => {
    console.error('Error loading system cards:', error);
  });
});
</script>
