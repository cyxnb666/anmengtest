/**
 * 格式化日期时间
 * @author LinXin 2022-07-26
 * @param {Date} date 日期时间对象
 * @returns {String} 格式: yyyyMMddHHmmss
 */
exports.formatDateTime = function(date = new Date()) {
    return date.toLocaleString('chinese', { hour12: false })
      .split(' ')
      .reduce((res, item) => (res += item.includes('/')
        ? item.split('/').reduce((str, s) => (str += (s.length === 1) ? `0${s}` : s), '')
        : item.replace(/:/g, '')), '')
  }
  
  /**
   * 生成版本编码
   * @author LinXin 2022-07-26
   * @param {String} prefix 版本前缀
   * @param {String} env 运行环境
   * @returns {String} 格式: prefix + env + yyyyMMddHHmmss
   */
  exports.generateVersion = function(prefix, env) {
    prefix = `${prefix || process.env.npm_package_name || ''}-`
    env = `${env || process.env.NODE_ENV || ''}-`
    const fdt = exports.formatDateTime()
    return `${prefix}${env}${fdt}`
  }
  
  /**
   * 创建文件名匹配正则(正反双向)
   * @author LinXin 2022-07-26 使用示例在函数底部查阅！
   * @param {String} rule 规则字符串，默认: [name].js，
   *                      示例: _[name].js | _[name]_.js
   * @returns {Object} => 详细返回参数如下: {
   *    @arg {RegExp} direct  正向
   *    @arg {RegExp} inverse 反向
   * }
   */
  exports.createFileMatchReg = function(rule = '[name].js') {
    const splReg = /(\[name\]|\.)/
    const { direct, inverse } = rule.split(splReg).filter(s => !splReg.test(s)) // 切割前后扩展
      .reduce((total, item, index) => {
        if (!item) return total
        switch (index) {
          case 0:// 添加前缀
            total.direct = `\\${item}` + total.direct
            total.inverse += `^\\${item}|`
            break
          case 1:// 添加后缀
            total.direct += `\\${item}`
            total.inverse += `\\${item}`
            break
          case 2:// 添加扩展名
            total.direct += `\\.${item}$`
            total.inverse += `\\.${item}$)`
            break
        }
        return total
      }, { direct: '([A-Z]|[a-z]|[0-9])+', inverse: '(^\\.\\/|' })
  
    // 返回匹配正则结果
    return {
      direct: new RegExp(direct, 'g'),
      inverse: new RegExp(inverse, 'g')
    }
  }
  
  /**
   * 批量导入指定文件路径下符合命名规则的文件
   * @author LinXin 2022-07-26 使用示例在函数底部查阅！
   * @param {String} src 批量导入文件路径
   * @param {String} mode 导入模式，默认 'object'，可选 'single' | 'array'
   * @param {String} rule 子文件名称匹配规则，默认为 '[name].js'，可选: _[name].js | _[name]_.js
   * @returns {Object|Array}
   *    - 'object'  返回按子文件名合成对象[name:string]:object
   *    - 'single'  返回子文件内容合成的一个对象，合并规则:
   *                - 如果子文件为 `object`，则使用 `Object.assign` 并入
   *                - 否则以文件名为key，文件内容为值并入
   *    - 'array'   返回子文件内容合成的一个数组，合并规则:
   *                - 如果子文件为 `array`，则使用 `Array.concat` 并入
   *                - 否则使用 `Array.push` 并入
   */
  exports.importFiles = function(src, mode = 'object', rule) {
    if (!(src && typeof src === 'string')) return // src为必须提供，如无则不退出
    const { direct, inverse } = exports.createFileMatchReg(rule) // 创建文件名匹配正则
  
    // 使用正则匹配文件路径下的子文件
    const requireContext = require('require-context')
    const files = requireContext(src, true, direct)
  
    // 导入子文件内容承载容器
    let arrModules = [/** ...moduleItem */]
    let sglModules = {/** ...moduleItem */}
    const objModules = {/** moduleName: moduleItem */}
  
    // 按传入mode开始生成对应数据内容
    files.keys().forEach(moduleId => {
      console.log('moduleId', moduleId)
      const moduleName = moduleId.replace(inverse, '')
      let moduleItem
      try {
        moduleItem = files(moduleId)
      } catch (error) {
        console.log('error', error)
      }
  
      if (typeof moduleItem === 'object') {
        const moduleIsArr = moduleItem instanceof Array
        objModules[moduleName] = Object.keys(moduleItem).reduce((total, childId) => {
          const childItem = moduleItem[childId]
          if (mode === 'array') arrModules = arrModules.concat(childItem)
          moduleIsArr ? total = total.concat(childItem) : total[childId] = childItem
          return total
        }, moduleIsArr ? [] : {})
      } else {
        objModules[moduleName] = moduleItem
        arrModules.push(moduleItem)
      }
  
      if (mode === 'single') {
        const ripeModeItem = objModules[moduleName]
        Object.prototype.toString.call(ripeModeItem) === '[object Object]'
          ? sglModules = Object.assign({}, sglModules, ripeModeItem)
          : sglModules[moduleName] = moduleItem
      }
    })
  
    // 按传入mode返回符合要求的数据
    switch (mode) {
      case 'single': return sglModules
      case 'array': return arrModules
      default: return objModules
    }
  
  /**
   * @example
   * ## ./build/a.js ##
   * ```
   * module.exports = { w: 1, e: 2, r: 3 }
   * ```
   *
   * ## ./build/b.js ##
   * ```
   * module.exports = [
   *  { name: 'zhangsan', key: 1 },
   *  { name: 'lisi', key: 2 },
   *  { name: 'wanger', key: 3 }
   * ]
   * ```
   *
   * ## ./build/c.js ##
   * ```
   * module.exports = function() {}
   * ```
   *
   * ## ./index.js ##
   * ```
   * const path = require('path')
   * const { importFiles } = require('cli-service-tb/utils')
   * const dir = path.join(__dirname, './build')
   * const content = importFiles(dir)
   * console.log('content', content)
   * ```
   *
   * ## console log ##
   * ```
   * content {
   *  a: { w: 1, e: 2, r: 3 },
   *  c: [Function (anonymous)],
   *  d: [
   *      { name: 'zhangsan', key: 1 },
   *      { name: 'lisi', key: 2 },
   *      { name: 'wanger', key: 3 }
   *   ]
   * }
   * ```
   */
  }
  
  /**
   * 将URL后跟的参数转为对象
   * @param {String} url URL地址
   * @returns {Object}
   */
  exports.param2Obj = function(url) {
    const obj = {}
  
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
    if (search) {
      return search.split('&').reduce((obj, v) => {
        const index = v.indexOf('=')
        if (index !== -1) {
          const name = v.substring(0, index)
          const val = v.substring(index + 1, v.length)
          obj[name] = val
        }
        return obj
      }, obj)
    }
  
    return obj
  }
  