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

<script lang="ts">
import { defineComponent } from 'vue';
import { loadStyleFromAssets, loadScriptFromAssets } from '../../../lib/load-file';

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
      type: [Object, Array],
      default() {
        return {};
      },
    },
  },
  watch: {
    value(nv) {
      if (this.joditEditore && this.joditEditore.value !== nv) {
        this.joditEditore.value = nv;
      }
    },
  },
  async mounted() {
    loadStyleFromAssets('static/jodit/jodit.min.css');
    await loadScriptFromAssets('static/jodit/jodit.min.js');

    this.joditEditore = new window.Jodit(this.$refs.textarea, {
      toolbarButtonSize: 'small',
      placeholder: this.config.placeholder,
      allowResizeY: true,

      uploader: {
        url: 'component-action/',
        data: {
          fieldName: this.fieldName,
          actionName: 'uploader',
        },
        getMessage(t) {
          console.log(t);
          return t.message;
        },
        isSuccess(t) {
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
    this.joditEditore.events.on('change', () => {
      this.handleInput(this.joditEditore.value);
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
