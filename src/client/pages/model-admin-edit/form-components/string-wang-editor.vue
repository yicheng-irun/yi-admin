<template>
  <div
    class="form-component-string-wang-editor"
  >
    <div
      class="wang-wrapper"
    >
      <WangEditorToolbarComp
        style="border-bottom: 1px solid #eee"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="'default'"
      />
      <WangEditorComp
        v-model="props.editFormData[props.objectKey]"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, getCurrentInstance, onBeforeUnmount, PropType, shallowRef } from 'vue';
import { useAxios } from '../../../plugins/axiox.client';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';

const WangEditorComp = defineAsyncComponent({
  loader: async () => {
    // @ts-ignore
    import('@wangeditor/editor/dist/css/style.css');
    const { Editor } = await import('@wangeditor/editor-for-vue');
    return Editor;
  },
});

const WangEditorToolbarComp = defineAsyncComponent({
  loader: async () => {
    const { Toolbar } = await import('@wangeditor/editor-for-vue');
    return Toolbar;
  },
});

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
    type: Object as PropType<Record<string, string>>,
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


// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};


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

const toolbarConfig: Partial<IToolbarConfig> = {

};

const editorConfig: Partial<IEditorConfig> = {};
editorConfig.placeholder = '请输入内容';
if (!editorConfig.MENU_CONF) {
  editorConfig.MENU_CONF = {};
}
editorConfig.MENU_CONF['uploadImage'] = {
  // 单个文件的最大体积限制，默认为 2M
  maxFileSize: 2 * 1024 * 1024, // 1M
  async customUpload(file: File, insertFn: (url: string, alt: string, href: string) => void) {
    try {
      // file 即选中的文件
      console.log(file);
      // 自己实现上传，并得到图片 url alt href
      const url = await uploadImage(file);
      // 最后插入图片
      insertFn(url, url, url);
    } catch (e) {
      if (e instanceof Error) {
        $message.error(e.message);
      }
    }
  },
};


// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

</script>

<style lang="scss">
.form-component-string-wang-editor {
  position: relative;
  font-size: 1em;
  max-width: 60em;
  line-height: 1.5;
  >.wang-wrapper {
    position: relative;
    width: 1000px;
    max-width: 100%;
  }
}
</style>
