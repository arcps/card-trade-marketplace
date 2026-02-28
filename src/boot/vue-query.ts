import { defineBoot } from '#q-app/wrappers';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

export default defineBoot(({ app }) => {
  app.use(VueQueryPlugin, {
    queryClient,
  });
});

export { queryClient };
