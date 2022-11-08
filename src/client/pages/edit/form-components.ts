import { DefineComponent, defineAsyncComponent } from 'vue';

export const FormComponents: Record<string, DefineComponent<{}, {}, any>> = {
  'array-string-tag': defineAsyncComponent(() => import('./form-components/array-string-tag.vue')),
  'array': defineAsyncComponent(() => import('./form-components/array.vue')),
  'base': defineAsyncComponent(() => import('./form-components/base.vue')),
  'boolean': defineAsyncComponent(() => import('./form-components/boolean.vue')),
  'date-time': defineAsyncComponent(() => import('./form-components/date-time.vue')),
  'number': defineAsyncComponent(() => import('./form-components/number.vue')),
  'number-enum': defineAsyncComponent(() => import('./form-components/number-enum.vue')),
  'number-remote-select': defineAsyncComponent(() => import('./form-components/number-remote-select.vue')),
  'object': defineAsyncComponent(() => import('./form-components/object.vue')),
  'string-enum': defineAsyncComponent(() => import('./form-components/string-enum.vue')),
  'string-file': defineAsyncComponent(() => import('./form-components/string-file.vue')),
  'string-image': defineAsyncComponent(() => import('./form-components/string-image.vue')),
  'string-remote-select': defineAsyncComponent(() => import('./form-components/string-remote-select.vue')),
  'string': defineAsyncComponent(() => import('./form-components/string.vue')),
  'string-textarea': defineAsyncComponent(() => import('./form-components/string-textarea.vue')),
  'string-wang-editor': defineAsyncComponent(() => import('./form-components/string-wang-editor.vue')),
};

export default FormComponents;
