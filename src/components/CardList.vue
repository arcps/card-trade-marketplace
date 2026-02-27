<template>
  <div class="row q-gutter-sm q-gutter-lg-md">
    <div v-for="card in cards" :key="card.id" :class="columnClasses">
      <q-card
        :class="[
          'bg-blue-grey-2 full-height column',
          {
            'cursor-pointer': clickable,
            'card-selected': isSelected(card.id),
          },
        ]"
        :clickable="clickable"
        v-ripple="clickable"
        @click="handleCardClick(card)"
      >
        <q-img :src="card.imageUrl" :alt="card.name" class="q-pa-lg q-mt-md" fit="contain" />
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">{{ card.name }}</div>
          <div v-if="card.description" class="text-caption text-grey-8 ellipsis-3-lines">
            {{ card.description }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Card } from 'src/models/cards';

interface Props {
  cards: Card[];
  clickable?: boolean;
  selected?: string[] | ((cardId: string) => boolean);
  multiple?: boolean;
  columns?: string;
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  selected: () => [],
  multiple: false,
  columns: 'col-xs-12 col-sm-6 col-md-4 col-lg-3',
});

const emit = defineEmits<{
  'card-click': [card: Card];
  'selection-change': [selectedCards: Card[]];
}>();

const columnClasses = computed(() => props.columns);

const isSelected = (cardId: string): boolean => {
  if (Array.isArray(props.selected)) {
    return props.selected.includes(cardId);
  }
  if (typeof props.selected === 'function') {
    return props.selected(cardId);
  }
  return false;
};

const handleCardClick = (card: Card) => {
  if (!props.clickable) return;

  if (props.multiple) {
    emit('card-click', card);
  } else {
    emit('card-click', card);
  }
};
</script>

<style scoped>
.card-selected {
  border: 3px solid var(--q-primary);
  box-shadow: 0 0 10px rgba(var(--q-primary-rgb), 0.3);
}
</style>
