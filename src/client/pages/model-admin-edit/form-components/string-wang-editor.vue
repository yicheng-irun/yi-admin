<template>
  <div
    class="form-component-string-wang-editor"
  >
    <div
      ref="textarea"
      class="wang-wrapper"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, PropType, ref, watch } from 'vue';
import { loadStyle, loadScript } from '../../../lib/load-file';
import { useAxios } from '../../../plugins/axiox.client';

const props = defineProps({
  config: { type: Object as PropType<{
      placeholder?: string
      uploadImgMaxSize?: number
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


declare class WangEditor {
  constructor(div: HTMLTextAreaElement)
  public customConfig: {
    onchange?(html: string): void;
    onchangeTimeout?: number;
    showFullScreen?: boolean;
    uploadImgMaxSize?: number;
    uploadImgAccept?: string[];
    customUploadImg?(files: File[], inserImgFunc: (url: string) => void): void;
  };
  public txt: {
    html(newHtml?: string): string;
    text(): string;
  };
  create(): void
}

let editor: WangEditor;

watch(value, (value: string) => {
  if (editor) {
    if (editor.txt.html() !== value) {
      editor.txt.html(value);
    }
  }
});

const $axios = useAxios();
const ctx = getCurrentInstance();
const $message = ctx?.appContext.config.globalProperties.$message;

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('name', file.name);
  // 通过append向form对象添加数据
  formData.append('file', file);
  // FormData私有类对象，访问不到，可以通过get判断值是否传进去
  const rsp = await $axios.post(
      'component-action/',
      formData,
      {
        params: {
          fieldName: props.fieldName,
          actionName: 'uploadImage',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
  );
  if (rsp?.data?.success && rsp.data.data?.url) {
    return rsp.data.data.url;
  }
  throw new Error(rsp?.data?.message || '上传文件失败');
}


async function initWangEditor() {
  if (editor) return;
  loadStyle('https://cdn.bootcdn.net/ajax/libs/wangEditor/3.1.1/wangEditor.min.css');
  await loadScript('https://cdn.bootcdn.net/ajax/libs/wangEditor/3.1.1/wangEditor.min.js');

  // @ts-ignore
  const E: WangEditor = window.wangEditor;

  // @ts-ignore
  editor = new E(textarea.value);

  editor.customConfig.onchange = function(html) {
    handlerInput(html);
  };
  editor.customConfig.onchangeTimeout = 500;
  if (props.config.uploadImgMaxSize) {
    editor.customConfig.uploadImgMaxSize = props.config.uploadImgMaxSize;
  }
  editor.customConfig.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  editor.customConfig.customUploadImg = function(files, insert) {
    files.forEach((file) => {
      uploadImage(file).then((url) => {
        insert(url);
      }).catch((e) => {
        if (e instanceof Error) {
          $message.error(e.message);
        }
      });
    });
  };
  editor.create();
  if (value.value) {
    editor.txt.html(value.value);
  }
}

onMounted(() => {
  initWangEditor();
});
</script>

<style lang="scss">
.form-component-string-wang-editor {
   position: relative;
   font-size: 1em;
   max-width: 60em;
   line-height: 1.5;
   >.wang-wrapper {
      min-height: 10em;
   }
}
</style>
