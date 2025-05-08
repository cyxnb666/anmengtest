export default [
  {
    prop: 'busiNo',
    type: 'text', 
    label: '投保单号：',
    clearable: true,
    value: ''
  },
  {
    prop: 'comCode',
    type: 'org',
    label: '保单机构：',
    optionWidth: '248',
    clearable: true,
    value: []
  },
  {
    prop: 'riskClass',
    type: 'select',
    label: '险类：',
    clearable: true,
    byParent: 'riskClassOptions',
    value: '',
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
]