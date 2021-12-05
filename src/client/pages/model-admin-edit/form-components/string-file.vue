<template>
  <div class="form-component-string-file">
    <a
      v-if="value"
      :href="value"
      class="file-link"
      target="_blank"
    >{{ value }}</a>
    <n-button-group>
      <n-button
        v-if="value"
        type="danger"
        icon="close"
        size="small"
        @click="handleInput('')"
      />
      <n-button
        size="small"
        type="primary"
        @click="selectFile"
      >
        {{ value ? '重新选择' : '选择文件' }}
      </n-button>
    </n-button-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import formatFileSize from '../components-utils/format-file-size';

export default defineComponent({
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    fieldName: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object as PropType<Record<string, unknown>>,
      default() {
        return {
          maxFileSize: 10 * 1000,
          mimeType: '*',
        };
      },
    },
  },
  data() {
    return {
    };
  },
  mounted() {
    const fileInput = document.createElement('input');
    this.fileInput = fileInput;
    fileInput.type = 'file';
    fileInput.accept = this.config.mimeType || '*';
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      this.doUploadAction(file);
    };
  },
  methods: {
    async selectFile() {
      this.fileInput.click();
    },
    /**
       * @param {File} file
       */
    async upload(file) {
      const formData = new FormData();
      formData.append('name', file.name);
      // 通过append向form对象添加数据
      formData.append('file', file);
      // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      console.log(formData.get('file'));

      const rsp = await this.$axios.post(
          'component-action/',
          formData, {
            params: {
              fieldName: this.fieldName,
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
    },
    /**
       * @param {File} file
       */
    async doUploadAction(file: File) {
      try {
        console.log(file, this.config);
        if (file.size > this.config.maxFileSize) {
          throw new Error(`您选择的文件大小超过了最大${formatFileSize(this.config.maxFileSize)}限制`);
        }
        const url = await this.upload(file);
        this.handleInput(url);
      } catch (e) {
        this.$message.error(e?.message || String(e) || '选取文件失败了');
      }
    },

    handleInput(value) {
      const v = String(value);
      this.$emit('input', v);
    },
  },
});
</script>

<style lang="scss">
.form-component-string-file {
   >.file-link {
      margin: 0 0.5em 0 0;
      font-size: 12px;
   }
   >.a-button {
      padding: 0.2em 0.5em;
      margin: 0 0.3em;
   }
}

</style>
