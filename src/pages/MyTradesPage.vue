<template>
  <q-page class="q-pa-lg">
    <div class="q-gutter-lg q-mb-lg">
      <div class="text-h4">{{ t('nav.myTrades') }}</div>
      <q-btn color="primary" :label="t('buttons.createTrade')" @click="openCreateTradeDialog" />
    </div>

    <div v-if="loading" class="text-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="trades.length === 0" class="text-center q-my-lg text-grey">
      {{ t('status.noTrades') }}
    </div>

    <div v-else class="q-gutter-md">
      <TradeCard
        v-for="trade in trades"
        :key="trade.id"
        :trade="trade"
        :canDelete="true"
        @delete="confirmDeleteTrade"
      />

      <div v-if="hasMore" class="flex justify-center q-mt-lg">
        <q-btn flat color="primary" :label="t('buttons.loadMore')" @click="loadMoreTrades" />
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
import TradeCard from 'components/tradeCard.vue';
import type { Trade } from 'src/services/api/trades';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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

const confirmDeleteTrade = (tradeId: string) => {
  $q.dialog({
    title: t('dialogs.confirmDelete'),
    message: t('dialogs.deleteMessage'),
    cancel: {
      label: t('buttons.cancel'),
      color: 'primary',
      flat: true,
    },
    ok: {
      label: t('buttons.delete'),
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
