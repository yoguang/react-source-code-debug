// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// reportWebVitals();


import ReactDOM from './mini-react/react-dom';
import React from "./mini-react/react";

class ClassComponent extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.name}</p>
      </div>
    )
  }
}
function FunComponent(props) {
  return (
    <div className="functionComponent">
      <p className="func">函数组件: {props.name}</p>
    </div>
  )
}

const jsx = (
  <div id="wrapper">
    <div>children1</div>
    <a href="https://baidu.com">children2</a>
    <FunComponent name="娃哈哈"/>
    {/* <ClassComponent name="我是类组件"/> */}
  </div>
);

ReactDOM.render(jsx, document.getElementById('root'));