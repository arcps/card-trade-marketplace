<template>
  <q-card class="q-mb-md" bordered>
    <q-card-section class="bg-blue-grey-1">
      <div class="row items-center">
        <div class="text-subtitle text-weight-medium">
          {{ t('labels.tradeBy') }}: <strong>{{ trade.user.name }}</strong>
        </div>

        <q-space />

        <div class="text-caption text-grey-7">
          {{ formatDate(trade.createdAt) }}
        </div>
        <q-btn
          v-if="canDelete"
          flat
          round
          dense
          icon="delete"
          color="negative"
          size="sm"
          class="q-ml-sm"
          @click="deleteTrade"
        />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <!-- Offered -->
      <div class="q-mb-lg">
        <div class="row items-center q-mb-md">
          <q-icon name="arrow_upward" color="positive" size="md" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-medium">
            {{ t('labels.offeredCards') }}
          </div>
        </div>

        <div class="row q-gutter-sm wrap">
          <TradeCardItem v-for="card in offeredCards" :key="card.id" :card="card" />
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <!-- Requested -->
      <div>
        <div class="row items-center q-mb-md">
          <q-icon name="arrow_downward" color="info" size="md" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-medium">
            {{ t('labels.requestedCards') }}
          </div>
        </div>

        <div class="row q-gutter-sm wrap">
          <TradeCardItem v-for="card in requestedCards" :key="card.id" :card="card" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Trade } from 'src/services/api/trades';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import TradeCardItem from 'components/tradeCardItem.vue';

const props = defineProps<{
  trade: Trade;
  canDelete?: boolean;
}>();

const emit = defineEmits<{
  delete: [id: string];
}>();

const offeredCards = computed(() =>
  props.trade.tradeCards.filter((tc) => tc.type === 'OFFERING').map((tc) => tc.card),
);

const requestedCards = computed(() =>
  props.trade.tradeCards.filter((tc) => tc.type === 'RECEIVING').map((tc) => tc.card),
);

function deleteTrade() {
  emit('delete', props.trade.id);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR');
}
</script>
