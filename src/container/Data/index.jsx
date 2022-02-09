import React, { useEffect, useRef, useState } from 'react';
import { Icon, Progress } from 'zarm';
import cx from 'classnames';
import dayjs from 'dayjs';
import { get, typeMap } from '../../utils';
import CustomIcon from '../../components/CustomIcon';
import PopupDate from '../../components/PopupDate';
import s from './style.module.less';


const Data = () => {
  const monthRef = useRef();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
  const [totalType, setTotalType] = useState('expense'); // 收入或支出类型
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [expenseData, setExpenseData] = useState([]); // 支出数据
  const [incomeData, setIncomeData] = useState([]); // 收入数据

  useEffect(() => {
    getData()
  }, [currentMonth]);

  // 月份弹窗开关
  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  }

  const selectMonth = (item) => {
    setCurrentMonth(item);
  }

  // 切换收支构成类型
  const changeTotalType = (type) => {
    setTotalType(type);
  };

  const getData = async () => {
    const { data } = await get(`/api/bill/data?date=${currentMonth}`);
    // console.log('data', data);

    // 总收支
    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);

    // 过滤支出和收入   pay_type：账单类型，1 为支出，2为收入
    // 过滤出账单类型为支出的项  
    const expense_data = data.total_data.filter(item => item.pay_type == 1).sort((a, b) => b.number - a.number);
    // 过滤出账单类型为收入的项
    const income_data = data.total_data.filter(item => item.pay_type == 2).sort((a, b) => b.number - a.number);
    setExpenseData(expense_data);
    setIncomeData(income_data);
  };


  return <div className={s.data}>
    <div className={s.total}>
      <div className={s.time} onClick={monthShow}>
        <span>{currentMonth}</span>
        <Icon className={s.date} type='date' />
      </div>

      <div className={s.title}>共支出</div>
      <div className={s.expense}>¥{totalExpense}</div>
      <div className={s.income}>共收入¥{totalIncome}</div>
    </div>

    <div className={s.structure}>
      <div className={s.head}>
        <span className={s.title}>收支构成</span>
        <div className={s.tab}>
          <span onClick={() => changeTotalType('expense')} className={cx({ [s.expense]: true, [s.active]: totalType == 'expense' })}>支出</span>
          <span onClick={() => changeTotalType('income')} className={cx({ [s.income]: true, [s.active]: totalType == 'income' })}>收入</span>
        </div>
      </div>

      <div className={s.content}>
        {
          (totalType == 'expense' ? expenseData : incomeData).map(item => <div key={item.type_id} className={s.item}>
            <div className={s.left}>
              <div className={s.type}>
                <span className={cx({ [s.expense]: totalType == 'expense', [s.income]: totalType == 'income' })}>
                  <CustomIcon
                    // type_id：账单种类 id
                    type={item.type_id ? typeMap[item.type_id].icon : 1}
                  />
                </span>
                {/* type_name：账单种类名称，如购物、交通、医疗等   */}
                <span className={s.name}>{item.type_name}</span>
              </div>
              {/* number: 账单金额 */}   
              <div className={s.progress}>¥{Number(item.number).toFixed(2) || 0}</div>
            </div>

            <div className={s.right}>
              <div className={s.percent}>
                <Progress
                  shape="line"
                  percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                  theme='primary'
                />
              </div>
            </div>
          </div>)
        }
      </div>
    </div>

    <PopupDate ref={monthRef} mode='month' onSelect={selectMonth} />
  </div>
}

export default Data;