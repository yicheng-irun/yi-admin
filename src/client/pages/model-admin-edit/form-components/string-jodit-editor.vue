<template>
  <div
    class="form-component-string-jodit-editor"
  >
    <textarea
      ref="textarea"
      :value="value"
      class="jodit-wrapper"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue';
import { loadStyle, loadScript } from '../../../lib/load-file';

const props = defineProps({
  config: { type: Object as PropType<{
    placeholder?: string
    }>, default() {
    return {
    };
  },
  },
  editFormData: {
    type: Object as PropType<Record<string, unknown>>,
    default() {
      return {};
    },
  },
  name: String,
  fieldName: String,
  objectKey: {
    type: [String, Number] as PropType<string|number>,
    default: '',
  },
});

function handlerInput(value: string) {
  props.editFormData[props.objectKey] = value;
}

const textarea = ref<HTMLTextAreaElement>();

const value = computed((): string => {
  return props.editFormData[props.objectKey] as string || '';
});

watch(value, (value: string) => {
  if (joditEditor) {
    if (joditEditor.value !== value) {
      joditEditor.value = value;
    }
  }
});

let joditEditor: any = null;

async function initJoditEditor() {
  if (joditEditor) return;
  loadStyle('https://cdn.bootcdn.net/ajax/libs/jodit/3.7.2/jodit.min.css');
  await loadScript('https://cdn.bootcdn.net/ajax/libs/jodit/3.7.2/jodit.min.js');

  // @ts-ignore
  joditEditor = new window.Jodit(textarea.value, {
    toolbarButtonSize: 'small',
    placeholder: props.config.placeholder,
    allowResizeY: true,

    uploader: {
      url: 'component-action/',
      data: {
        fieldName: props.fieldName,
        actionName: 'uploader',
      },
      getMessage(t: { message: string }) {
        console.log(t);
        return t.message;
      },
      isSuccess(t: { success: boolean }) {
        return t.success === true;
      },
    },


    extraButtons: [
      // 留着后面慢慢再补充内容
      // {
      //    name: '代码语言',
      //    exec (t, e, o) {
      //       console.log(t, e, o);
      //    },
      //    list: {
      //       javascript: 'javascript',
      //       bash: 'bash',
      //       html: 'html',
      //       css: 'css',
      //    },
      //    tooltip: '代码语言',
      // },
    ],
  });

  joditEditor.events.on('change', () => {
    handlerInput(joditEditor.value);
  });
}

onMounted(() => {
  initJoditEditor();
});
</script>

<style lang="scss">
.form-component-string-jodit-editor {
   position: relative;
   font-size: 1em;
   max-width: 60em;
   line-height: 1.5;
   >.jodit-wrapper {
      min-height: 10em;
   }
   .jodit_toolbar_container {
   }
}
</style>
