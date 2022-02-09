// App.jsx
import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  // Switch,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import routes from '@/router';
import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
// import 'zarm/dist/zarm.css';
import About from './container/About';
import Index from './container/Index';
import NavBar from './components/NavBar';


function App() {
  // 拿到location实例    
  // let location = useLocation(); 
  // 获取当前路径
  // const { pathname } = location;
  // 需要底部导航栏的路径    
  const needNav = ['/', '/data', '/user'];
  // 是否展示 Nav
  const [showNav, setShowNav] = useState(false);

  // useEffect(() => {
  //   console.log('pathname', pathname)
  //   setShowNav(needNav.includes(pathname))
  // }, [pathname]) 
  // [] 内的参数若是变化，便会执行上述回调函数

  return (
    <Router>
      <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
        <Routes>
          {
            routes.map(route =>
              <Route exact key={route.path} path={route.path} element={<route.component />} />
            )
          }
        </Routes>
      </ConfigProvider>
      {/* <NavBar showNav={showNav} /> */}
      <NavBar showNav={true} />
    </Router>
  )
}

export default App