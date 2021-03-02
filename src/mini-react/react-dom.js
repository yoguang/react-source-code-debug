/**
 * vnode 生产的 虚拟node节点
 * container 节点插入容器 dom 节点
 * */
function render(vnode, container) {
  // vnode 生产真实 dom 节点
  console.log('vnode: ', vnode);
  const node = createNode(vnode);
  container.appendChild(node);
}

function createNode(vnode) {
  let node;
  const { type } = vnode;
  if (typeof type === 'string') {
    node = updateHostComponent(vnode);
  }
  else if (typeof type === 'function') {
    node = type.prototype.isReactComponent
      ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode);
  }
  else {
    node = updateTextComponent(vnode);
  }
  return node;
}

// 原生标签节点
function updateHostComponent(vnode) {
  const { type, props } = vnode;
  const node = document.createElement(type);
  updateNode(node, props);
  reconcileChildren(node, props.children);
  return node;
}

// 更新属性
function updateNode(node, props) {
  // react 内部使用的属性
  const excludes = ['children', 'key', 'ref'];
  Object.keys(props)
    .filter(k => !excludes.includes(k))
    .forEach(k => node[k] = props[k]);
}

// 文本节点
function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode);
  return node;
}

// 函数组件
function updateFunctionComponent(vnode) {
  const { type, props } = vnode;
  // 这里还是vnode
  const $vnode = type(props);

  const node = createNode($vnode);
  return node;
}

// 类组件
function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const instance = new type(props);
  const $vnode = instance.render();

  const node = createNode($vnode);
  return node;
}

// 遍历子节点渲染
function reconcileChildren(parenNode, children) {
  const newChildren = Array.isArray(children) ? children : [children];
  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    render(child, parenNode);
  }
}



export default { render }