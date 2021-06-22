/**
 * @name Header
 * @author Lester
 * @date 2021-05-19 11:02
 */

import React, { useContext } from 'react';
import { Context } from 'src/store';
import './style.less';

const Header: React.FC = () => {
  const { userInfo } = useContext(Context);

  return (
    <header className="header-wrap">
      <img className="header-logo" src={userInfo.corpLogo || require('src/assets/images/bg.jpg')} alt="" />
      <div className="header-info">
        <img className="header-avatar" src={userInfo.avatar} alt="" />
        <span className="user-name">
          {userInfo.name}[{userInfo.corpName} {userInfo.departDesc}]
        </span>
      </div>
    </header>
  );
};

export default Header;
