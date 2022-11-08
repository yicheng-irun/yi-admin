<template>
  <div
    class="list-components-string-image"
  >
    <a
      :href="value"
      target="_blank"
    >
      <img
        :src="value"
        :alt="value"
        :style="imgStyle"
      >
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  },
  computed: {
    imgStyle() {
      const style: {
         maxWidth?: string;
         maxHeight?: string;
      } = {};
      if (this.config.styleMaxWidth) {
        style.maxWidth = this.config.styleMaxWidth;
      }
      if (this.config.styleMaxHeight) {
        style.maxHeight = this.config.styleMaxHeight;
      }
      return style;
    },
  },
});
</script>

<style lang="scss">
.list-components-string-image {
   display: inline-block;
   >a {
      display: inline-block;
      >img {
         vertical-align: top;
         max-width: 10em;
         max-height: 6em;
         border: 1px solid #fff;
         box-shadow: 0 0 6px #0003;
      }
   }
}
</style>
