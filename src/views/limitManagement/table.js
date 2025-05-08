import { insuranceNatureOptions } from '@/config/options'

export default [
  {
    type: 'index',
    width: '70',
    label: '序号'
  },
  {
    prop: 'configId',
    label: '规则ID',
    width: 120
  },
  {
    slot: 'comCode',
    label: '机构',
    byParent: 'org',
    sliceNum: 7,
    defaultProps: {
      value: 'comCode',
      label: 'comName'
    }
  },
  {
    prop: 'riskConfig.riskCode',
    label: '险种',
    byParent: 'riskOptions',
    defaultProps: {
      label: "riskName",
      value: "riskCode"
    }
  },
  {
    prop: 'tnatureConfig.natureCode',
    label: '保险性质',
    options: insuranceNatureOptions,
    defaultProps: {
      label: "label",
      value: "value"
    }
  },
  // {
  //   prop: 'singleLimitPremium',
  //   label: '单笔保费限额'
  // },
  {
    prop: 'singleLimitPremium',
    label: '单笔保费限额',
    width: 150,
    formatFn: ({ row }) => {
      if (!row.singleLimitPremium && row.singleLimitPremium !== 0) return '-';
      
      const operatorMap = {
        'lt': '<',
        'le': '≤',
        'eq': '=',
        'ge': '≥',
        'gt': '>'
      };
      
      let operator = operatorMap[row.singleLimitSection] || row.singleLimitSection;
      return `${operator} ${row.singleLimitPremium}`;
    }
  },
  {
    prop: 'accLimitPremium',
    label: '年度累计保费限额',
    width: 150,
    formatFn: ({ row }) => {
      if (!row.accLimitPremium && row.accLimitPremium !== 0) return '-';
      
      const operatorMap = {
        'lt': '<',
        'le': '≤',
        'eq': '=',
        'ge': '≥',
        'gt': '>'
      };
      
      let operator = operatorMap[row.accLimitSection] || row.accLimitSection;
      return `${operator} ${row.accLimitPremium}`;
    }
  },
  {
    prop: 'singleLimitCoverage',
    label: '单笔保额限额',
    width: 150,
    formatFn: ({ row }) => {
      if (!row.singleLimitCoverage && row.singleLimitCoverage !== 0) return '-';
      
      const operatorMap = {
        'lt': '<',
        'le': '≤',
        'eq': '=',
        'ge': '≥',
        'gt': '>'
      };
      
      let operator = operatorMap[row.singleCoverageSection] || row.singleCoverageSection;
      return `${operator} ${row.singleLimitCoverage}`;
    }
  },
  {
    prop: 'accLimitCoverage',
    label: '年度累计保额限额',
    width: 150,
    formatFn: ({ row }) => {
      if (!row.accLimitCoverage && row.accLimitCoverage !== 0) return '-';
      
      const operatorMap = {
        'lt': '<',
        'le': '≤',
        'eq': '=',
        'ge': '≥',
        'gt': '>'
      };
      
      let operator = operatorMap[row.accCoverageSection] || row.accCoverageSection;
      return `${operator} ${row.accLimitCoverage}`;
    }
  },
  {
    slot: 'status',
    label: '状态',
    width: 90
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    formatFn: ({ cellValue }) => {
      return cellValue ? cellValue.substring(0, 19).replace('T', ' ') : '';
    }
  },
  {
    prop: 'updateTime',
    label: '更新时间', 
    width: 180,
    formatFn: ({ cellValue }) => {
      return cellValue ? cellValue.substring(0, 19).replace('T', ' ') : '';
    }
  }
]

export const handlerBtns = [
  {
    label: '查看',
    trigger: 'handlerChange',
    sign: 'view',
  },
  {
    label: '发布',
    slot: 'handlerRelease',
  },
  {
    label: '编辑',
    slot: 'handlerChange',
  },
  {
    label: '下架',
    slot: 'handlerDelist'
  },
  {
    label: '删除',
    slot: 'del',
  }
]