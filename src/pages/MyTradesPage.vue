<template>
  <q-page class="q-pa-lg">
    <div class="q-gutter-lg q-mb-lg">
      <div class="text-h4">Minhas trocas</div>
      <q-btn color="primary" label="Solicitar troca" @click="openCreateTradeDialog" />
    </div>

    <div v-if="loading" class="text-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="trades.length === 0" class="text-center q-my-lg text-grey">
      Nenhuma troca encontrada
    </div>

    <div v-else class="q-gutter-md">
      <q-card v-for="trade in trades" :key="trade.id" class="q-mb-md" bordered>
        <q-card-section class="bg-blue-grey-1">
          <div class="row items-center">
            <div class="text-h6">Troca #{{ trade.id.slice(-8) }}</div>
            <q-space />
            <div class="text-caption text-grey-7">
              {{ formatDate(trade.createdAt) }}
            </div>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              size="sm"
              class="q-ml-sm"
              @click="confirmDeleteTrade(trade.id)"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-lg">
            <div class="row items-center q-mb-md">
              <q-icon name="arrow_upward" color="positive" size="md" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-medium">Cartas que você oferece</div>
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
              <div class="text-subtitle1 text-weight-medium">Cartas que você solicita</div>
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

        <q-separator />

        <q-card-section class="bg-grey-1">
          <div class="row items-center">
            <q-icon name="person" size="sm" class="q-mr-sm" />
            <div class="text-caption">
              Solicitada por: <strong>{{ trade.user.name }}</strong>
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
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { getTrades, deleteTrade } from 'src/services/api/trades';
import CreateTradeDialog from 'src/components/dialogs/CreateTradeDialog.vue';
import type { Trade } from 'src/services/api/trades';

const $q = useQuasar();
const authStore = useAuthStore();
const allTrades = ref<Trade[]>([]);
const currentPage = ref(1);
const hasMore = ref(false);
const loading = ref(false);
const loadingMore = ref(false);

const trades = computed(() => {
  if (!authStore.user) return [];
  return allTrades.value.filter((trade) => trade.userId === authStore.user?.id);
});

const fetchTrades = async (page: number = 1, append: boolean = false) => {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    const response = await getTrades(page, 10);
    const newTrades = response.data.list;

    if (append) {
      allTrades.value.push(...newTrades);
    } else {
      allTrades.value = newTrades;
    }

    hasMore.value = response.data.more;
    currentPage.value = page;
  } catch (error) {
    console.error('Error fetching trades:', error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMoreTrades = () => {
  fetchTrades(currentPage.value + 1, true).catch((error) => {
    console.error('Error loading more trades:', error);
  });
};

const openCreateTradeDialog = () => {
  $q.dialog({
    component: CreateTradeDialog,
  }).onOk(() => {
    fetchTrades(1, false).catch((error) => {
      console.error('Error refreshing trades:', error);
    });
  });
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

const confirmDeleteTrade = (tradeId: string) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir esta troca? Esta ação não pode ser desfeita.',
    cancel: {
      label: 'Cancelar',
      color: 'primary',
      flat: true,
    },
    ok: {
      label: 'Excluir',
      color: 'negative',
    },
    persistent: true,
  }).onOk(() => {
    void deleteTradeById(tradeId);
  });
};

const deleteTradeById = async (tradeId: string) => {
  try {
    await deleteTrade(tradeId);
    $q.notify({
      type: 'positive',
      message: 'Troca excluída com sucesso!',
    });
    // Remove a trade da lista local
    allTrades.value = allTrades.value.filter((trade) => trade.id !== tradeId);
  } catch (error) {
    console.error('Error deleting trade:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao excluir a troca. Tente novamente.',
    });
  }
};

onMounted(() => {
  fetchTrades().catch((error) => {
    console.error('Error loading trades:', error);
  });
});
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
