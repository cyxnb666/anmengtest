import request from '@/utils/request.js';

//查询规则
export function queryListTTargeByPage(data = {}) {
    return request({
      url: '/queryListTTargeByPage',
      method: 'post',
      data
    });
  }

//新增接口
export function saveTTarge(data = {}) {
  return request({
    url: '/saveTTarge',
    method: 'post',
    data
  });
}

//更新接口
export function updateTTarge(data = {}) {
  return request({
    url: '/updateTTarge',
    method: 'post',
    data
  });
}

// 根据险种查询条款信息
export function selectClause(data = {}) {
  return request({
    url: '/risk-clause-config/selectClause',
    method: 'post',
    data
  });
}

// 获取详情接口
export function queryByIdTTarge(id) {
  return request({
    url: `/queryByIdTTarge/${id}`,
    method: 'post'
  });
}

// 删除接口
export function delTTarge(id) {
  return request({
    url: `/delTTarge/${id}`,
    method: 'post'
  });
}

// 下架接口
export function offLineTTarge(id) {
  return request({
    url: `/offLineTTarge/${id}`,
    method: 'post'
  });
}

// 发布接口
export function publishOneTTarge(id) {
  return request({
    url: `/publishOneTTarge/${id}`,
    method: 'post'
  });
}

// 获取机构代码
export function selectTargetConfigComcode(configId) {
  return request({
    url: `/selectTargetConfigComcode/${configId}`,
    method: 'post'
  });
}