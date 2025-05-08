
//本地菜单
export const asyncMockRoutes = [
    {
      path: '/dev',
      component: 'Layout',
      redirect: '/dev/index',
      meta: { title: '本地调试', icon: 'theModule' },
      children: [
        {
          name: 'index',
          path: 'menu',
          component: 'system/menu',
          meta: { title: '菜单管理', icon: 'theModule' }
        },
      ]
    }
  
  ];
  //本地按钮权限
  export const asyncMockFuctionIdList=[]
  