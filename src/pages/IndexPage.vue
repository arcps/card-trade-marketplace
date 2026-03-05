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

      <div v-if="hasNextPage" class="flex justify-center q-mt-lg">
        <q-btn flat color="primary" label="Carregar mais" @click="loadMoreTrades" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { getTrades } from 'src/services/api/trades';
import { useI18n } from 'vue-i18n';
import TradeCard from 'components/tradeCard.vue';

const { t } = useI18n();

const rpp = 10;

const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
  queryKey: ['trades'],
  queryFn: async ({ pageParam = 1 }) => {
    const response = await getTrades(pageParam, rpp);
    return response.data;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.more ? allPages.length + 1 : undefined;
  },
});

const trades = computed(() => data.value?.pages.flatMap((page) => page.list) ?? []);

const loadMoreTrades = () => {
  void fetchNextPage();
};
</script>

<style scoped>
.trade-card {
  width: 80px;
  min-height: 130px;
}
</style>
