/**
 * @name Layout
 * @author Lester
 * @date 2021-05-07 10:35
 */

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { Switch, Redirect, Route, withRouter, RouteProps, RouteComponentProps } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { getQueryParam } from 'lester-tools';
import { Icon } from 'src/components';
import { Context } from 'src/store';
import routes, { menus, Menu } from 'src/pages/routes';
import { queryUserInfo, loginAuth } from 'src/apis';
import { getCookie, getUrlQueryParam } from 'src/utils/base';
import wxLoginAuth from 'src/utils/wxLoginAuth';
import Header from './Header';
import Footer from './Footer';
import './style.less';

const Routes = withRouter(({ location }) => (
  <TransitionGroup className="transition-wrap">
    <CSSTransition timeout={300} classNames="fade" key={location.pathname}>
      <Suspense fallback={null}>
        <Switch location={location}>
          {routes.map((item: RouteProps) => (
            <Route key={`rt${item.path}`} {...item} exact />
          ))}
          <Redirect from="/*" to="/index" />
        </Switch>
      </Suspense>
    </CSSTransition>
  </TransitionGroup>
));

const Layout: React.FC<RouteComponentProps> = ({ history }) => {
  const { setUserInfo } = useContext(Context);
  const [pageVisible, setPageVisible] = useState<boolean>(false);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [subMenus, setSubMenus] = useState<Menu[]>([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [subMenuIndex, setSubMenuIndex] = useState<number | null>(null);

  /**
   * 刷新时获取激活菜单
   */
  const initMenu = () => {
    const pathArr: string[] = window.location.pathname.split('/');
    const currentMenu: string = pathArr.length > 3 ? pathArr[pathArr.length - 2] : pathArr[pathArr.length - 1];
    const currentMenuIndex = menus.findIndex((menu: Menu) =>
      menu.children?.some((subMenu: Menu) => subMenu.path.includes(currentMenu))
    );
    if (currentMenuIndex > -1) {
      const subMenus = menus[currentMenuIndex].children || [];
      setMenuIndex(currentMenuIndex);
      setSubMenus(subMenus);
      setSubMenuIndex(subMenus.findIndex((subMenu: Menu) => subMenu.path.includes(currentMenu)));
    }
  };

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    setPageVisible(true);
    initMenu();
    const res = await queryUserInfo();
    if (res) {
      setUserInfo(res);
    }
  };

  /**
   * 登录授权
   */
  const login = async () => {
    // 兼容页面刷新时 没带企业参数
    const queryParam: any = getQueryParam();
    const corpId: string = getUrlQueryParam('corpId');
    const agentId: string = getUrlQueryParam('agentId');
    if (queryParam.corpId && queryParam.agentId) {
      window.localStorage.setItem('queryParam', JSON.stringify(queryParam));
    }
    const token = getCookie('ff21c6e3e132da3a485cf85d0f0c5e9d');
    if (token) {
      getUserInfo();
    } else {
      const localCode = window.localStorage.getItem('code');
      const code: string = getQueryParam('code');
      if (code && code !== localCode) {
        const param: any = {
          corpId,
          agentId,
          code
        };
        await loginAuth(param);
        window.localStorage.setItem('code', code);
        getUserInfo();
      } else {
        wxLoginAuth();
      }
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <>
      {pageVisible && (
        <div className="layout-wrap">
          <Header />
          <div className="layout-content">
            <div
              className={classNames('collapse-wrap', isCollapse ? 'is-collapse' : 'is-expand')}
              onClick={() => setIsCollapse((state) => !state)}
            >
              <Icon className="arrow-icon" name={isCollapse ? 'iconfontjiantou2' : 'zuojiantou-copy'} />
            </div>
            <ul className="menu-list">
              {menus.map((menu: Menu, index: number) => (
                <li
                  className={classNames('menu-item', {
                    'menu-active': menuIndex === index
                  })}
                  key={menu.path}
                  onClick={() => {
                    setMenuIndex(index);
                    setSubMenuIndex(null);
                    setSubMenus(menu.children || []);
                  }}
                >
                  <Icon className="menu-icon" name={menu.icon!} />
                  <span className="menu-name">{menu.name}</span>
                </li>
              ))}
            </ul>
            <ul style={{ display: isCollapse ? 'none' : 'block' }} className="sub-menu-list">
              {subMenus.map((subMenu: Menu, index: number) => (
                <li
                  className={classNames('sub-menu-item', {
                    'sub-menu-active': subMenuIndex === index
                  })}
                  key={subMenu.path}
                  onClick={() => {
                    setSubMenuIndex(index);
                    history.push(subMenu.path);
                  }}
                >
                  {subMenu.name}
                </li>
              ))}
            </ul>
            <div className="content-wrap">
              <div className="route-content">
                <Routes />
              </div>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(Layout);
