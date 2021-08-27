# React 源码解析 & 调试环境

### `yarn start` 启动项目

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 调试
./src/react 文件夹下就是对应的 react/packages 下的核心源代码包，可以在其中随意的 debugger
# 执行顺序

 ReactFiberWorkLoop.old.js -> 
 ReactFiberBeginWork.old.js:beginWork -> 
 ReactFiberBeginWork.old.js:mountIndeterminateComponent -> 
 ReactFilberHooks.old.js: renderWithHooks