import React, { useState, useEffect, useRef } from 'react'
import { Icon, Pull } from 'zarm';
import s from './style.module.less';
import dayjs from 'dayjs'
import BillItem from '../../components/BillItem';
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils' // Pull 组件需要的一些常量
import PopupType from '@/components/PopupType';
import PopupDate from '@/components/PopupDate';
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill';


const Home = () => {
  const typeRef = useRef(); // 账单类型 ref    
  const monthRef = useRef(); // 月份筛选 ref
  const addRef = useRef(); // 添加账单ref
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')); // 当前筛选时间 
  const [page, setPage] = useState(1);  //分页
  const [list, setList] = useState([]); // 账单列表
  // const [list, setList] = useState([{bills: [{amount: '25.00',date: '1623390740000',id: 911,pay_type: 1,remark: '',type_id: 1,type_name: '餐饮'}],date: '2021-06-11'}]);  
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态   
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选类型
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入



  useEffect(() => {
    getBillList() // 初始化  
  }, [page, currentSelect, currentTime]);

  const getBillList = async () => {
    // const { data } = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}`);    
    const { data } = await get(`/api/bill/list?date=${currentTime}&page=${page}&page_size=5&type_id=${currentSelect.id || 'all'}`);
    // 下拉刷新，重置数据    
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  // 请求列表数据  
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    }
  }

  // 上拉加载数据
  const loadData = () => {
    // 与 分页总数 做对比
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  // 添加账单弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show();
  }

  // 选择月份弹窗
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  };

  // 筛选类型  子组件调用
  const select = (item) => {
    console.log('筛选类型', item);
    // {id: 1, name: "餐饮", type: "1",user_id: 0}
    setRefreshing(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重置为1
    setPage(1);
    setCurrentSelect(item);
  }

  // 筛选月份
  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  }

  // 添加账单弹窗
  const addToggle = () => {
    addRef.current && addRef.current.show();
  }

  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>¥ {totalExpense}</b></span>
        <span className={s.income}>总收入：<b>¥ {totalIncome}</b></span>
      </div>

      <div className={s.typeWrap}>
        <div className={s.left} onClick={toggle}>
          <span className={s.title}>
            {currentSelect.name || '全部类型'}
            <Icon className={s.arrow} type="arrow-bottom" />
          </span>
        </div>
        <div className={s.right}>
          <span className={s.time} onClick={monthToggle}>{currentTime}
            <Icon className={s.arrow} type="arrow-bottom" />
          </span>
        </div>
      </div>

      <div className={s.add} onClick={addToggle}>
        <CustomIcon type='tianjia' />
      </div>
    </div>

    {/* 内容区, 使用 Pull 组件，实现：下拉刷新+无限滚动 */}
    <div className={s.contentWrap}>
      {
        list && list.length
          ?
          <Pull
            // 动画执行时间，单位：毫秒    
            animationDuration={200}
            // 加载成功停留时间
            stayTime={400}
            // 下拉刷新的参数配置    
            refresh={{
              state: refreshing,
              // 达到阀值后释放触发的回调函数
              handler: refreshData
            }}
            // 上拉加载的参数配置
            load={{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => {
                return (<BillItem
                  bill={item}
                  key={index}
                />)
              })
            }
          </Pull>
          :
          null
      }
    </div>

    <PopupType ref={typeRef} onSelect={select} />
    <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    <PopupAddBill ref={addRef} onReload={refreshData}/>
  </div>
}

export default Home