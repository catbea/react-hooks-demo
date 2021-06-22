/**
 * @name UserCenter
 * @author Lester
 * @date 2021-05-07 09:49
 */

import React, { useContext, useEffect } from 'react';
import { Context } from 'src/store';
import style from './style.module.less';

const UserCenter: React.FC = () => {
  const { userInfo } = useContext(Context);
  useEffect(() => {
    console.log('user center');
    console.log(userInfo);
    console.log(window.wx);
  }, []);

  return <div className={style.wrap}>用户中心{userInfo.name}</div>;
};

export default UserCenter;
