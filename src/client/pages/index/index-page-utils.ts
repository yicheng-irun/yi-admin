import { h } from 'vue';
import { SiteMenu } from './index.store';
import Icon from '../../components/Icon.vue';
import { MenuOption } from 'naive-ui/es/menu/src/interface';

function renderIcon(icon: string) {
  return () => h(Icon, {
    icon,
  }, { default: () => h(icon) });
}

function renderTextIcon(text: string) {
  return () => h('span', {
    class: 'menu-text-icon',
  }, [text]);
}

function renderLabel(text: string, href: string, target:string = 'main_frame') {
  return () => h('a', {
    class: 'menu-text-a',
    href,
    target,
  }, [text]);
}

export function transformSiteMenuOptions(menu: SiteMenu, key: string = '0'): MenuOption {
  const result: MenuOption = {
    key,
    label: menu.link ? renderLabel(menu.title, menu.link, menu.target) : menu.title,
    link: menu.link,
  };
  if (menu.icon) {
    result.icon = renderIcon(menu.icon);
  }
  if (menu.children?.length) {
    result.children = menu.children.map((value, index) => {
      return transformSiteMenuOptions(value, key + '_' + index);
    });
    if (!result.icon) {
      result.icon = renderIcon('folder');
    }
  } else if (key.split('_').length === 2) {
    if (!result.icon) {
      result.icon = renderTextIcon(menu.title[0] || '-');
    }
  }

  return result;
}
