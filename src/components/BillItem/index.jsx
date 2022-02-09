// 账单单项组件

import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import s from './style.module.less';
import dayjs from 'dayjs';
import { Cell } from 'zarm';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '../CustomIcon';
import { typeMap } from '@/utils';





const BillItem = (props) => {
  // console.log('账单单项组件', props);
  const { bill } = props;
  const [income, setIncome] = useState(0); // 收入
  const [expense, setExpense] = useState(0); // 支出
  const navigate = useNavigate(); // 路由实例

  // 当添加账单是，bill.bills 长度变化，触发当日收支总和计算 
  useEffect(() => {
    // 初始化将传入的bill内的bills数组内数据项，过滤出支出和收入；
    // pay_type：1为支出；2为收入
    // 通过reduce累加
    const _income = bill.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);

    const _expence = bill.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
      // curr：上一次调用回调返回的值，或者是提供的初始值（initialValue）
      // item：数组中当前被处理的元素
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expence);
  }, [bill]);

  // 前往账单详情
  const goToDetail = (item) => {
    navigate(`/detail?id=${item.id}`);
  }

  return <div className={s.item}>
    <div className={s.headerDate}>
      <div className={s.date}>{bill.date}</div>
      <div className={s.money}>
        <span>
          <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt='支' />
          <span>¥{expense.toFixed(2)}</span>
        </span>
        <span>
          <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
          <span>¥{income.toFixed(2)}</span>
        </span>
      </div>
    </div>
    {
      bill && bill.bills.map(item => <Cell
        className={s.bill}
        key={item.id}
        onClick={() => goToDetail(item)}
        title={
          <>
            <CustomIcon
              className={s.itemIcon}
              type={item.type_id ? typeMap[item.type_id].icon : 1}
            />
            <span>{item.type_name}</span>
          </>
        }
        description={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>}
        help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
      >
      </Cell>)
    }
  </div>
}

export default BillItem;