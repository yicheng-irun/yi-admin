<template>
  <n-space class="table-action">
    <n-button
      @click="$emit('createData')"
      type="primary"
    >
      <Icon icon="plus" /> &nbsp; 新增
    </n-button>
    <n-button
      dashed
      @click="$emit('reloadData')"
    >
      <Icon icon="reload" /> &nbsp; 刷新
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import Icon from '../../components/Icon.vue';
</script>
