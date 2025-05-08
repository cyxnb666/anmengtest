export default [
  {
    prop: 'configId',
    type: 'text',
    label: '规则ID：',
    clearable: true,
    value: ''
  },
  {
    prop: 'comCodeList',
    type: 'org',
    label: '所属机构：',
    optionWidth: '248',
    clearable: true,
    value: []
  },
  {
    prop: 'classesCode',
    type: 'select',
    label: '险类：',
    clearable: true,
    filterable: true,
    byParent: 'insuranceTypeOptions',
    value: '',
    change: 'handleConditionChange'
  },
  {
    prop: 'riskCode',
    type: 'select',
    label: '险种：',
    clearable: true,
    filterable: true,
    defaultProp: {
      label: 'label',
      value: 'value'
    },
    byParent: 'riskOptions',
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