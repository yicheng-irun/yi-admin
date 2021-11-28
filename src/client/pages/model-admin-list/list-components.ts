import { defineAsyncComponent, DefineComponent } from 'vue';

const ListComponents: Record<string, DefineComponent<{}, {}, any>> = {
  'array-string-tag': defineAsyncComponent(() => import('./list-components/array-string-tag.vue')),
  'array': defineAsyncComponent(() => import('./list-components/array.vue')),
  'base': defineAsyncComponent(() => import('./list-components/base.vue')),
  'boolean': defineAsyncComponent(() => import('./list-components/boolean.vue')),
  'object': defineAsyncComponent(() => import('./list-components/object.vue')),
  'string-enum': defineAsyncComponent(() => import('./list-components/string-enum.vue')),
  'string-html': defineAsyncComponent(() => import('./list-components/string-html.vue')),
  'string-image': defineAsyncComponent(() => import('./list-components/string-image.vue')),
  'string-remote-select': defineAsyncComponent(() => import('./list-components/string-remote-select.vue')),
  'string-textarea': defineAsyncComponent(() => import('./list-components/string-textarea.vue')),
};

export default ListComponents;
