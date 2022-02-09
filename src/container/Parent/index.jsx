import React, { useEffect, useState, useCallback } from 'react'

function Child({ test, onFatherClick }) {
  useEffect(() => {
    onFatherClick()
  }, [onFatherClick])

  const onClickSon = () => {
    onFatherClick()
  }
  return <div onClick={onClickSon}>{test}</div>
}


function Parent() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)

  const [test, setTest] = useState('我从父组件来');
  const onFatherClick = useCallback(() => {
    console.log('我被渲染了没');
  }, []);

  const onFatherClick = () => {
    console.log('我被渲染了没');
  };  

  return (
    <div>
      <button onClick={increment}>我是父组件，我点击了：{count}</button>
      <Child
        test={test}
        onFatherClick={onFatherClick}
      />
    </div>
  );
}

export default Parent;