<template>
  <div class="form-component-string-file">
    <a
      v-if="value"
      :href="value"
      class="file-link"
      target="_blank"
    >{{ value }}</a>
    <n-space>
      <n-button
        v-if="value"
        type="error"
        size="small"
        @click="handlerInput('')"
      >
        <Icon icon="close" />&nbsp;删除
      </n-button>
      <n-button
        size="small"
        type="primary"
        @click="selectFile"
      >
        {{ value ? '重新选择' : '选择图片' }}
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import formatFileSize from '../components-utils/format-file-size';
import Icon from '../../../components/Icon.vue';
import { axiosInstance } from '../../../plugins/axios.instance';
import { useMessage } from 'naive-ui';

const props = defineProps({
  config: { type: Object as PropType<{
    maxFileSize?: number;
    mimeType?: string;
  }>, default() {
    return {
      maxFileSize: 10 * 1000,
      mimeType: '*',
    };
  } },
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

const value = computed((): string => {
  return props.editFormData[props.objectKey] as string || '';
});

const $message = useMessage();


async function upload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('name', file.name);
  // 通过append向form对象添加数据
  formData.append('file', file);
  // FormData私有类对象，访问不到，可以通过get判断值是否传进去
  const rsp = await axiosInstance.post(
      '/api/edit-component-action/',
      formData,
      {
        params: {
          fieldName: props.fieldName,
          actionName: 'upload',
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

function handlerInput(url: string) {
  props.editFormData[props.objectKey] = url;
}

async function doUploadAction(file: File) {
  try {
    if (props.config?.maxFileSize && file.size > props.config.maxFileSize) {
      throw new Error(`您选择的文件大小超过了最大${formatFileSize(props.config?.maxFileSize + '')}限制`);
    }
    const url = await upload(file);
    handlerInput(url);
  } catch (e) {
    if (e instanceof Error) {
      $message.error(e?.message || String(e) || '选取文件失败了');
    }
  }
}

function selectFile() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = props.config?.mimeType || '*';
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length) {
      const file = fileInput.files[0];
      doUploadAction(file);
    }
  });
  fileInput.style.opacity = '0';
  fileInput.style.position = 'absolute';
  document.body.append(fileInput);
  fileInput.click();
  fileInput.remove();
}

</script>

<style lang="scss">
.form-component-string-file {
  >.file-link {
    margin: 0 0.5em 0 0;
    font-size: 12px;
  }
}

</style>
