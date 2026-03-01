<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 90vw; max-width: 600px; max-height: 90vh">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ t('dialogs.selectCard') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-card-section style="max-height: calc(90vh - 100px); overflow-y: auto">
        <q-linear-progress v-if="isLoading" indeterminate color="primary" />
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
              :label="t('buttons.previous')"
              size="sm"
              @click="loadCards(currentPage - 1)"
            />
            <q-btn
              v-if="hasMore"
              flat
              color="primary"
              :label="t('buttons.next')"
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
import { ref, computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useQuery } from '@tanstack/vue-query';
import { getAvailableCards } from 'src/services/api/cards';
import type { Card } from 'src/models/cards';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineEmits<{
  ok: [card: Card];
}>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const currentPage = ref(1);
const rpp = 10;

const queryKey = computed(() => ['availableCards', currentPage.value, rpp]);

const { data, isLoading } = useQuery({
  queryKey,
  queryFn: () => getAvailableCards(currentPage.value, rpp),
});

const availableCards = computed(() => data.value?.data?.list ?? []);
const hasMore = computed(() => data.value?.data?.more ?? false);

const loadCards = (page: number) => {
  currentPage.value = page;
};

const selectCard = (card: Card) => {
  onDialogOK(card);
};
</script>
