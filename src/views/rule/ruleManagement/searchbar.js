import {ruleNodeOptions,ruleStatusOptions} from '@/config/options'
export default [
  {
    prop: 'ruleName',
    type: 'text',
    label: '规则名称：',
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
    prop: 'ruleNodeList',
    type: 'select',
    label: '规则节点：',
    clearable: true,
    filterable:true, 
    multiple:true,
    options:ruleNodeOptions,
    value: []
  },
  /* {
    prop: 'riskCode',
    type: 'select',
    label: '险种代码：',
    clearable: true,
    filterable:true,
    defaultProp:{
      label:'label',
      value:'riskCode',
    },
    byParent:'riskOptions',
    value: '',
  }, */
  {
    prop: 'ruleState',
    type: 'select',
    label: '状态：',
    clearable: true,
    filterable:true, 
    options:ruleStatusOptions.filter(v=>!v.isDetail),
    value: ''
  },
]
