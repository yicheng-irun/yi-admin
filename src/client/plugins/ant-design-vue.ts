import {
  Button, Breadcrumb, ConfigProvider, Checkbox, DatePicker, Form, Input, InputNumber, Menu,
  Pagination, Popconfirm, Select, Spin, Switch, Tooltip, message,
} from 'ant-design-vue';
import { MessageApi } from 'ant-design-vue/lib/message';
import { App, ComponentCustomProperties } from 'vue';

export function useAntDesign(app: App) {
  app.use(Button);
  app.use(Breadcrumb);
  app.use(ConfigProvider);
  app.use(Checkbox);
  app.use(DatePicker);
  app.use(Form);
  app.use(Input);
  app.use(InputNumber);
  app.use(Menu);
  app.use(Pagination);
  app.use(Popconfirm);
  app.use(Select);
  app.use(Spin);
  app.use(Switch);
  app.use(Tooltip);

  app.config.globalProperties.$message = message;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $message: MessageApi;
    }
  }
