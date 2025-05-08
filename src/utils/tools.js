import _ from 'lodash'; dayjs;
import dayjs from 'dayjs';
import { Message } from 'element-ui';
import router from '@/router';
var quarterOfYear = require('dayjs/plugin/quarterOfYear');
dayjs.extend(quarterOfYear);

// 获取今天日期
export function getToday(sign = 'YYYY-MM-DD') {
  return dayjs().format(sign);
}
// 获取日期
export function getDateBySign(sign, control = 'startOf', fmt = 'YYYY-MM-DD') {
  return dayjs()[control](sign).format(fmt);
}
export function getCurrentMonth(fmt = 'YYYY-MM-DD') {
  return {
    toDay: dayjs().format(fmt),
    startDate: dayjs().startOf('month').format(fmt),
    endDate: dayjs().endOf('month').format(fmt),
    startWeekDate: getDateBySign('week', 'startOf', fmt),
    endWeekDate: getDateBySign('week', 'endOf', fmt),

    startYearDate: getDateBySign('year', 'startOf', fmt),
    endYearDate: getDateBySign('year', 'endOf', fmt),

    startQuarterDate: getDateBySign('quarter', 'startOf', fmt),
    endQuarterDate: getDateBySign('quarter', 'endOf', fmt),
  };
}
// 计算相对单位
export function fontSize(res = 0) {
  let size = res / 100;

  let clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (!clientWidth) return;
  let fontSize = 100 * (clientWidth / 1920);
  return size * fontSize;
}
// 为了在删除最后一页的最后一条数据时能成功跳转回最后一页的上一页(单次删除)
export const getCurrentPage = ({ total, current, size, normal = false } = {}) => {
  if (normal || current === 1) return current;
  const totalPage = Math.ceil((total - 1) / size);
  const currentPage = current > totalPage ? totalPage : current;
  return currentPage < 1 ? 1 : currentPage;
};
// 批量删除
export const getBatchDelCurrentPage = ({ total, current = 1, size = 10, num = 0 }) => {
  if (current === 1 || !num) return current;
  const totalPage = Math.ceil((total - 1) / size);
  let currentNum = total - (current - 1) * size;
  currentNum = current < totalPage ? size : currentNum;
  if (num === currentNum) {
    current = current - 1 || 1;
  }
  return current;
};
// 获取数组对象中的值
export function findValue({ arr, key = 'id', val, name = 'name' } = {}) {
  let result = '';
  if (arr?.length && val) {
    const hasItem = arr.find(v => v[key] === val);
    if (hasItem && hasItem[name]) {
      result = hasItem[name];
    }
  }
  return result;
}
/**
 * 转换目标值的key
 * @param {Object} obj
 * @param {Object} config
 * @returns
 */
function transformObjKeys(obj = {}, config = {}) {
  let result = {};
  if (obj) {
    result = { ...obj };
    Object.keys(config).forEach(it => {
      const val = config[it];
      if (typeof val === 'object') {
        result[it] = val.format ? val.format(obj[val.value]) : '';
      } else {
        result[it] = obj[val];
      }
    });
  }
  return result;
}
// 转换key值
export function transformKeys(data, config) {
  let result = null;
  if (data) {
    if (Array.isArray(data)) {
      result = data.map(it => {
        it = transformObjKeys(it, config);
        return it;
      });
    } else {
      result = transformObjKeys(data, config);
    }
  }
  return result;
}
//获取uuid
export function getUuid() {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}
/**
 * 并发请求
 * @param {Array} requests -总请求数组
 * @param {Function} handler
 * @param {Object} config -{
 *  limit 并发数量
 *  isCancel 是否取消
 * }
 */
export async function eachLimit(requests, handler, config = {}) {
  const { limit = 3 } = config;
  const res = [];
  const activeList = [];
  for (const item of requests) {
    if (config.isCancel) {
      return Promise.reject();
    }
    const p = handler(item);
    res.push(p);
    const e = p.then(() => activeList.splice(activeList.indexOf(e), 1));
    activeList.push(e);

    while (activeList.length >= limit) {
      await Promise.race(activeList);
    }
  }
  return Promise.all(res);
}
/**
 * 防抖函数
 * @param {Function} fn - 传入的方法
 * @param {Number} [delay] - 延时时间
 */
