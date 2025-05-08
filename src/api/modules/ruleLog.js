import request from '@/utils/request.js';

//查询规则列表
export function queryRuleExecPage(data = {}) {
  return request({
    url: '/agri-rule-exec-date/queryRuleExecPage',
    method: 'post', 
    data
  });
}

//查询执行日志分页
export function queryExecLogPage(data = {}) {
  return request({
    url: '/agri-rule-exec-date/queryExecLogPage',
    method: 'post', 
    data
  });
}

//规则执行详情
export function getAgriRuleExecDateVO(ruleExecId) {
  return request({
    url: `/agri-rule-exec-date/getAgriRuleExecDateVO/${ruleExecId}`,
    method: 'get',
  });
}

//下载
export function downExport(data = {}) {
  return request({
    url: '/agri-rule-exec-date/export',
    method: 'post', 
    data,
    responseType: 'blob'
  });
}

// 投保信息的完整性、准确性
export function selectProposalReports(data = {}) {
  return request({
    url: '/report/selectProposalReports',
    method: 'post',
    data
  });
}

// 验证照片完整性、真实性
export function selectTargetReports(data = {}) {
  return request({
    url: '/report/selectTargetReports',
    method: 'post',
    data
  });
}

// 分户赔付率数据
export function selectClaimReportInsureEvidences(data = {}) {
  return request({
    url: '/report/selectClaimReportInsureEvidences',
    method: 'post',
    data
  });
}

// 分户信息详情数据
export function selectPlotReportInsureEvidences(data = {}) {
  return request({
    url: '/report/selectPlotReportInsureEvidences',
    method: 'post',
    data
  });
}

// 分户投保数量数据
export function selectNReportInsureEvidences(data = {}) {
  return request({
    url: '/report/selectNReportInsureEvidences',
    method: 'post',
    data
  });
}

// 分户自缴保费数据
export function selectPReportInsureEvidences(data = {}) {
  return request({
    url: '/report/selectPReportInsureEvidences',
    method: 'post',
    data
  });
}

// 关联保单数据
export function selectJoinPolicies(data = {}) {
  return request({
    url: '/report/selectJoinPolicies',
    method: 'post',
    data
  });
}

// 图像辅助数据
export function selectReportMediaEvidences(data = {}) {
  return request({
    url: '/report/selectReportMediaEvidences',
    method: 'post',
    data
  });
}

// OCR识别数据
export function selectReportOcrEvidences(data = {}) {
  return request({
    url: '/report/selectReportOcrEvidences',
    method: 'post',
    data
  });
}