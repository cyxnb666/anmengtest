import {statusOptions,factorClassifyOptions} from '@/config/options'
export default [
  {
    type: 'index',
    width: '70',
    label: '序号'
  },
  {
    prop: 'targetFunctionName',
    label: '函数名称'
  },
  {
    prop: 'targetFunctionDesc',
    label: '函数描述'
  },
  {
    prop: 'methodName',
    label: '类方法',
    byParent:'methodOptions',
    defaultProps:{
      label:'key',
      value:'value'
    }
  },
  {
    prop: 'classPath',
    label: '类路径'
  },
  {
    prop: 'createTime',
    label: '创建时间'
  },
  {
    slot:'status',
    prop: 'targetFunctionStatus',
    label: '状态',
    options:statusOptions
  }
]
export const handlerBtns = [
  {
    label: '编辑',
    trigger: 'handlerChange',
    sign: 'change'
  },
  {
    slot: 'handlerStatus'
  }
]
