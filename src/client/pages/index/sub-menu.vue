<template>
  <a-menu-item  v-if="!siteMenu.children.length"
                :title="siteMenu.title"
                :value="siteMenu.link"
  >
    <a
      :href="siteMenu.link"
      :target="siteMenu.target || 'main_frame'"
    ><Icon
      v-if="siteMenu.icon"
      :type="siteMenu.icon"
    />{{ siteMenu.title }}</a>
  </a-menu-item>
  <a-sub-menu v-else >
    <template #icon><Icon icon="folder" /></template>
    <template #title>{{ siteMenu.title }}</template>
    <template v-for="item in siteMenu.children" >
      <a-menu-item  v-if="!item.children.length" :key="item.link"
                    :title="item.title"
                    :value="item.link">
        <a
          :href="item.link"
          :target="item.target || 'main_frame'"
        ><Icon
          v-if="item.icon"
          :type="item.icon"
        />{{ item.title }}</a>
      </a-menu-item>
      <template v-else>
        <sub-menu :site-menu="item" :key="item.link" />
      </template>
    </template>
  </a-sub-menu>

</template>

<script lang="ts">
import Icon from '../../components/Icon.vue';
import { defineComponent, PropType } from 'vue';
import { SiteMenu } from './index.store';

export default defineComponent({
  name: 'SubMenu',
  props: {
    siteMenu: {
      type: Object as PropType<SiteMenu>,
      default: () => ({}),
    },
  },
  components: {
    Icon,
  },
});

</script>
