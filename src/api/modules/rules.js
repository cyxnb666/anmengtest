import request from '@/utils/request.js';

// 查询因子
export function queryAgriDivisorList(data = {}) {
  return request({
    url: '/baseDivisor/queryAgriDivisorList',
    method: 'post',
    data
  });
}
// 新增因子
export function saveBAgriDivisor(data = {}) {
  return request({
    url: '/baseDivisor/saveBAgriDivisor',
    method: 'post',
    data
  });
}
// 修改因子
export function updateAgriDivisors(data = {}) {
  return request({
    url: '/baseDivisor/updateAgriDivisors',
    method: 'post',
    data
  });
}
// 删除因子
export function deleteAgriDivisor(data = {}) {
  return request({
    url: '/baseDivisor/deleteAgriDivisor',
    method: 'post',
    data
  });
}
//查询所有因子
export function queryAgriDivisorAll(data = {}) {
  return request({
    url: '/baseDivisor/queryAgriDivisorAll',
    method: 'post',
    data
  });
}
// +++++++++++++++++++++规则配置+++++++++++

//查询规则
export function queryAgriRuleList(data = {}) {
  return request({
    url: '/baseAgriRule/queryAgriRuleList',
    method: 'post',
    data
  });
}
//新增规则
export function saveBAgriRule(data = {}) {
  return request({
    url: '/baseAgriRule/saveBAgriRule',
    method: 'post',
    data
  });
}
//修改规则
export function updateAgriRule(data = {}) {
  return request({
    url: '/baseAgriRule/updateAgriRule',
    method: 'post',
    data
  });
}
//删除规则
export function deleteAgriRule(data = {}) {
  return request({
    url: '/baseAgriRule/deleteAgriRule',
    method: 'post',
    data
  });
}
//调式规则
export function excuteAgriRule(data = {}) {
  return request({
    // url: '/baseAgriRule/excuteAgriRule',
    url: '/baseAgriRule/testAgriRule',

    method: 'post',
    timeout:36*60*1000,
    data
  });
}
//发布规则
export function publishAgriRule(data = {}) {
  return request({
    url: '/baseAgriRule/publishAgriRule',
    method: 'post',
    data
  });
}
// +++++++++++++++++++++++版本查询++++++++++++++++++++++++++++++

//查询历史版本列表
export function queryAgriRuleSonList(data = {}) {
  return request({
    url: '/baseAgriRuleSon/queryAgriRuleSonList',
    method: 'post',
    data
  });
}
//新增版本
export function saveAgriRuleSon(data = {}) {
  return request({
    url: '/baseAgriRuleSon/saveAgriRuleSon',
    method: 'post',
    data
  });
}
//复制版本
export function copyAgriRuleSon(data = {}) {
  return request({
    url: '/baseAgriRuleSon/copyAgriRuleSon',
    method: 'post',
    data
  });
}
//修改版本
export function updateAgriRuleSon(data = {}) {
  return request({
    url: '/baseAgriRuleSon/updateAgriRuleSon',
    method: 'post',
    data
  });
}
//删除版本
export function deleteAgriRuleSon(data = {}) {
  return request({
    url: '/baseAgriRuleSon/deleteAgriRuleSon',
    method: 'post',
    data
  });
}

//发布版本
export function publishAgriRuleSon(data = {}) {
  return request({
    url: '/baseAgriRuleSon/publishAgriRuleSon',
    method: 'post',
    data
  });
}
//下架版本
export function delistAgriRuleSon(data = {}) {
  return request({
    url: '/baseAgriRuleSon/delistAgriRuleSon',
    method: 'post',
    data
  });
}
