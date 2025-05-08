import { insuranceNatureOptions } from '@/config/options'

export default [
  {
    prop: 'comCodeList',
    type: 'org',
    label: '所属机构：',
    optionWidth: '248',
    clearable: true,
    value: []
  },
  {
    prop: 'riskCode',
    type: 'select',
    label: '险种：',
    clearable: true,
    filterable: true,
    defaultProp: {
      label: 'label',
      value: 'riskCode'
    },
    byParent: 'riskOptions',
    value: ''
  },
  {
    prop: 'insuranceNature',
    type: 'select',
    label: '保险性质：',
    clearable: true,
    filterable: true,
    options: insuranceNatureOptions,  // 新增保险性质
    value: ''
  },
  {
    prop: 'configStatus',
    type: 'select',
    label: '状态：',
    clearable: true,
    filterable: true,
    options: [
      {
        label: "暂存",
        value: 'N'
      },
      {
        label: "运行中", 
        value: 'R'
      },
      {
        label: "已下架", 
        value: 'D'
      }
    ],
    value: ''
  }
]