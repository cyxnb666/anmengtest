import request from '@/utils/request.js';
// 查询方法
export function pageTarget(data = {}) {
  return request({
    url: '/target-config/pageTarget',
    method: 'post',
    data
  });
}
// 删除方法
export function deleteTarget(data = {}) {
  return request({
    url: '/target-config/deleteTarget',
    method: 'post',
    data
  });
}
// 新增方法
export function addTarget(data = {}) {
  return request({
    url: '/target-config/addTarget',
    method: 'post',
    data
  });
}
// 修改方法
export function updateTarget(data = {}) {
  return request({
    url: '/target-config/updateTarget',
    method: 'post',
    data
  });
}
//查询所有类路径
export function selectClasspath(data = {}) {
  return request({
    url: '/function/selectClasspath',
    method: 'post',
    data
  });
}
//查询所有类方法
export function queryMethod(data = {}) {
  return request({
    url: '/function/selectAllMethodName',
    method: 'post',
    params: {
      ...data
    },

  });
}

export function selectTargetPath(data = {}) {
  return request({
    url: '/target-config/selectTargetPath',
    method: 'post',
    params: {
      ...data
    },

  });
}
//查询所有函数
export function queryAllTarget(data = {}) {
  return request({
    url: '/target-config/selectTarget',
    method: 'post',
    data
  });
}
// ++++++++++常量++++++++++++
//查询常量
export function pageConstant(data = {}) {
  return request({
    url: '/constant-config/pageConstant',
    method: 'post',
    data
  });
}
//新增常量
export function addConstant(data = {}) {
  return request({
    url: '/constant-config/addConstant',
    method: 'post',
    data
  });
}
//删除常量
export function deleteConstant(data = {}) {
  return request({
    url: '/constant-config/deleteConstant',
    method: 'post',
    data
  });
}
//修改常量
export function updateConstant(data = {}) {
  return request({
    url: '/constant-config/updateConstant',
    method: 'post',
    data
  });
}
//查询所有常量
export function pageAllConstant(data = {}) {
  return request({
    url: '/constant-config/selectConstant',
    method: 'post',
    data
  });
}
//查询险种
export function selectAllRisk(data = {}) {
  return request({
    url: '/risk-clause-config/selectAllRisk',
    method: 'post',
    data
  });
}
//查询条款
export function selectClause(data = {}) {
  return request({
    url: '/risk-clause-config/selectClause',
    method: 'post',
    data
  });
}
