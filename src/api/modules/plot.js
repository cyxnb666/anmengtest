import request from '@/utils/request.js';

//查询规则列表
export function queryPlotListByPage(data = {}) {
  return request({
    url: '/queryPlotListByPage',
    method: 'post', 
    data
  });
}

// 删除勘察规则配置
export function deletePlotConfig(configId) {
    return request({
      url: `/PlotdelConfig/${configId}`,
      method: 'post'
    });
  }
  
  // 下架勘察规则配置
  export function offLinePlotConfig(configId) {
    return request({
      url: `/offLinePlot/${configId}`,
      method: 'post'
    });
  }
  
  // 发布勘察规则配置
  export function publishPlotConfig(configId) {
    return request({
      url: `/publishPlotOne/${configId}`,
      method: 'post'
    });
  }

  // 新增勘察规则配置
export function saveConfig(data = {}) {
    return request({
      url: '/PlotsaveConfig',
      method: 'post',
      data
    });
  }
  
  // 修改勘察规则配置
export function updateConfig(data = {}) {
    return request({
      url: '/PlotupdateConfig',
      method: 'post',
      data
    });
  }

  // 获取勘察规则配置详情
export function queryByIdPlot(configId) {
    return request({
      url: `/queryByIdPlot/${configId}`,
      method: 'post'
    });
  }

// src/api/modules/plot.js 中添加
export function selectPlotConfigComcode(configId) {
  return request({
    url: `/selectPlotConfigComcode/${configId}`,
    method: 'post'
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

// 查询所有险类数据
export function selectWholeClasses() {
  return request({
    url: '/risk-clause-config/selectWholeClasses',
    method: 'post'
  });
}

// 根据险类代码查询险种
export function selectClassesRisks(classesCode) {
  return request({
    url: `/risk-clause-config/selectClassesRisks/${classesCode}`,
    method: 'get'
  });
}