<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 90vw; max-width: 600px; max-height: 90vh">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Selecionar carta</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-card-section style="max-height: calc(90vh - 100px); overflow-y: auto">
        <q-linear-progress v-if="loading" indeterminate color="primary" />
        <div v-else>
          <q-list>
            <q-item
              v-for="card in availableCards"
              :key="card.id"
              clickable
              v-ripple
              @click="selectCard(card)"
            >
              <q-item-section avatar>
                <q-img
                  :src="card.imageUrl"
                  :alt="card.name"
                  style="width: 60px; height: 80px"
                  fit="cover"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ card.name }}</q-item-label>
                <q-item-label caption v-if="card.description" class="text-truncate-2-lines">
                  {{ card.description }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div v-if="availableCards.length === 0" class="text-center q-my-lg text-grey">
            Nenhuma carta disponível
          </div>
          <div class="row q-gutter-sm q-mx-none q-mt-lg justify-center">
            <q-btn
              v-if="currentPage > 1"
              flat
              color="primary"
              label="Anterior"
              size="sm"
              @click="loadCards(currentPage - 1)"
            />
            <q-btn
              v-if="hasMore"
              flat
              color="primary"
              label="Próxima"
              size="sm"
              @click="loadCards(currentPage + 1)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { getAvailableCards } from 'src/services/api/cards';
import type { Card } from 'src/models/cards';

defineEmits<{
  ok: [card: Card];
}>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const availableCards = ref<Card[]>([]);
const currentPage = ref(1);
const hasMore = ref(false);
const loading = ref(false);
const rpp = 10;

const loadCards = async (page: number = 1) => {
  loading.value = true;
  try {
    const response = await getAvailableCards(page, rpp);
    availableCards.value = response.data.list;
    hasMore.value = response.data.more;
    currentPage.value = page;
  } catch (error) {
    console.error('Error loading available cards:', error);
  } finally {
    loading.value = false;
  }
};

const selectCard = (card: Card) => {
  onDialogOK(card);
};

// Load cards on mount
onMounted(async () => {
  await loadCards(1);
});
</script>
