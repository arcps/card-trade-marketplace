<template>
  <q-page class="q-pa-lg">
    <div class="q-gutter-lg q-mb-lg">
      <div class="text-h4">Todas trocas</div>
    </div>

    <div v-if="isLoading" class="text-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="trades.length === 0" class="text-center q-my-lg text-grey">
      Nenhuma troca disponível
    </div>

    <div v-else class="q-gutter-md">
      <q-card v-for="trade in trades" :key="trade.id" class="q-mb-md" bordered>
        <q-card-section class="bg-blue-grey-1">
          <div class="row items-center">
            <div class="text-subtitle text-weight-medium">
              Solicitada por: <strong>{{ trade.user.name }}</strong>
            </div>
            <q-space />
            <div class="text-caption text-grey-7">
              {{ formatDate(trade.createdAt) }}
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-lg">
            <div class="row items-center q-mb-md">
              <q-icon name="arrow_upward" color="positive" size="md" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-medium">Cartas oferecidas</div>
            </div>
            <div class="row q-gutter-sm wrap">
              <div v-for="card in getOfferedCards(trade)" :key="card.id" class="col-auto">
                <q-card flat bordered class="trade-card">
                  <q-img
                    :src="card.imageUrl"
                    :alt="card.name"
                    style="width: 80px; height: 110px"
                    fit="cover"
                  >
                    <template v-slot:error>
                      <div class="full-width full-height flex flex-center bg-grey-3">
                        <q-icon name="card_giftcard" size="2rem" color="grey-6" />
                      </div>
                    </template>
                  </q-img>
                  <q-card-section class="q-pa-xs">
                    <div class="text-caption text-center text-weight-medium line-clamp-2">
                      {{ card.name }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <div class="q-mb-lg">
            <div class="row items-center q-mb-md">
              <q-icon name="arrow_downward" color="info" size="md" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-medium">Cartas solicitadas</div>
            </div>
            <div class="row q-gutter-sm wrap">
              <div v-for="card in getRequestedCards(trade)" :key="card.id" class="col-auto">
                <q-card flat bordered class="trade-card">
                  <q-img
                    :src="card.imageUrl"
                    :alt="card.name"
                    style="width: 80px; height: 110px"
                    fit="cover"
                  >
                    <template v-slot:error>
                      <div class="full-width full-height flex flex-center bg-grey-3">
                        <q-icon name="card_giftcard" size="2rem" color="grey-6" />
                      </div>
                    </template>
                  </q-img>
                  <q-card-section class="q-pa-xs">
                    <div class="text-caption text-center text-weight-medium line-clamp-2">
                      {{ card.name }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

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

const getOfferedCards = (trade: Trade) => {
  return trade.tradeCards.filter((tc) => tc.type === 'OFFERING').map((tc) => tc.card);
};

const getRequestedCards = (trade: Trade) => {
  return trade.tradeCards.filter((tc) => tc.type === 'RECEIVING').map((tc) => tc.card);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};
</script>

<style scoped>
.trade-card {
  width: 80px;
  min-height: 130px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>