export const debounce = (fn, delay = 400) => {
  let timer = null;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};
/**
 * 销售区域，值的类型转换
 * @param {String} salesOrganization
 * @param {Boolean} isSet -true为传给后端的格式，false获取
 * @returns
 */
export function getSales(salesOrganization, isSet = true) {
  let result = '';
  if (salesOrganization) {
    if (isSet) {
      let str = salesOrganization.filter(it => it).join(',');
      result = str ? `,${str},` : '';
    } else {
      result = salesOrganization.split(',').filter(Boolean);
    }
  }
  return result;
}
// 保留小数
export const round = (num, decimal = 2) =>
  Math.round(num * 10 ** decimal) / 10 ** decimal;
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
//导出excel
export function downLoadExcelFile(res, reName, cb, success) {
  if (
    res &&
    res.data &&
    res.data.type &&
    res.data.type === 'application/json'
  ) {
    let reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const result = JSON.parse(reader.result);
      cb && cb(result);
    });
    reader.readAsText(res.data, 'utf-8');
    return;
  }
  const blob = res.data || res;
  if (navigator.msSaveBlob) {
    window.navigator.msSaveOrOpenBlob(blob, reName);
    return;
  }
  var a = document.createElement('a');
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = reName;
  a.click();
  window.URL.revokeObjectURL(url);
  success && success();
}
// 数组对象去重
export function removeArr(arr, id = 'id') {
  if (!arr || arr.length == 0) {
    return [];
  }
  let has = {};
  arr = arr.reduce((item, next) => {
    if (next[id]) {
      let key = next[id];
      if (!has[key]) {
        has[key] = true;
        item.push(next);
      }
    } else {
      item.push(next);
    }
    return item;
  }, []);

  return arr;
}
// 格式化
export const format = (date, fmt = 'YYYY-MM-DD') => {
  return date ? dayjs(date).format(fmt) : '';
};
export const downFile = (imageId, fileName, isUrl) => {
  let $imgUrl = getUrl('fileviewUrl', '');
  const url = isUrl ? imageId : `${$imgUrl}?ImgId=${imageId}`;
  downLoadByUrl(url, fileName);
};
export function downLoadByUrl(url, fileName) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      // 将链接地址字符内容转变成blob地址
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      //测试链接console.log(a.href)
      a.download = fileName || '下载文件'; // 下载文件的名字
      document.body.appendChild(a);
      a.click();
    });
}
// 是否为Json字符串
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
// 对象值转换为json
export function objToJson(obj, toNums = []) {
  const result = {};
  for (const key in obj) {
    const val = obj[key];
    if (val && isJSON(val)) {
      result[key] = JSON.parse(val);
    } else {
      result[key] = val;
      if (val && toNums.indexOf(key) !== -1) {
        result[key] = Number(val);
      }
    }
  }
  return result;
}
// 数据值转换为json
export function dataToJson(data) {
  let result = data;
  if (data) {
    if (Array.isArray(data)) {
      result = data.map((it) => {
        return objToJson(it);
      });
    } else {
      result = objToJson(data);
    }
  }
  return result;
}
// 提交数据住json字符串
export function jsonToStr(data = {}, arr = []) {
  let result = deepClone(data);
  Object.keys(result).forEach(key => {
    if (result[key]) {
      if (arr?.length) {
        if (arr.includes(key)) {
          result[key] = JSON.stringify(result[key]);
        }
      } else if (Array.isArray(result[key])) {
        result[key] = JSON.stringify(result[key]);

      }
    }
  });
  return result;
}
/**获取label
 {  
    isArrResult-是否需要数组型结果
    otherParam-其他参数
    sliceNum-截取数量
  },
  needResult-是否需要结果
  */
