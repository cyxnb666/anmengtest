
import { deepClone } from '@/utils';
import { getObjLabel } from '@/utils/tools';

//扁平树形数据

export const flatTree = (arr, children = 'conditions') => {
  const res = [];
  arr.forEach(item => {
    res.push(item);
    item[children] && item[children].length && res.push(...flatTree(item[children], children));
  });
  return res;
};
//获取因子code,值
export function getDivisorData(configData, factorOptions) {
  let configInfoData = deepClone(configData);
  let { elseIf } = configInfoData;
  let arr = [];
  arr.push(...flatTree(configInfoData.if.conditions, 'conditions'));
  elseIf.forEach((it) => {
    arr.push(...flatTree(it.if.conditions, 'conditions'));
  });
  let keys = [];
  arr.forEach((it) => {
    let { left, opConfig, sign, value } = it;
    if (sign == 'condition') {
      if (left.content) {
        keys.push(left.content);
      }
      if (it.valueType == 'factor') {
        let isArr = opConfig.multiple;
        let val = isArr ? deepClone(value.contentList) : value.content;
        if (isArr) {
          keys.push(...val);
        } else {
          keys.push(val);
        }
      }
    }
  });
  let divisorKeys = [...new Set(keys)];
  let divisorData = getObjLabel(
    {
      val: divisorKeys,
      value: 'divisorCode',
      label: 'divisorName',
      isArr: true,
      arr: factorOptions,
    },
    true,
  ).map((v) => {
    return {
      divisorCode: v.divisorCode,
      divisorName: v.divisorName,
    };
  });

  return divisorData;
}
export class CalcPosition {
  constructor() {
    this.splitHeight = 50;
    this.splitWidth = 120;
    this.xInit = 0;
    this.yInit = 0;
    this.pathXSplit = 53;
    this.pathYSplit = 13;
  }
  //删除
  removeItem(treeList, val, { id = 'key', children = 'conditions' } = {}) { // 根据id属性从数组（树结构）中移除元素
    if (!treeList || !treeList.length) {
      return;
    }
    for (let i = 0; i < treeList.length; i++) {
      if (treeList[i][id] === val) {
        treeList.splice(i, 1);
        break;
      }
      this.removeItem(treeList[i][children], val);
    }
  }
  //计算坐标以及svg的path路径
  setPos(arr,isResult) {
    let height = this.yInit;
    let width = this.xInit;
    let splitHeight = this.splitHeight;
    let splitWidth = this.splitWidth;
    let pathXSplit = this.pathXSplit;
    let pathYSplit = this.pathYSplit;
    let key = 0;
    const pathLineList = [];
    const conditionsBox = [
      {
        pos: [0, 0],
        conditions: arr || []
      }
    ];
    function setInner(data) {
      const result = [];
      data.forEach((item, i) => {
        const map = (data, { prevItem, index } = {}) => {
          //计算坐标
          if (!data.pos) {
            data.pos = [];
          }
          data.x = width;
          let actionHeight=data.actionHeight||0
          if(isResult){
            actionHeight=0
          }
          if (prevItem && index == 0) {
            data.y = prevItem.y;
            height += actionHeight;
          } else {
            let currentSplitHeight=splitHeight+actionHeight
            data.y = height;
            height += currentSplitHeight;
          }
          data.key = key;
          key++;
          data.pos = [data.x, data.y];
          // 计算曲线path
          if (prevItem) {
            let [sx, sy] = prevItem.pos;
            let [x, y] = data.pos;
            let SX = sx + pathXSplit;
            let SY = sy + pathYSplit;
            let yPath = y + pathYSplit;
            let str = `M${SX},${SY}C${SX},${yPath},${SX},${yPath},${x},${yPath}`;
            pathLineList.push(str);
          }
          if (data.conditions && data.conditions.length) {
            width += splitWidth;
            data.conditions.forEach((child, i) => map(child, { prevItem: data, index: i }));
          }
        };
        map(item, { prevItem: null, index: i });
      });
      return result.join(',');
    }
    setInner(conditionsBox);
    return { flatData: flatTree(arr), pathLineList };
  }
}