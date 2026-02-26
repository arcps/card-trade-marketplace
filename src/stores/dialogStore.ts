import { defineStore, acceptHMRUpdate } from 'pinia';
import { markRaw } from 'vue';

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    dialogComponent: null as any,
    dialogProps: {} as Record<string, any>,
    isOpen: false,
  }),

  actions: {
    openDialog(component: any, props = {}) {
      // Using markRaw to prevent Vue from making the component reactive
      this.dialogComponent = markRaw(component);
      this.dialogProps = props;
      this.isOpen = true;
    },

    closeDialog() {
      this.isOpen = false;
      this.dialogComponent = null;
      this.dialogProps = {};
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDialogStore, import.meta.hot));
}
