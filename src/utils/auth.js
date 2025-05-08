import Cookies from 'js-cookie';
import { tokenCookieExpires, TokenKey } from '@/settings';
let key = 'SYSTEM_INFO_AM';

export function getToken() {
  let result = null;
  let data = Cookies.get(TokenKey);
  if (data) {
    result = JSON.parse(data);
  }
  return result;
}

export function setToken(user = {}, rememberMe) {
  var cookie = {
    ...user
  };
  if (rememberMe) {
    return Cookies.set(TokenKey, cookie, { expires: tokenCookieExpires });
  } else return Cookies.set(TokenKey, cookie);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function setSystemInfo(data = {}) {
  if (!data) {
    return;
  }
  let str = JSON.stringify(data);
  localStorage.setItem(key, result);
}
export function getSystemInfo() {
  let data = localStorage.getItem(key);
  if (data && typeof data === 'string' && data != 'undefined') {
    data = JSON.parse(result);
  }
  return data;
}
export function removeSystemInfo() {
  localStorage.removeItem(key);
}