<template>
  <div class="filter-components-number-range">
    <n-input-group>
      <n-input-number
        v-model:value="formData.greaterThan"
        placeholder="输入数字"
        :show-button="false"
        @keydown.enter="emit('reloadData')"
      />
      <n-button @click="formData.greaterEqual = !formData.greaterEqual">{{ formData.greaterEqual ? '≤' : '<' }}</n-button>
      <n-input-group-label>值</n-input-group-label>
      <n-button @click="formData.lessEqual = !formData.lessEqual">{{ formData.lessEqual ? '≤' : '<' }}</n-button>
      <n-input-number
        v-model:value="formData.lessThan"
        placeholder="输入数字"
        :show-button="false"
        @keydown.enter="emit('reloadData')"
      />
    </n-input-group>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue';

const emit = defineEmits(['reloadData']);

const props = defineProps({
  config: {
    type: Object,
    default() {
      return {};
    },
  },
  filterFormData: {
    type: Object as PropType<Record<string, {}>>,
    default() {
      return {};
    },
  },
  objectKey: {
    type: [String, Number],
    default: '',
  },
});

const formData = reactive<{
  lessThan: number | null;
  lessEqual: boolean;
  greaterThan: number | null;
  greaterEqual: boolean;
}>({
  lessThan: null,
  lessEqual: false,
  greaterThan: null,
  greaterEqual: false,
});

watch([formData], () => {
  props.filterFormData[props.objectKey] = JSON.parse(JSON.stringify(formData));
});

</script>

<style lang="scss">
.filter-components-number-range {
  >.n-input-group {
    >.n-input-number {
      width: 90px;
    }
  }
}
</style>
