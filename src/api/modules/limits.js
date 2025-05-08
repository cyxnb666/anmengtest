import request from '@/utils/request.js';

// 分页查询限额配置列表
export function queryListByPage(data = {}) {
    return request({
      url: '/queryListByPage',
      method: 'post',
      data
    });
  }

  // 删除配置
  export function deleteLimitConfig(configId) {
    return request({
      url: `/delCommonConfig/${configId}`,
      method: 'post'
    });
  }
  
  // 下架配置
  export function offLineLimitConfig(configId) {
    return request({
      url: `/offLine/${configId}`,
      method: 'post'
    });
  }
  
  // 发布配置
  export function publishLimitConfig(configId) {
    return request({
      url: `/publishOne/${configId}`,
      method: 'post'
    });
  }

    // 新增
export function saveCommonConfig(data = {}) {
    return request({
      url: '/saveCommonConfig',
      method: 'post',
      data
    });
  }
  
  // 修改
export function updateCommonConfig(data = {}) {
    return request({
      url: '/updateCommonConfig',
      method: 'post',
      data
    });
  }

    // 获取详情
export function queryById(configId) {
    return request({
      url: `/queryById/${configId}`,
      method: 'post'
    });
  }
  
    // 获取机构代码
  export function selectCommonConfigComcode(configId) {
    return request({
      url: `/selectCommonConfigComcode/${configId}`,
      method: 'post'
    });
  }