/**
 * 站点导航菜单
 */
export class SiteNavMenu {
  /**
    * 菜单名称
    */
  public title = '';

  /**
    * 链接
    */
  public link = '';

  /**
    * a标签的target属性
    */
  public target: 'main_frame' | '_blank' | string = 'main_frame';

  /**
    * 图标
    */
  public icon = '';

  /**
    * 子类
    */
  public children: SiteNavMenu[] = [];

  constructor(config: {
      title: string;
      link?: string;
      icon?: string;
      target?: 'main_frame' | '_blank' | string;
      children?: SiteNavMenu[];
   }) {
    this.title = config.title;
    if (typeof config.link === 'string') {
      this.link = config.link;
    }
    if (typeof config.icon === 'string') {
      this.icon = config.icon;
    }
    if (typeof config.target === 'string') {
      this.target = config.target;
    }
    if (Array.isArray(config.children)) {
      config.children.forEach((item) => this.add(item));
    }
  }

  public add(...menus: SiteNavMenu[]): SiteNavMenu {
    for (let i = 0; i < menus.length; i += 1) {
      const menu = menus[i];
      if (!(menu instanceof SiteNavMenu)) throw new Error('请添加一个SiteNavMenu对象');
      this.children.push(menu);
    }
    return this;
  }
}
