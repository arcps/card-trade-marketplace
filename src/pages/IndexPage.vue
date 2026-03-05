<template>
  <q-page class="q-pa-lg">
    <div class="q-gutter-lg q-mb-lg">
      <div class="text-h4">{{ t('labels.allTrades') }}</div>
    </div>

    <div v-if="isLoading" class="text-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="trades.length === 0" class="text-center q-my-lg text-grey">
      {{ t('status.noTrades') }}
    </div>

    <div v-else class="q-gutter-md">
      <TradeCard v-for="trade in trades" :key="trade.id" :trade="trade" />

      <div v-if="hasMore" class="flex justify-center q-mt-lg">
        <q-btn flat color="primary" label="Carregar mais" @click="loadMoreTrades" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getTrades } from 'src/services/api/trades';
import type { Trade } from 'src/services/api/trades';
import { useI18n } from 'vue-i18n';
import TradeCard from 'components/tradeCard.vue';

const { t } = useI18n();

const currentPage = ref(1);
const rpp = 10;
const allTrades = ref<Trade[]>([]);

const queryKey = computed(() => ['trades', currentPage.value, rpp]);

const { isLoading } = useQuery({
  queryKey,
  queryFn: async () => {
    const response = await getTrades(currentPage.value, rpp);
    if (currentPage.value === 1) {
      allTrades.value = response.data.list;
    } else {
      allTrades.value.push(...response.data.list);
    }
    hasMore.value = response.data.more;
    return response.data;
  },
});

const hasMore = ref(false);

const trades = computed(() => allTrades.value);

const loadMoreTrades = () => {
  currentPage.value += 1;
};
</script>

<style scoped>
.trade-card {
  width: 80px;
  min-height: 130px;
}
</style>
