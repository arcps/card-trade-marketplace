<template>
  <div class="col-auto">
    <q-card flat bordered class="trade-card">
      <q-img :src="card.imageUrl" :alt="card.name" style="width: 80px; height: 110px" fit="cover">
        <template #error>
          <div class="full-width full-height flex flex-center bg-grey-3">
            <q-icon name="card_giftcard" size="2rem" color="grey-6" />
          </div>
        </template>
      </q-img>

      <q-card-section class="q-pa-xs">
        <div class="text-caption text-center text-weight-medium ellipsis-2-lines">
          {{ card.name }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import type { Card } from 'src/models/cards';

defineProps<{
  card: Card;
}>();
</script>

<style scoped>
.trade-card {
  width: 80px;
  min-height: 130px;
}
</style>
