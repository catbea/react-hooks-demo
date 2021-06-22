/**
 * @name routes
 * @author Lester
 * @date 2021-05-07 09:35
 */

import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export interface Menu {
  name: string;
  icon?: string;
  path: string;
  children?: Menu[];
}

const routes: RouteProps[] = [
  {
    path: '/index',
    component: lazy(() => import('src/pages/Index/Index'))
  },
  // 小站配置
  {
    path: '/stationConfig',
    component: lazy(() => import('src/pages/StationConfig/StationConfig'))
  },
  // 新增小站配置
  {
    path: '/stationConfig/addConfig',
    component: lazy(() => import('src/pages/AddStationConfig/AddStationConfig'))
  },
  /**
   * lester
   */
  {
    path: '/addFriend',
    component: lazy(() => import('src/pages/AddFriend/AddFriend'))
  },
  {
    path: '/productLibrary',
    component: lazy(() => import('src/pages/ProductLibrary/ProductLibrary'))
  },
  {
    path: '/productLibrary/productConfig',
    component: lazy(() => import('src/pages/ProductLibrary/ProductConfig'))
  },
  {
    path: '/productLibrary/productFeatureConfig',
    component: lazy(() => import('src/pages/ProductLibrary/ProductFeatureConfig'))
  },
  {
    path: '/activityLibrary',
    component: lazy(() => import('src/pages/ActivityLibrary/ActivityLibrary'))
  },
  {
    path: '/activityLibrary/activityConfig',
    component: lazy(() => import('src/pages/ActivityLibrary/ActivityConfig'))
  },
  /**
   * jser
   */
  {
    path: '/demo',
    component: lazy(() => import('src/pages/Index/Index'))
  }
];

export const menus: Menu[] = [
  {
    name: '加好友',
    icon: 'icon_daohang_28_jiahaoyou',
    path: 'add',
    children: [
      {
        name: '批量加好友',
        path: '/addFriend'
      }
    ]
  },
  {
    name: '人设打造',
    icon: 'icon_daohang_28_renshedazao',
    path: 'humanDdesign',
    children: [
      {
        name: '小站配置',
        path: '/stationConfig'
      }
    ]
  },
  {
    name: '营销平台',
    icon: 'icon_daohang_28_yingxiaopingtai',
    path: 'marketingPlatform',
    children: [
      {
        name: '产品库',
        path: '/productLibrary'
      },
      {
        name: '活动库',
        path: '/activityLibrary'
      }
    ]
  },
  {
    name: '任务系统',
    icon: 'icon_daohang_28_renwuxitong',
    path: 'taskSystem',
    children: []
  },
  {
    name: '标签系统',
    icon: 'icon_daohang_28_biaoqianxitong',
    path: 'labelSystem',
    children: []
  }
];

export default routes;