export function getObjLabel({ label = 'label', value = "value", val = '', isArrResult, arr = [], isArr = false, sliceNum, otherParam } = {}, needResult = false,) {

  if (!isArr && !Array.isArray(val)) {
    let result = val;
    let config = {};
    let hasItem = arr.find(v => v[value] == val);
    if (hasItem) {
      result = hasItem[label] || val;
      config = { ...hasItem };
    }
    if (needResult) {
      return config;
    }
    return result;
  } else {
    let arrResult = [];
    let config = [];

    if (val && arr?.length) {
      let valArr = deepClone(val);
      if (sliceNum) {
        valArr = valArr.slice(0, sliceNum);
      }
      valArr.forEach(it => {
        let hasItem = arr.find(v => v[value] == it);
        if (hasItem) {
          let labelStr = hasItem[label];
          if (otherParam) {
            labelStr += `(${hasItem[otherParam]})`;
          }
          arrResult.push(labelStr);
          config.push(hasItem);
        }
      });
    }
    if (needResult) {
      return config;
    }
    if (isArrResult) {
      return arrResult;
    }
    return !sliceNum ? arrResult.join('、') : arrResult.join('、') + '...';
  }

}
/**
 * 深拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  return _.cloneDeep(source);
}

export const getBool = (val) => {
  let flag = false;
  if (val) {
    if (typeof val == 'string') {
      flag = val === '1' || val === 'true';
    } else {
      flag = true;
    }
  }
  return flag;
};

/**
 * 获取对象中的某些key值
 * @param config-key值数组
 */
export function getObjData(obj, config = []) {
  let result = {};
  config.forEach((key) => {
    result[key] = deepClone(obj[key]);
  });
  return result;
}

export function isTrue(val) {
  if (typeof val === 'string') {
    return val === 'true';
  } else {
    return val ? true : false;
  }
}
//前端分页
export function sliceTableData({ tableData, currentPage, pageSize = 10 } = {}) {
  return tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
}
export function textCopy(t) {
  // 如果当前浏览器版本不兼容navigator.clipboard
  if (!navigator.clipboard) {
    var ele = document.createElement("input");
    ele.value = t;
    document.body.appendChild(ele);
    ele.select();
    document.execCommand("copy");
    document.body.removeChild(ele);
    if (document.execCommand("copy")) {
      Message.success('复制成功');
      console.log("复制成功！");
    } else {
      Message.error('复制失败');
      console.log("复制失败！");
    }
  } else {
    navigator.clipboard.writeText(t).then(function () {
      Message.success('复制成功');
      console.log("复制成功！");
    }).catch(function () {
      Message.error('复制失败');
      console.log("复制失败！");
    });
  }
}

export function _isMobile() {
  let flag = navigator.userAgent.match(
    /(phone|pad|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows phone)/i
  );
  return flag;
}

export function setHtmlVw() {
  const oHtml = document.getElementsByTagName('html')[0];
  if (_isMobile()) {
    oHtml.style.fontSize = (100 / 750) * 100 + 'vw';
  } else {
    // oHtml.style.fontSize = '12px';
  }
}

//获取随机数
export function makeRandom(maximum=200, minimum = 1) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}
// ******123490 隐藏案件号
export function showCaseNo(str, startNum = 4, endNum = 5) {
  let result = str || '';
  if (result && result.length > 12) {
    result = str.substr(0, startNum) + '****' + str.substr(str.split('').length - endNum, str.split('').length);
  }
  return result;
}

export function $log(text, { color, type } = {}) {
  color = color;
  switch (type) {
    case 'warn':
      color = 'red';
      break;
    case 'success':
      color = 'blue';
      break;
    default:
      color = 'red';
  }
  // 浏览器控制台通常不支持完整的ANSI转义码，但一些浏览器支持%c来指定样式  
  // color参数应该是一个有效的CSS颜色值，如"red"、"green"等，或者十六进制颜色代码如"#ff0000"  
  let style = `color: ${color}; font-weight: bold;`; // 可以添加更多样式  
  console.log(`%c${text}`, style);
}  