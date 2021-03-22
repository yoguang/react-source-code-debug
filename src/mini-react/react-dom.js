
// workInProgress 进行中的 fiber

// 根节点
let wipRoot = null;

// 下一个单元任务，实际就是 fiber
let nextUnitOfWork = null;

/**
 * vnode 生产的 虚拟node节点
 * container 节点插入容器 dom 节点
 * */
function render(vnode, container) {
  wipRoot = {
    type: container.tagName.toLocaleLowerCase(),
    props: {
      children: { ...vnode },
    },
    stateNode: container,
  }

  nextUnitOfWork = wipRoot;
  
}

function createNode(workInProgress) {
  const { type, props } = workInProgress;
  const node = document.createElement(type);
  updateNode(node, props);
  return node;
}

// 原生标签节点
function updateHostComponent(workInProgress) {
  const { type, props } = workInProgress;
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress);
  }
  reconcileChildren(workInProgress , props.children);
}

// 更新属性
function updateNode(node, props) {
  Object.keys(props)
    .forEach(k => {
      if (k === 'children') {
        // 子节点是文本节点
        if (typeof props[k] === 'string') {
          node.textContent = props[k];
        }
      } else {
        node[k] = props[k];
      }
    });
}

// 文本节点
function updateTextComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    // 创建 文本节点
    workInProgress.stateNode = document.createTextNode(workInProgress.props);
  }
}

// 函数组件
function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  const children = type(props);
  reconcileChildren(workInProgress, children);
}

// 类组件
function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress;
  const instance = new type(props);
  const children = instance.render();
  reconcileChildren(workInProgress, children);
}

// 遍历子节点渲染
function reconcileChildren(workInProgress, children) {
  if (typeof children === 'string' || typeof children === 'number') return;

  const newChildren = Array.isArray(children) ? children : [children];
  let prevNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    let newFiber = {
      type: child.type,
      props: { ...child.props },
      stateNode: null,
      child: null,
      sibling: null,
      return: workInProgress,
    }

    if (typeof child === 'string') {
      newFiber.props = child;
    }

    if (i === 0) {
      // 第一个子 fiber
      workInProgress.child = newFiber;
    } else {
      // 给子 fiber 添加兄弟 fiber
      prevNewFiber.sibling = newFiber;
    }
    // 记录上一个 fiber
    prevNewFiber = newFiber;
  }
}

/**
 * Fiber
 * type 类型
 * key
 * props 属性
 * stateNode 原生标签
 * child 子节点
 * sibling 兄弟节点
 * return 父节点
 * */ 
function performUnitOfWork(workInProgress) {
  const { type } = workInProgress;
  if (typeof type === 'string') {
    updateHostComponent(workInProgress);
  } else if (typeof type === 'function') {
    if (type.prototype.isReactComponent) {
      updateClassComponent(workInProgress);
    } else {
      updateFunctionComponent(workInProgress);
    }
  } else if (typeof type === 'undefined') {
    updateTextComponent(workInProgress);
  }

  if(workInProgress.child) {
    return workInProgress.child;
  }
  
  let nextFiber = workInProgress;
  while (nextFiber) {
    // 存在兄弟节点返回
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    } else {
      // 往上找父节点
      nextFiber = nextFiber.return;
    }
  }
}

function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    // 执行任务，并返回新的任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  } 

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

window.requestIdleCallback(workLoop);
 
function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(workInProgress) {
  if (!workInProgress) return;

  let parenNodeFiber = workInProgress.return;

  while (!parenNodeFiber.stateNode) {
    parenNodeFiber = parenNodeFiber.return;
  }
   
  let parenNode = parenNodeFiber.stateNode;
  
  if (workInProgress.stateNode) {
    parenNode.appendChild(workInProgress.stateNode);
  }
  // 子节点
  commitWorker(workInProgress.child);
  // 兄弟节点
  commitWorker(workInProgress.sibling);
} 

export default { render }