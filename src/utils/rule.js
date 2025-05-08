import { opOptions } from '@/config/rule'

//获取表达式
export function getExpress(arr, refType = 'and') {
  let result = '';
  arr.forEach((item, index) => {
    if (item.sign === 'condition') {
      result += `${getLeftContent(item.left)}${getOp(item.op,item)}${getRightContent(item.value)
        }`;
    } else {
      result += `(${getExpress(item.conditions, item.refType)})`;
    }
    if (arr.length - 1 !== index) {
      result += `${getRefType(refType)}`;
    }
  });
  return result;
}
//获取逻辑符
export function getRefType(refType) {
  return refType == 'and' ? '&&' : '||';
}
function getLeftContent(leftData){
  return leftData.divisorName
}
function getRightContent(rightValue){
  return rightValue.labels||''
}
//获取逻辑符
export function getOp(val,item) {
  console.log(val,item,'val')
  let opData = opOptions.find((v) => v.value == val);
  if(val==='function'){
    return `（${item.functionName.targetFunctionName}）`
  }
  return opData.op || `（${opData.label}）`;
}