import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Icon } from 'zarm';
import s from './style.module.less';

const Header = ({ title = '' }) => {
  const navigate = useNavigate();

  return <div className={s.headerWarp}>
    <div className={s.block}>
      <NavBar
        className={s.header}
        left={
          <Icon
            type='arrow-left'
            theme='primary'
            // 路由返回事件，它不会触发浏览器的刷新，而是改变浏览器的地址栏，让组件匹配地址栏对应的地址组件
            onClick={() => navigate(-1)}
            title={title}
          />}
      />
    </div>
  </div>
}

export default Header;