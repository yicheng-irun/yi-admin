<template>
  <div
    class="form-component-string-ueditor"
  >
    <textarea
      :id="textareaId"
      ref="textarea"
      :value="value"
      class="ueditor-wrapper"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { loadScriptFromAssets } from '../../../lib/load-file';

export default defineComponent({
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    fieldName: {
      type: String,
      default: '',
    },
    editFormData: {
      type: Object as PropType<Record<string, unknown>>,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      textareaId: Math.random().toString(36),
    };
  },
  watch: {
    value(nv) {
      if (this.editor && this.editor.getContent() !== nv) {
        this.editor.setContent(nv);
      }
    },
  },
  async mounted() {
    // eslint-disable-next-line no-underscore-dangle
    window.UEDITOR_HOME_URL = `${window._ASSETS_PATH_}static/ueditor/`;
    await loadScriptFromAssets('static/ueditor/ueditor.config.js');
    await loadScriptFromAssets('static/ueditor/ueditor.all.min.js');
    await loadScriptFromAssets('static/ueditor/lang/zh-cn/zh-cn.js');

    const editor = window.UE.getEditor(this.textareaId);
    this.editor = editor;

    editor.getActionUrl = (actionName) => `${window.location.pathname}component-action/?${new URLSearchParams([
      ['actionName', actionName],
      ['fieldName', this.fieldName],
    ]).toString()}`;
    editor.addListener('blur', () => {
      this.handleInput(this.editor.getContent());
    });
    editor.addListener('contentChange', () => {
      this.handleInput(this.editor.getContent());
    });
    editor.addListener('afterSetContent', () => {
      this.handleInput(this.editor.getContent());
    });
  },
  methods: {
    handleInput(value) {
      const v = String(value);
      this.$emit('input', v);
    },
  },
});
</script>

<style lang="scss">
.form-component-string-ueditor {
   position: relative;
   font-size: 1em;
   max-width: 60em;
   line-height: 1.5;
   >.ueditor-wrapper {
      border: none;
      width: 100%;
   }
}
</style>
