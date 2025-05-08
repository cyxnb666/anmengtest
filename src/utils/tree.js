//扁平树形数据
export const flatTree = (arr, children = 'children') => {
    const res = [];
    if (arr?.length) {
      arr.forEach(item => {
        res.push(item);
        item[children] && item[children].length && res.push(...flatTree(item[children], children));
      });
    }
    return res;
  };
  export const getChildrenIds = (id, arr, { value = 'comCode' } = {}) => {
    let result = [];
    let hasItem = arr.find(v => v[value] == id);
    if (hasItem) {
      let children = hasItem.children;
      if (children && children.length) {
        result = lookForAllId(children, result, { value });
      }
    }
    return result;
  };
  function lookForAllId(data = [], arr = [], { value = 'comCode' } = {}) {
    for (let item of data) {
      arr.push(item[value]);
      if (item.children && item.children.length) lookForAllId(item.children, arr);
    }
    return arr;
  }
  //树形结构，children为空的置为null
  export function setChilrenToNull(tree) {
    const res = [];
    if (tree.length) {
      tree.forEach((it) => {
        const tmp = { ...it };
        if (tmp.children && tmp.children.length) {
          tmp.children = setChilrenToNull(tmp.children);
        } else {
          tmp.children = null;
        }
        res.push(tmp);
      });
    }
    return res && res.length ? res : null;
  }
  //获取已经选中的节点链路
  export function handerTree(arr, selectedIds, { children = 'children', id = 'id', unSelected = [] } = {}) {
    const list = [];
    arr.forEach(item => {
      // 如果该节点在选择合同列表里 直接push
      if (selectedIds.includes(item[id])) {
        list.push(item);
        item.isSelected = true;
        return;
      }
      // 如果存在子节点
      if (item[children] && item[children].length) {
        item[children] = handerTree(item[children], selectedIds, { children, id, unSelected });
        // 经过递归后还存在子节点说明该链路上有被选中的值
        if (item[children].length) {
          unSelected.push(item[id])
          list.push(item);
        }
      }
    });
    return list;
  }