import request from '@/utils/request.js';
// 发送短信验证码
export function sendSMS(data = {}) {
  return request({
    url: '/agriSwitch/sendSMS',
    method: 'post',
    data
  });
}
export function errorDownUrlSendSMS(data={}) {
  return request({
    url: '/agriSwitch/errorDownUrlSendSMS',
    data,
    method: 'post'
  })
}
// 校验短信验证码
export function codeVerify(data = {}) {
  return request({
    url: '/agriSwitch/codeVerify',
    method: 'post',
    data
  });
}
// 登录
export function login(data) {
  return request({
    url: '/sysUser/sysLogin',
    method: 'post',
    data
  })
}
// 退出
export function logout() {
  return request({
    url: 'sysUser/logout',
    method: 'post'
  })
}
//获取图片验证码
export function getCodeImg() {
  return request({
    url: '/sysUser/getCode',
    method: 'post',
  })
}
//获取服务器时间和加密publickey
export function getSystemInfo(data = {}) {
  return request({
    url: '/sysUser/publicKey',
    method: 'post',
    data
  });
}
// 上传图片
export function uploadImg(data) {
  return request({
    url: '/applets/product/uploadImg',
    method: 'post',
    timeout: 60 * 1000 * 60,
    data
  });
}
//获取菜单
export function getMenus(data) {
  let url = '/sys-menu/getTreeByRole';
  return request({
    url,
    method: 'post',
    data
  });
}

//销售区域查询
export function queryDistrict(data) {
  return request({
    url: '/mechanism-info/deptTree',
    method: 'post',
    errorTip:true,
    data
  })
}

export function queryCodeConfig() {
  return request({
    url: '/agricodeconfig/selectAllCode',
    method: 'post',
    errorTip:true
  })
}

