import { AxiosInstance } from 'axios';
import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  // eslint-disable-next-line no-unused-vars
  interface ComponentCustomProperties {
    $store : Store<any>;
    $axios: AxiosInstance;
  }
}

declare module 'vuex' {
  // eslint-disable-next-line no-unused-vars
  interface Store<S> {
    $axios: AxiosInstance;
  }
}
