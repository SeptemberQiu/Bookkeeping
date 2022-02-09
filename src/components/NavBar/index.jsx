import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { TabBar } from 'zarm';
import CustomIcon from '../CustomIcon';
import { useNavigate } from 'react-router-dom';
// import s from './style.module.less';

// 接收一个外部传入的showNav，控制导航栏的显示隐藏
const NavBar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState('/');
  // 通过useNavigate钩子方法，拿到路由实例
  let navigate = useNavigate();

  const changeTab = (path) => {
    setActiveKey(path);
    // 进行路由跳转
    navigate(path);
  }

  return (
    <TabBar
      visible={showNav}
      // className={s.tab}
      activeKey={activeKey}
      onChange={changeTab}
    >
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type="zhangdan" />}
      />

      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type="tongji" />}
      />

      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="wode" />}
      />

    </TabBar>
  )
}

// NavBar.propTypes = {
//   showNav: PropTypes.bool
// }

export default NavBar;