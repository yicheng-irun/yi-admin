import { App } from 'vue';
import { create,
  NButton,
  NBreadcrumb,
  NBreadcrumbItem,
  NCheckbox,
  NConfigProvider,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NInputGroup,
  NInputGroupLabel,
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
} from 'naive-ui';

const naive = create({
  components: [
    NButton,
    NBreadcrumb,
    NBreadcrumbItem,
    NCheckbox,
    NConfigProvider,
    NDatePicker,
    NForm,
    NFormItem,
    NInput,
    NInputGroup,
    NInputGroupLabel,
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
