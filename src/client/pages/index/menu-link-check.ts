import { publicPath } from '../../lib/public-path';
import { SiteMenu } from './index.store';


export function menuLinkCheck(menu: SiteMenu) {
  if (menu.link) {
    menu.link = menu.link.replace(/#basePath#/g, publicPath);
  }
  if (menu.children) {
    for (let i = 0; i < menu.children.length; i += 1) {
      menuLinkCheck(menu.children[i]);
    }
  }
}
