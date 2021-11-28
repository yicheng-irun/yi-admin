import { defineAsyncComponent, DefineComponent } from 'vue';

const FilterComponents: Record<string, DefineComponent<{}, {}, any>> = {
  'base': defineAsyncComponent(() => import('./filter-components/base.vue')),
  'remote-select': defineAsyncComponent(() => import('./filter-components/remote-select.vue')),
  'select': defineAsyncComponent(() => import('./filter-components/select.vue')),
  'string-search': defineAsyncComponent(() => import('./filter-components/string-search.vue')),
};

export default FilterComponents;
