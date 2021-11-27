import {createStore} from 'vuex';

export interface IndexPageState {
    siteMenu: string | null;
    siteConfig: Record<string, string>;
    iframeSrc: string;
    testValue: string,
}

export function createPageStore() {
  return createStore<IndexPageState>({
    state: {
      siteMenu: null,
      siteConfig: {},
      iframeSrc: '',
      testValue: new Date().toString(),
    },
  });
}
