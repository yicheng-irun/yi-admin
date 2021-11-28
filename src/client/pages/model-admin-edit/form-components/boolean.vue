<template>
  <a-switch
    v-model="editFormData[objectKey]"
    class="form-component-boolean"
  >
    <a-icon
      slot="checkedChildren"
      type="check"
    />
    <a-icon
      slot="unCheckedChildren"
      type="close"
    />
  </a-switch>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({

  props: {

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
  methods: {

  },
});
</script>

<style lang="scss">
.form-component-boolean {

}
</style>
