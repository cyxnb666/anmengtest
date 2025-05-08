import {statusOptions,factorClassifyOptions} from '@/config/options'

export default [
  {
    prop: 'divisorName',
    type: 'text',
    label: '因子名称：',
    clearable: true,
    value: ''
  },
 /*  {
    prop: 'divisorCode',
    type: 'text',
    label: '因子代码：',
    clearable: true,
    value: ''
  }, */
  
  {
    prop: 'divisorType',
    type: 'select',
    label: '因子分类：',
    clearable: true,
    options:factorClassifyOptions,
    value: ''
  },
]
