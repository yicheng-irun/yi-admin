<template>
  <a-select
    v-model="editFormData[objectKey]"
    :placeholder="config.placeholder == null ? '搜索和选择' : config.placeholder"
    show-search
    :allow-clear="true"
    :loading="loading"
    :filter-option="false"
    mode="multiple"
    class="form-component-array-string-tag"
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
import { defineComponent } from 'vue';

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
      type: [Object, Array],
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
      remoteOptions: [] as string[],
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
        if (e) {
          opts.push({
            label: e,
            value: e,
          });
        }
      }
      return opts;
    },
  },
  mounted() {
    this.remoteMethod('');
  },
  methods: {
    async remoteMethod(query: string) {
      this.loading = true;
      this.lastQuery = query;
      try {
        const rsp1Promise = this.$axios.post('component-action/', {
          fieldName: this.fieldName,
          actionName: 'getTags',
          actionData: query,
        });

        const rsp1 = await rsp1Promise;
        const result = rsp1.data;
        if (this.lastQuery === query) {
          if (result.success) {
            this.remoteOptions = [...result.data];
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
.form-component-array-string-tag.ant-select {
   max-width: 20em;
}
</style>
