<template>
  <div>hello {{ asdfasdf }}</div>
  <div>asdasdfasd</div>
  <div>{{ state.testValue }}</div>
</template>


<script lang="ts">
import {defineComponent} from 'vue';
import {createPageStore, IndexPageState} from './index.store';

export default defineComponent({
  components: {
  },
  createStore: createPageStore,
  data() {
    return {
      asdfasdf: 123,
    };
  },
  mounted() {
    console.log(JSON.stringify(this.state));
  },
  computed: {
    state(): IndexPageState {
      // @ts-ignore
      return this.$store.state;
    },
  },
});
</script>
