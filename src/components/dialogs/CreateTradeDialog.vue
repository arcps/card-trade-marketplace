<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 90vw; max-width: 800px; max-height: 90vh">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ t('dialogs.createTrade') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-card-section style="max-height: calc(90vh - 120px); overflow-y: auto">
        <q-tabs v-model="activeTab" class="text-grey-8">
          <q-tab name="my-cards" :label="t('tabs.myCards')" />
          <q-tab name="system-cards" :label="t('tabs.systemCards')" />
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="my-cards">
            <div class="q-mt-md">
              <div class="text-subtitle1 q-mb-md">{{ t('labels.youOffer') }}</div>
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
              <div class="text-subtitle1 q-mb-md">{{ t('labels.youRequest') }}</div>
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
              <div class="row q-gutter-sm q-mx-none q-mt-lg justify-center">
                <q-btn
                  v-if="systemCardsPage > 1"
                  flat
                  color="primary"
                  :label="t('buttons.previous')"
                  size="sm"
                  @click="loadCards(systemCardsPage - 1)"
                />
                <q-btn
                  v-if="hasMoreSystemCards"
                  flat
                  color="primary"
                  :label="t('buttons.next')"
                  size="sm"
                  @click="loadCards(systemCardsPage + 1)"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="t('buttons.cancel')" @click="onDialogCancel" />
        <q-btn
          color="primary"
          :label="t('buttons.createTrade')"
          :disabled="selectedOfferedCards.length === 0 || selectedRequestedCards.length === 0"
          @click="submitTrade"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { useQuery } from '@tanstack/vue-query';
import { getMyCards, getAvailableCards } from 'src/services/api/cards';
import { createTrade } from 'src/services/api/trades';
import CardList from 'src/components/CardList.vue';
import type { Card } from 'src/models/cards';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineEmits<{
  ok: [];
}>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const $q = useQuasar();

const activeTab = ref('my-cards');
const selectedOfferedCards = ref<string[]>([]);
const selectedRequestedCards = ref<string[]>([]);
const systemCardsPage = ref(1);
const rpp = 10;

const { data: myCardsResponse } = useQuery({
  queryKey: ['myCards'],
  queryFn: () => getMyCards(),
  staleTime: 30 * 1000,
});

const myCards = computed(() => myCardsResponse.value?.data ?? []);

const systemCardsQueryKey = computed(() => ['availableCards', systemCardsPage.value, rpp]);
const { data: systemCardsResponse, isLoading: loadingSystemCards } = useQuery({
  queryKey: systemCardsQueryKey,
  queryFn: () => getAvailableCards(systemCardsPage.value, rpp),
});

const systemCards = computed(() => systemCardsResponse.value?.data?.list ?? []);
const hasMoreSystemCards = computed(() => systemCardsResponse.value?.data?.more ?? false);

const loadCards = (page: number) => {
  systemCardsPage.value = page;
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
</script>
