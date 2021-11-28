<template>
  <div class="model-admin-edit">
    <a-breadcrumb separator=">">
      <a-breadcrumb-item>
        <a
          href="../../../"
          target="_top"
        >首页</a>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <a
          href="../"
        >
          {{ state.modelInfo.title || state.modelInfo.name }} 管理
        </a>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        {{ state.modelInfo.title || state.modelInfo.name }} {{ state.editId ? '编辑' : '新增' }}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <edit-form
      :edit-id="state.editId"
      :edit-form-fields="state.editFormFields"
      :edit-form-data="state.editFormData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createPageStore, ModelAdminEditPageState } from './store';
import EditForm from './edit-form.vue';

export default defineComponent({
  components: {
    EditForm,
  },
  createStore: createPageStore,

  data() {
    return {
    };
  },
  mounted() {
    Promise.all([
      this.$store.dispatch('fetchEditFormFields'),
      this.$store.dispatch('fetchEditData'),
    ]);
  },

  computed: {
    state(): ModelAdminEditPageState {
      return this.$store.state;
    },

  },
});
</script>

<style lang="scss">
body {
   background: #f5f6f7;
}
.model-admin-edit {
  margin: 0 1.2em;
}
.ant-breadcrumb {
  padding: 1em 0;
}

</style>
