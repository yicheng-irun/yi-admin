import { AxiosInstance } from 'axios';
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store : Store<any>;
    $axios: AxiosInstance;
  }
}

declare module 'vuex' {
  interface Store {
    $axios: AxiosInstance;
  }
}
