<template>
  <div
    class="list-components-string-enum"
  >
    {{ labelValue || value }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { axiosInstance } from '../../../plugins/axios.instance';

export default defineComponent({
  props: {
    fieldName: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number] as PropType<string | number>,
      default: '',
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      labelValue: '',
    };
  },
  mounted() {
    this.getRemoteLabel(this.value);
  },
  methods: {
    async getRemoteLabel(value: number | string) {
      try {
        const rsp2 = await axiosInstance.post('/api/list-component-action/', {
          fieldName: this.fieldName,
          actionName: 'getLabelByValue',
          actionData: value,
        });
        if (this.value === value && rsp2.data?.success) {
          this.labelValue = rsp2.data.data;
        }
      } catch (e) {
        //
      }
    },
  },
});
</script>

<style lang="scss">
.list-components-string-enum {
   // font-size 1.5em
   text-align: center;
}
</style>
