<template>
  <a-select
    v-model="editFormData[objectKey]"
    :placeholder="config.placeholder == null ? '搜索和选择' : config.placeholder"
    show-search
    :allow-clear="true"
    :loading="loading"
    :filter-option="false"
    class="form-component-string-remote-select"
    @search="remoteMethod"
  >
    <a-select-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    fieldName: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    editFormData: {
      type: Object as PropType<Record<string, unknown>>,
      default() {
        return {};
      },
    },
    objectKey: {
      type: [String, Number],
      default: '',
    },
  },

  data() {
    return {
      remoteOptions: [],
      loading: false,
      lastQuery: '',
    };
  },

  computed: {
    options(): {
       label: string;
       value: string;
    }[] {
      const opts: {
         label: string;
         value: string;
      }[] = [];
      for (let i = 0; i < this.remoteOptions.length; i += 1) {
        const e = this.remoteOptions[i];
        if (e) opts.push(e);
      }
      return opts;
    },
  },
  mounted() {
    this.remoteMethod('', true);
  },
  methods: {
    async remoteMethod(query: string, init = false) {
      this.loading = true;
      this.lastQuery = query;
      try {
        const rsp1Promise = this.$axios.post('component-action/', {
          fieldName: this.fieldName,
          actionName: 'getOptions',
          actionData: query,
        });

        let initValue = null;
        if (init && this.value) {
          const { value } = this;
          const rsp2 = await this.$axios.post('component-action/', {
            fieldName: this.fieldName,
            actionName: 'getLabelByValue',
            actionData: value,
          });
          if (rsp2.data?.success) {
            initValue = {
              label: rsp2.data.data,
              value,
            };
          } else {
            throw new Error(rsp2.data?.message || `拉取字段${this.fieldName}初始值失败了`);
          }
        }

        const rsp1 = await rsp1Promise;
        const result = rsp1.data;
        if (this.lastQuery === query) {
          if (result.success) {
            this.remoteOptions = [...result.data];
            if (initValue) {
              const v = initValue.value;
              let exist = false;
              this.options.forEach((t) => {
                if (t.value === v) {
                  exist = true;
                }
              });
              if (!exist) this.remoteOptions.push(initValue);
            }
          } else {
            throw new Error(result.message || '搜索远程数据失败了');
          }
        }
      } catch (e) {
        if (this.lastQuery === query) {
          // 这里提示
          this.$message.error(e?.message || String(e) || '搜索失败了');
        }
      }
      this.loading = false;
    },
  },
});
</script>

<style lang="scss">
.form-component-string-remote-select.ant-select {
   max-width: 20em;
}
</style>
