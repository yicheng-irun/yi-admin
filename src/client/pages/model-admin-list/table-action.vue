<template>
  <div class="table-action">
    <a-button
      type="dashed"
      @click="$emit('createData')"
    >
      <Icon icon="plus" /> 新增
    </a-button>
    <a-button
      type="dashed"
      @click="$emit('reloadData')"
    >
      <Icon icon="reload" /> 刷新
    </a-button>
  </div>
</template>

<script setup lang="ts">
import Icon from '../../components/Icon.vue';
</script>
