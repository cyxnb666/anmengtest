import store from '@/store';
import button from './button';
const PERMISSION_CODE = {
  ...button
};
/**
 * 全局权限函数-使用v-if="hasPerm('viewPermission')"
 * @param {String} permission -权限key值
 * @returns
 */
export function hasPerm(permission) {
  if (!permission) return true;
  const code = PERMISSION_CODE[permission];
  const funtionIdList = store.getters.funtionIdList || [];
  return funtionIdList.indexOf(code) > -1;
}
//全局自定义指令函数-使用v-has:viewPermission  或者v-has="'viewPermission'"
export function checkPermission(el, binding) {
  let { value, arg,modifiers } = binding;
  let code = value || arg;
  const relCode = PERMISSION_CODE[code];
  let hasPer = store.getters.funtionIdList.includes(relCode);
  console.log(binding,' store.getters.funtionIdList')
  if (!hasPer) {
    el.parentNode && el.parentNode.removeChild(el);
  }
}
/**
 * 通过key获取权限码值
 * @param {Array|String} code
 * @returns
 */
export function getPermissionCode(code = []) {
  if (!Array.isArray(code)) {
    return PERMISSION_CODE[code];
  }
  return code.map(it => {
    return PERMISSION_CODE[it];
  });
}
export default PERMISSION_CODE;
