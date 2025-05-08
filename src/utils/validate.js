/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }
  
  /**
   * 校验用户名
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUsername(str) {
    const reg = /^[A-Za-z0-9]+$/
    return reg.test(str)
  }
  /**
   * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
   * @description 判断是否是手机号
   * @param str
   * @returns {boolean}
   */
  export function isPhone(str) {
    const reg = /^1\d{10}$/
    return reg.test(str)
  }
  