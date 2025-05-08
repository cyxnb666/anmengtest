import { ruleStatusOptions } from '@/config/options'

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
    prop: 'classesCode',
    label: '险类',
    byParent: 'insuranceTypeOptions'
  },
  {
    prop: 'riskCode',
    label: '险种',
    byParent: 'allRiskOptions',
    defaultProps: {
      label: "riskName",
      value: "riskCode"
    }
  },
  {
    prop: 'rule',
    label: '规则',
    width: 180,
    formatFn: () => '投保数量(头/只)/地块面积(亩)'
  },
  {
    prop: 'quantity',
    label: '头/只/面积',
    width: 120,
    formatFn: ({ row }) => {
      if (!row.ruleValue && row.ruleValue !== 0) return '-';
      
      const operatorMap = {
        'lt': '<',
        'le': '≤',
        'eq': '=',
        'ge': '≥',
        'gt': '>'
      };
      
      let operator = operatorMap[row.ruleSecition] || row.ruleSecition;
      return `${operator} ${row.ruleValue}`;
    }
  },
  {
    prop: 'errorRate',
    label: '勾画面积误差率(%)',
    width: 150,
    formatFn: ({ row }) => {
      if (!row.mistakeValue && row.mistakeValue !== 0) return '-';
      
      const operatorMap = {
        'lt': '<',
        'le': '≤',
        'eq': '=',
        'ge': '≥',
        'gt': '>'
      };
      
      let operator = operatorMap[row.mistakeSecition] || row.mistakeSecition;
      return `${operator} ${row.mistakeValue}`;
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
    slot: 'handlerDelist',
  },
  {
    label: '删除',
    slot: 'del',
  }
]