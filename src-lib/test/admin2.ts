import YiAdmin, {
  SiteNavMenu,
} from '../server/index';

const myadmin = new YiAdmin({});


myadmin.siteNavMenu.add(new SiteNavMenu({
  title: '测试菜单1',
  icon: 'plus',
  link: 'model-admin/yi-admin-demo/edit/',
}));


const menu2 = new SiteNavMenu({
  title: '测试菜单2',
  link: '',
});

menu2.add(new SiteNavMenu({
  title: '测试子菜单1',
  link: 'https://www.baidu.com',
}));
menu2.add(new SiteNavMenu({
  title: '测试子菜单2',
}));
menu2.add(new SiteNavMenu({
  title: '测试子菜单3',
  link: 'https://www.baidu.com',
  children: [
    new SiteNavMenu({
      title: '测试子子菜单1',
    }),
    new SiteNavMenu({
      title: '测试子子菜单2',
      link: 'https://www.baidu.com',
    }),
  ],
}));
menu2.add(new SiteNavMenu({
  title: '测试子菜单4',
  link: 'https://www.baidu.com',
}));
myadmin.siteNavMenu.add(menu2);


myadmin.siteNavMenu.add(new SiteNavMenu({
  title: '测试菜单3',
  link: '',
}));

myadmin.siteNavMenu.add(new SiteNavMenu({
  title: '测试菜单4',
  link: 'model-admin/yi-admin-demo/edit/',
}));


export default myadmin;
