import { App } from 'vue';
import { create,
  NButton,
  NBreadcrumb,
  NBreadcrumbItem,
  NCheckbox,
  NDatePicker,
  NForm,
  NInput,
  NInputNumber,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NMenu,
  NMessageProvider,
  NNotificationProvider,
  NPagination,
  NPopconfirm,
  NSelect,
  NSpace,
  NSpin,
  NSwitch,
  NTooltip,
  MessageApi,
  NotificationApi,
} from 'naive-ui';

const naive = create({
  components: [
    NButton,
    NBreadcrumb,
    NBreadcrumbItem,
    NCheckbox,
    NDatePicker,
    NForm,
    NInput,
    NInputNumber,
    NLayout,
    NLayoutContent,
    NLayoutSider,
    NMenu,
    NMessageProvider,
    NNotificationProvider,
    NPagination,
    NPopconfirm,
    NSelect,
    NSpace,
    NSpin,
    NSwitch,
    NTooltip,
  ],
});

export function useNaiveUi(app: App) {
  app.use(naive);
}

declare module '@vue/runtime-core' {
  // eslint-disable-next-line no-unused-vars
  interface ComponentCustomProperties {
      $message: MessageApi;
      $notification: NotificationApi;
  }
}
